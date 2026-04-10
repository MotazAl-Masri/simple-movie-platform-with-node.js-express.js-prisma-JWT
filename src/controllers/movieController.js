const { db } = require("../config/DB.js");
const { redisClient } = require("../config/redis.js");
const { notificationQueue } = require("../queues/notificationQueue");

// ================= GET ALL MOVIES =================
// ميزة: جلب من الكاش أولاً لتخفيف الضغط عن PostgreSQL
const getAllMovies = async (req, res) => {
  try {
    const cacheKey = "movies";

    // محاولة جلب البيانات من Redis
    const cachedMovies = await redisClient.get(cacheKey);

    if (cachedMovies) {
      console.log(" Serving from Redis Cache");
      return res.status(200).json({
        data: JSON.parse(cachedMovies),
        message: "Movies retrieved successfully (from cache)",
        status: "200 OK",
      });
    }

    // إذا لم تكن موجودة، نجلبها من قاعدة البيانات
    const movies = await db.movie.findMany({
      orderBy: { createdAt: "desc" },
    });

    // تخزين النتائج في Redis لمدة 60 ثانية
    await redisClient.setEx(cacheKey, 60, JSON.stringify(movies));

    console.log(" Serving from Database");
    return res.status(200).json({
      data: movies,
      message: "Movies retrieved successfully from database",
      status: "200 OK",
    });
  } catch (error) {
    console.error(" Error retrieving movies:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving movies",
      status: "500 Internal Server Error",
    });
  }
};

// ================= GET MOVIE BY ID =================
const getMovieById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const cacheKey = `movie:${id}`;

    const cachedMovie = await redisClient.get(cacheKey);

    if (cachedMovie) {
      return res.status(200).json({
        data: JSON.parse(cachedMovie),
        message: "Movie retrieved successfully (from cache)",
        status: "200 OK",
      });
    }

    const movie = await db.movie.findUnique({
      where: { id },
    });

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
        status: "404 Not Found",
      });
    }

    await redisClient.setEx(cacheKey, 60, JSON.stringify(movie));

    return res.status(200).json({
      data: movie,
      message: "Movie retrieved successfully from database",
      status: "200 OK",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving the movie" });
  }
};

// ================= ADD MOVIE =================
const addMovie = async (req, res) => {
  try {
    // 1. استخراج البيانات (تم التحقق منها مسبقاً عبر Zod middleware)
    const {
      title,
      overview,
      releaseYear,
      genres,
      runtime,
      posterUrl,
      anotherTitles,
      rating,
    } = req.body;

    // 2. سحب المعرف من التوكن لضمان الأمان
    const DirectorId = req.user.id;

    // 3. إنشاء السجل في قاعدة البيانات
    const newMovie = await db.movie.create({
      data: {
        title: title,
        overview: overview,
        releaseYear: releaseYear,
        genres: genres || [],
        runtime: runtime,
        posterUrl: posterUrl, // لا نقوم بتشفير الروابط بـ bcrypt أبداً
        anotherTitles: anotherTitles || [],
        directorId: DirectorId,
        rating: rating,
      },
    });

    // 4. 🔥 إبطال الكاش القديم (Cache Invalidation)
    await redisClient.del("movies");

    // 5. 🚀 إضافة مهمة لـ BullMQ لإرسال إشعارات أو معالجة صور خلف الكواليس
    await notificationQueue.add("process-movie-image", {
      movieId: newMovie.id,
      title: newMovie.title,
      posterUrl: newMovie.posterUrl,
      addedBy: req.user.username,
    });

    return res.status(201).json({
      message: "Movie added and processing job queued!",
      status: "201 Created",
      data: newMovie,
    });
  } catch (error) {
    console.error(" Error adding movie:", error);
    return res.status(500).json({
      message: error.message,
      status: "500 Internal Server Error",
    });
  }
};

// ================= UPDATE MOVIE =================
const updateMovie = async (req, res) => {
  const id = Number(req.params.id);
  try {
    // تحديث البيانات مع الحفاظ على directorId الأصلي
    const updatedMovie = await db.movie.update({
      where: { id },
      data: req.body,
    });

    // إبطال الكاش لهذا الفيلم وللقائمة الكاملة
    await redisClient.del(`movie:${id}`);
    await redisClient.del("movies");

    return res.status(200).json({
      message: "Movie updated successfully",
      status: "200 OK",
      data: updatedMovie,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while updating" });
  }
};

// ================= DELETE MOVIE =================
const deleteMovie = async (req, res) => {
  const id = Number(req.params.id);
  try {
    await db.movie.delete({
      where: { id },
    });

    await redisClient.del(`movie:${id}`);
    await redisClient.del("movies");

    return res.status(200).json({
      message: "Movie deleted successfully",
      status: "200 OK",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred while deleting" });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
};
