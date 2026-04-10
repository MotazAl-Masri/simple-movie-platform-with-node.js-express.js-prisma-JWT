const express = require("express");
const router = express.Router();

const {
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
} = require("../controllers/watchlistController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");
const {
  addToWatchlistItemSchema,
  updateWatchlistItemSchema,
} = require("../models/WatchlistItem");
//Auth apis for watchlist

router.use(authMiddleware);
router.post("/", validateRequest(addToWatchlistItemSchema), addToWatchlist);
router.put(
  "/:id",
  validateRequest(updateWatchlistItemSchema),
  updateWatchlistItem,
);
router.delete("/:id", removeFromWatchlist);

module.exports = {
  router,
};
