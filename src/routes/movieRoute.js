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
router.get("/idexMovies", getAllMovies);
router.get("/idexMovies/:id", getMovieById);
//Middleware to protect routes that require authentication
router.use(authMiddleware);
router.post("/idexMovies", addMovie);
router.put("/idexMovies/:id", updateMovie);
router.delete("/idexMovies/:id", deleteMovie);

module.exports = {
  router,
};
