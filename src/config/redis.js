const { createClient } = require("redis");

// نستخدم URL كامل لأنه الطريقة القياسية والأكثر أماناً لربط الـ Cloud والـ Docker
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://redis:6379",
});

redisClient.on("error", (err) => {
  console.error("❌ Redis Error", err);
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis connected successfully");
    }
  } catch (err) {
    console.error("❌ Could not connect to Redis", err);
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
