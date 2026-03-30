const joi = require("joi");
const { PrismaClient } = require("../generated/prisma");
const db = new PrismaClient();

//validate user input for registration and login
const validateUserRegistration = (obj) => {
  const schema = joi.object({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(obj, { abortEarly: false });
};

const validateUserLogin = (obj) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
  });
  return schema.validate(obj, { abortEarly: false });
};

module.exports = {
  validateUserRegistration,
  validateUserLogin,
};
