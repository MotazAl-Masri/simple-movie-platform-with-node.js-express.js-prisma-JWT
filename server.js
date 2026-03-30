const express = require("express");
const crypto = require("crypto");
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
// apis

app.use("/api/movies", movieRouter);
app.use("/api/auth", authRouter);
app.use("/api/watchlist", watchlistRouter);
app.get("/", (req, res) => {
  res.json({
    message: "Hello, World!",
    status: "200 OK",
  });
});

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

const secret = crypto.randomBytes(32).toString("base64");
console.log("Generated Secret Key:", secret);
