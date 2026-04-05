const { Queue } = require("bullmq");

const notificationQueue = new Queue("notificationQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    maxRetriesPerRequest: null,
  },
});

module.exports = {
  notificationQueue,
};
