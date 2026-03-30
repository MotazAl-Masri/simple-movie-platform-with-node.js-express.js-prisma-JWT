const express = require("express");
const { db } = require("../config/DB.js");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utlis/generateToken.js");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  //check if user already exists
  const existingUser = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  if (existingUser) {
    return res.status(400).json({
      message: "User already exists with this email",
      status: "400 Bad Request",
    });
  }

  //Hash the password before saving to the database (for security)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create new user in the database
  const newUser = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  const token = generateToken(newUser.id, res);
  //Return the new user
  return res.status(201).json({
    message: "User registered successfully",
    status: "201 Created",
    data: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      token: token,
    },
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //Check if user exists
  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
      status: "401 Unauthorized",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid credentials",
      status: "401 Unauthorized",
    });
  }
  const token = generateToken(user.id, res);
  return res.status(201).json({
    message: "User logged in successfully",
    status: "201 Created",
    data: {
      id: user.id,
      email: user.email,
      token: token,
    },
  });
};

const logoutUser = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({
    message: "User logged out successfully",
    status: "200 OK",
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
