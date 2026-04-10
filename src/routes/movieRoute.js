const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validateRequest");
const { AddMovieSchema, UpdateMovieSchema } = require("../models/Movie");
const movieController = require("../controllers/movieController");

// الـ Public Routes
router.get("/indexMovies", movieController.getAllMovies);
router.get("/indexMovies/:id", movieController.getMovieById);

// الـ Protected Routes
router.use(authMiddleware); // أي شي تحت هذا السطر يتطلب Token

console.log("AddMovieSchema Check:", AddMovieSchema);

router.post(
  "/addMovies",
  validateRequest(AddMovieSchema),
  movieController.addMovie,
);

router.put(
  "/updateMovies/:id",
  validateRequest(UpdateMovieSchema),
  movieController.updateMovie,
);

router.delete("/deleteMovies/:id", movieController.deleteMovie);

module.exports = { router };
