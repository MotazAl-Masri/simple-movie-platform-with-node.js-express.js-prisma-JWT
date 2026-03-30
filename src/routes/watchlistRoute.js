const express = require("express");
const router = express.Router();

const {
  addToWatchlist,
  updateWatchlistItem,
  removeFromWatchlist,
} = require("../controllers/watchlistController");

const { authMiddleware } = require("../middleware/authMiddleware");

//Auth apis for watchlist

router.use(authMiddleware);
router.post("/", addToWatchlist);
router.put("/:id", updateWatchlistItem);
router.delete("/:id", removeFromWatchlist);

module.exports = {
  router,
};
