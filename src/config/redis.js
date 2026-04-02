const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PW,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// error handling
redisClient.on("error", (err) => {
  console.error("Redis Error ", err);
});

// connect function
const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected ");
  } catch (error) {
    console.error("Redis connection failed ", error);
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
