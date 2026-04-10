const { PrismaClient } = require("../generated/prisma");
const { redisClient } = require("../config/redis.js");
const db = new PrismaClient();

const {
  validateAddToWatchlistItemInput,
  validateUpdateWatchlistItemInput,
} = require("../models/WatchlistItem");

const getWatchlist = async (req, res) => {
  try {
    if (!watchlistItems) {
      return res.status(404).json({
        message: "Watchlist not found",
      });
    }

    const userId = req.user.id;
    const cachKey = `watchlist:${userId}`;

    const cachedData = await redisClient.get(cachKey);
    if (cachedData) {
      const paresedWatchlist = JSON.parse(cachedData);
      console.log("from cache");

      return res.status(200).json({
        status: "success",
        data: paresedWatchlist,
        source: "cache",
      });
    }

    const watchlistItems = await db.watchlistItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        movie: true,
      },
    });

    await redisClient.setEx(cachKey, 60, JSON.stringify(watchlistItems));
    console.log("from database");
    return res.status(200).json({
      status: "success",
      data: watchlistItems,
      source: "database",
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while retrieving the watchlist",
    });
  }
};

const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  const movie = await db.movie.findUnique({
    where: {
      id: Number(movieId),
    },
  });

  if (!movie) {
    return res.status(404).json({
      message: "Movie not found",
    });
  }

  const existingInWatchlist = await db.watchlistItem.findFirst({
    where: {
      userId: req.user.id,
      movieId: Number(movieId),
    },
  });
  if (existingInWatchlist) {
    return res.status(400).json({
      message: "Movie already in watchlist",
    });
  }

  const watchlistItem = await db.watchlistItem.create({
    data: {
      userId: req.user.id,
      movieId: movieId,
      status: status || "PLANNED",
      rating: rating,
      notes: notes,
    },
  });
  await redisClient.del(`watchlist:${req.user.id}`);

  res.status(201).json({
    message: "Movie added to watchlist",
    watchlistItem,
  });
};

const updateWatchlistItem = async (req, res) => {
  const { status, rating, notes } = req.body;

  const id = Number(req.params.id);

  // Find item
  const watchlistItem = await db.watchlistItem.findUnique({
    where: { id },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  // Check owner
  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      error: "Not allowed to update this watchlist item",
    });
  }

  // Build update object
  const updateData = {};
  if (status !== undefined) updateData.status = status.toUpperCase();
  if (rating !== undefined) updateData.rating = rating;
  if (notes !== undefined) updateData.notes = notes;

  const updatedItem = await db.watchlistItem.update({
    where: { id },
    data: updateData,
  });

  await redisClient.del(`watchlist:${req.user.id}`);

  res.status(200).json({
    status: "success",
    data: updatedItem,
  });
};

const removeFromWatchlist = async (req, res) => {
  const id = Number(req.params.id);

  const watchlistItem = await db.watchlistItem.findUnique({
    where: { id },
  });

  if (!watchlistItem) {
    return res.status(404).json({ error: "Watchlist item not found" });
  }

  if (watchlistItem.userId !== req.user.id) {
    return res.status(403).json({
      error: "Not allowed to delete this item",
    });
  }

  await db.watchlistItem.delete({
    where: { id },
  });

  res.status(200).json({
    message: "Deleted successfully",
  });
};
module.exports = {
  getWatchlist,
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
};
