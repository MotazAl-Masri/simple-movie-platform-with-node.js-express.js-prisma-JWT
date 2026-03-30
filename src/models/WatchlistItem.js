const joi = require("joi");

const { PrismaClient } = require("../generated/prisma");

const db = new PrismaClient();

//validate WatchlistItem input for add and update
const validateAddToWatchlistItemInput = (obj) => {
  const schema = joi.object({
    movieId: joi.number().integer().required(),
    status: joi
      .string()
      .valid("PLANNED", "WATCHING", "COMPLETED", "DROPPED")
      .required(),
    notes: joi.string().max(1000).optional(),
    rating: joi.number().min(0).max(10).optional(),
  });
  return schema.validate(obj, { abortEarly: false });
};

const validateUpdateWatchlistItemInput = (obj) => {
  const schema = joi
    .object({
      status: joi
        .string()
        .valid("PLANNED", "WATCHING", "COMPLETED", "DROPPED")
        .optional(),
      notes: joi.string().max(1000).optional(),
      rating: joi.number().min(0).max(10).optional(),
    })
    .or("status", "notes", "rating"); // At least one of these fields must be provided
  return schema.validate(obj, { abortEarly: false });
};

module.exports = {
  validateAddToWatchlistItemInput,
  validateUpdateWatchlistItemInput,
};
