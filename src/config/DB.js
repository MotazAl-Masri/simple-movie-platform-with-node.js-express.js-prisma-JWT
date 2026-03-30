const { PrismaClient } = require("../generated/prisma");

const db = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

const connectDB = async () => {
  try {
    await db.$connect();
    console.log("Database connected via Prisma successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await db.$disconnect();
    console.log("Database disconnected via Prisma successfully!");
  } catch (error) {
    console.error("Database disconnection failed:", error);
    process.exit(1);
  }
};

module.exports = {
  db,
  connectDB,
  disconnectDB,
};
