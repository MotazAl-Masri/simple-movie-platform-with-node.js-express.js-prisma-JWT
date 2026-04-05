const { Worker } = require("bullmq");

const worker = new Worker(
  "notificationQueue",
  async (job) => {
    console.log("Processing job:", job.data);
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      maxRetriesPerRequest: null,
    },
  },
);

module.exports = {
  worker,
};
