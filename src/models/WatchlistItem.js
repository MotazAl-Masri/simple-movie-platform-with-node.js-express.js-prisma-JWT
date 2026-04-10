const z = require("zod");

const addToWatchlistItemSchema = z.object({
  movieId: z.number().int().positive(),
  status: z
    .enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
      error: () => ({
        message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED",
      }),
    })
    .optional(),
  rating: z.coerce
    .number()
    .int("rating must be an integer")
    .min(1, "rating must be at least 1")
    .max(10, "rating must be at most 10")
    .optional(),
  notes: z.string().max(500, "notes must be at most 500 characters").optional(),
});

const updateWatchlistItemSchema = z.object({
  status: z
    .enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
      error: () => ({
        message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED",
      }),
    })
    .optional(),
  rating: z.coerce
    .number()
    .int("rating must be an integer")
    .min(1, "rating must be at least 1")
    .max(10, "rating must be at most 10")
    .optional(),
  notes: z.string().max(500, "notes must be at most 500 characters").optional(),
});

module.exports = { addToWatchlistItemSchema, updateWatchlistItemSchema };
