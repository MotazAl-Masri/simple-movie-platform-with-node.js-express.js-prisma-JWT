const { redisClient } = require("../config/redis.js");

const redisTest = async (req, res) => {
  try {
    await redisClient.set("testKey", 120, "Hello Redis!");
    const value = await redisClient.get("testKey");
    res.json({ message: "Redis is working!", value });
  } catch (error) {
    console.error("Redis test failed ", error);
    res
      .status(500)
      .json({ message: "Redis test failed", error: error.message });
  }
};

module.exports = {
  redisTest,
};
