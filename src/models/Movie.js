const joi = require("joi");

const { PrismaClient } = require("../generated/prisma");

const db = new PrismaClient();

//validate movie input for registration and login
const validateMovieInput = (obj) => {
  const schema = joi.object({
    title: joi.string().min(1).max(255).required(),
    description: joi.string().min(1).required(),
    directorId: joi.number().integer().required(),
    releaseYear: joi
      .number()
      .integer()
      .min(1888)
      .max(new Date().getFullYear())
      .required(),
    rating: joi.number().min(0).max(10).optional(),
  });
  return schema.validate(obj, { abortEarly: false });
};

module.exports = {
  validateMovieInput,
};
