const z = require("zod");

const AddMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  releaseYear: z
    .number()
    .int("Release year must be an integer")
    .min(1888, "Release year must be 1888 or later")
    .max(new Date().getFullYear(), "Release year cannot be in the future"),
  genres: z
    .array(z.string())
    .min(1, "At least one genre is required")
    .optional()
    .default([]),
  overview: z.string().optional(),
  runtime: z.number().int("Runtime must be an integer").optional(),
  posterUrl: z.string().url("Poster URL must be a valid URL").optional(),
  anotherTitles: z.array(z.string()).optional().default([]),
  rating: z.coerce
    .number()
    .int("Rating must be an integer")
    .min(0, "Rating must be a positive number")
    .max(10, "Rating must be a number between 0 and 10")
    .optional(),
});

const UpdateMovieSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  releaseYear: z
    .number()
    .int("Release year must be an integer")
    .min(1888, "Release year must be 1888 or later")
    .max(new Date().getFullYear(), "Release year cannot be in the future")
    .optional(),
  genre: z.string().optional(),
  overview: z.string().optional(),
  runtime: z.number().int("Runtime must be an integer").optional(),
  posterUrl: z.string().url("Poster URL must be a valid URL").optional(),
  anotherTitles: z.string().optional(),
  rating: z.coerce
    .number()
    .int("Rating must be an integer")
    .min(0, "Rating must be a positive number")
    .max(10, "Rating must be a number between 0 and 10")
    .optional(),
});

module.exports = { AddMovieSchema, UpdateMovieSchema };
