const joi = require("joi");

const { PrismaClient } = require("../generated/prisma");

const db = new PrismaClient();

//validate movie input for registration and login
const validateAddNewMovieInput = (obj) => {
  const schema = joi.object({
    title: joi.string().min(1).max(255).required(),
    overview: joi.string().min(1).optional(),
    genres: joi.array().items(joi.string()).required(),
    runtime: joi.number().integer().min(1).required(),
    posterUrl: joi.string().uri().optional(),
    directorId: joi.number().integer().required(),
    releaseYear: joi
      .number()
      .integer()
      .min(1888)
      .max(new Date().getFullYear())
      .required(),
    rating: joi.number().min(0).max(10).optional(),
    anotherTitles: joi.array().items(joi.string()).optional(),
  });
  return schema.validate(obj, { abortEarly: false });
};

const validateUpdateMovieInput = (obj) => {
  const schema = joi.object({
    title: joi.string().min(1).max(255).optional(),
    overview: joi.string().min(1).optional(),
    genres: joi.array().items(joi.string()).optional(),
    runtime: joi.number().integer().min(1).optional(),
    posterUrl: joi.string().uri().optional(),
    directorId: joi.number().integer().optional(),
    releaseYear: joi
      .number()
      .integer()
      .min(1888)
      .max(new Date().getFullYear())
      .optional(),
    rating: joi.number().min(0).max(10).optional(),
    anotherTitles: joi.array().items(joi.string()).optional(),
  });
  return schema.validate(obj, { abortEarly: false });
};

const validateDeleteMovieInput = (obj) => {
  const schema = joi.object({
    id: joi.number().integer().required(),
  });
  return schema.validate(obj, { abortEarly: false });
};

module.exports = {
  validateAddNewMovieInput,
  validateUpdateMovieInput,
};
