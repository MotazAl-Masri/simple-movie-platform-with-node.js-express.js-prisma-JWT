const express = require("express");
const router = express.Router();

const {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");

const { authMiddleware } = require("../middleware/authMiddleware");
//Movie apis
router.get("/indexMovies", getAllMovies);
router.get("/indexMovies/:id", getMovieById);
//Middleware to protect routes that require authentication
router.use(authMiddleware);
router.post("/addMovies", addMovie);
router.put("/updateMovies/:id", updateMovie);
router.delete("/deleteMovies/:id", deleteMovie);

module.exports = {
  router,
};
