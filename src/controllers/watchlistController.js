const { PrismaClient } = require("../generated/prisma");

const db = new PrismaClient();

const {
  validateAddToWatchlistItemInput,
  validateUpdateWatchlistItemInput,
} = require("../models/WatchlistItem");

const addToWatchlist = async (req, res) => {
  const { movieId, status, rating, notes } = req.body;

  const movie = await db.movie.findUnique({
    where: {
      id: movieId,
    },
  });
  const { error } = validateAddToWatchlistItemInput(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }
  if (!movie) {
    return res.status(404).json({
      message: "Movie not found",
    });
  }

  const existingInWatchlist = await db.watchlistItem.findFirst({
    where: {
      userId: req.user.id,
      movieId: movieId,
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
  const { error } = validateUpdateWatchlistItemInput(req.body);
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }
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
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
};
