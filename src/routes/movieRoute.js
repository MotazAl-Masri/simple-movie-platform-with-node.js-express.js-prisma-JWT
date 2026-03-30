const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    httpMethod: "GET",
    message: "Here are all the movies!",
    status: "200 OK",
  });
});

module.exports = {
  router,
};
