const bcrypt = require("../../node_modules/bcryptjs");
const { db } = require("../config/DB.js");
const { prismaClient } = require("../generated/prisma");
const { redisClient } = require("../config/redis.js");

const {
  validateAddNewMovieInput,
  validateUpdateMovieInput,
  validateDeleteMovieInput,
} = require("../models/Movie");

const getAllMovies = async (req, res) => {
  try {
    const cachKey = "movies";

    // Check if movies are cached in Redis
    //fetch movies from redis cache
    const cachedMovies = await redisClient.get(cachKey);

    if (cachedMovies) {
      console.log("from Redis");
      return res.status(200).json({
        data: JSON.parse(cachedMovies),
        message: "Movies retrieved successfully (from cache)",
        status: "200 OK",
      });
    }
    //fetch movies from database
    const movies = await db.movie.findMany();
    await redisClient.set(cachKey, 60, JSON.stringify(movies)); // Cache movies in Redis for 60 seconds
    console.log("from database");
    return res.status(200).json({
      message: "Movies retrieved successfully from database",
      status: "200 OK",
      data: movies,
    });
  } catch (error) {
    console.error("Error retrieving movies:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving movies",
      status: "500 Internal Server Error",
    });
  }
};

const getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await db.movie.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
        status: "404 Not Found",
      });
    }
    return res.status(200).json({
      message: "Movie retrieved successfully",
      status: "200 OK",
      data: movie,
    });
  } catch (error) {
    console.error("Error retrieving movie:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving the movie",
      status: "500 Internal Server Error",
    });
  }
};

const addMovie = async (req, res) => {
  const {
    title,
    overview,
    releaseyear,
    genres,
    runtime,
    posterUrl,
    anotherTitles,
    directorId,
    rating,
  } = req.body;
  const error = validateAddNewMovieInput({
    title,
    overview,
    releaseyear,
    genres,
    runtime,
    posterUrl,
    anotherTitles,
    directorId,
    rating,
  }).error;
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      status: "400 Bad Request",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedUrl = await bcrypt.hash(posterUrl, salt);
  try {
    const newMovie = await db.movie.create({
      data: {
        title: title,
        overview: overview,
        releaseYear: releaseyear,
        genres: genres,
        runtime: runtime,
        posterUrl: hashedUrl,
        anotherTitles: anotherTitles,
        directorId: directorId,
        rating: rating,
      },
    });
    return res.status(201).json({
      message: "Movie added successfully",
      status: "201 Created",
      data: newMovie,
    });
  } catch (error) {
    console.error("Error adding movie:", error);
    return res.status(500).json({
      message: "An error occurred while adding the movie",
      status: "500 Internal Server Error",
    });
  }
};

const updateMovie = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    overview,
    releaseyear,
    genres,
    runtime,
    posterUrl,
    anotherTitles,
    directorId,
    rating,
  } = req.body;
  const error = validateUpdateMovieInput({
    title,
    overview,
    releaseyear,
    genres,
    runtime,
    posterUrl,
    anotherTitles,
    directorId,
    rating,
  }).error;
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      status: "400 Bad Request",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedUrl = await bcrypt.hash(posterUrl, salt);
  try {
    const updatedMovie = await db.movie.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: title,
        overview: overview,
        releaseYear: releaseyear,
        genres: genres,
        runtime: runtime,
        posterUrl: hashedUrl,
        anotherTitles: anotherTitles,
        directorId: directorId,
        rating: rating,
      },
    });
    return res.status(200).json({
      message: "Movie updated successfully",
      status: "200 OK",
      data: updatedMovie,
    });
  } catch (error) {
    console.error("Error updating movie:", error);
    return res.status(500).json({
      message: "An error occurred while updating the movie",
      status: "500 Internal Server Error",
    });
  }
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  const error = validateDeleteMovieInput({ id }).error;
  try {
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
        status: "400 Bad Request",
      });
    }
    await db.movie.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({
      message: "Movie deleted successfully",
      status: "200 OK",
    });
  } catch (error) {
    console.error("Error validating input:", error);
    return res.status(500).json({
      message: "An error occurred while validating input",
      status: "500 Internal Server Error",
    });
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
};
