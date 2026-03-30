const express = require("express");
const xss = require("xss-clean");
const ratinglimit = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");

//error handler middleware
const { notFound, errorHandler } = require("./src/middleware/errors");

//import routes
const movieRouter = require("./src/routes/movieRoute").router;
const authRouter = require("./src/routes/authRoutes").router;
const watchlistRouter = require("./src/routes/watchlistRoute").router;
const dotenv = require("dotenv");

const { connectDB, disconnectDB } = require("./src/config/DB");

dotenv.config();
connectDB();
const app = express();

const PORT = process.env.PORT || 3000;
//Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//security middleware to set various HTTP headers for protection against common vulnerabilities
app.use(helmet());

//prevent HTTP parameter pollution attacks
app.use(hpp());
//Data sanitization against XSS attacks
app.use(xss());
//Rate limiting middleware to prevent brute-force attacks
app.use(
  ratinglimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 20, // limit each IP to 20 requests per windowMs
    message:
      "Too many requests from this IP, please try again after 10 minutes",
  }),
);
// apis

app.use("/api/movies", movieRouter);
app.use("/api/auth", authRouter);
app.use("/api/watchlist", watchlistRouter);

// error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  Server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  Server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
