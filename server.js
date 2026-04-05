const express = require("express");
const dotenv = require("dotenv");
const ratinglimit = require("express-rate-limit");

dotenv.config();

// استيراد إعدادات الاتصال
const { connectDB, disconnectDB } = require("./src/config/DB");
const { connectRedis, redisClient } = require("./src/config/redis.js");

// استيراد الميدل وير والروتر
const { notFound, errorHandler } = require("./src/middleware/errors");
const movieRouter = require("./src/routes/movieRoute").router;
const authRouter = require("./src/routes/authRoutes").router;
const watchlistRouter = require("./src/routes/watchlistRoute").router;
const redisRoute = require("./src/routes/redisRoute.js");

// إعداد بيئة العمل

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - تم رفعه قليلاً لسهولة الاختبار في التطوير
const limiter = ratinglimit({
  windowMs: 10 * 60 * 1000, // 10 دقائق
  max: 100, // مسموح بـ 100 طلب بدل 20 لتجنب الحظر الذاتي أثناء التست
  message: "Too many requests from this IP, please try again after 10 minutes",
});
app.use(limiter);

// 2. Routes
app.use("/api/movies", movieRouter);
app.use("/api/auth", authRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/redis", redisRoute);

// 3. Error Handling (يجب أن تكون بعد الروتس)
app.use(notFound);
app.use(errorHandler);

// --- وظيفة تشغيل السيرفر الاحترافية ---
let server; // تعريف متغير السيرفر للوصول إليه في الـ Shutdown

const startServer = async () => {
  try {
    console.log("⏳ Starting services...");

    // أولوية الاتصال لقاعدة البيانات
    await connectDB();
    console.log("✅ Database Connected");

    // الاتصال بـ Redis وانتظاره
    await connectRedis();
    // تأكد أن دالة connectRedis ترجع Promise (عن طريق await redisClient.connect())

    server = app.listen(PORT, () => {
      console.log(
        `🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`,
      );
    });
  } catch (error) {
    console.error("❌ Critical Failure: Could not start server", error);
    process.exit(1);
  }
};

// تشغيل السيرفر
startServer();

// --- التعامل مع الإغلاق النظيف (Graceful Shutdown) ---
const gracefulShutdown = async (signal) => {
  console.log(`\n[${signal}] Received. Closing HTTP server...`);

  if (server) {
    server.close(async () => {
      console.log("HTTP server closed.");

      try {
        // إغلاق اتصالات قواعد البيانات
        await disconnectDB();
        if (redisClient.isOpen) {
          await redisClient.quit();
          console.log("Redis connection closed.");
        }
        console.log("Cleanup finished. Exiting safely.");
        process.exit(0);
      } catch (err) {
        console.error("Error during cleanup:", err);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

// الاستماع لإشارات نظام التشغيل لإغلاق السيرفر
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// التعامل مع الأخطاء غير المتوقعة التي لا يمسكها الـ Catch
process.on("unhandledRejection", (err) => {
  console.error("🚨 Unhandled Rejection:", err);
  // نترك السيرفر شغالاً أو نغلقه حسب سياسة الـ Availability لديك
});

process.on("uncaughtException", (err) => {
  console.error("🚨 Uncaught Exception:", err);
  gracefulShutdown("Uncaught Exception");
});
