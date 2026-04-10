const express = require("express");
const router = express.Router();
const { RegisterSchema, LoginSchema } = require("../models/User");
const { validateRequest } = require("../middleware/validateRequest");
//Auth apis
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

router.post("/register", validateRequest(RegisterSchema), registerUser);

router.post("/login", validateRequest(LoginSchema), loginUser);

router.post("/logout", logoutUser);

module.exports = {
  router,
};
