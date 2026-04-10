const { Worker } = require("bullmq");
const { connectDB } = require("../config/DB");

connectDB();

const connection = {
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
};

const worker = new Worker(
  "main-tasks", // نفس الاسم تماماً
  async (job) => {
    // هنا نكتب المنطق البرمجي
    console.log(` Processing Job ID: ${job.id} | Type: ${job.name}`);

    switch (job.name) {
      case "send-welcome-email":
        console.log(" Sending email to:", job.data.email);
        break;
      case "process-movie-image":
        console.log(" Processing image for movie:", job.data.movieId);
        break;
      default:
        console.log(" Unknown job type");
    }
  },
  { connection },
);

worker.on("failed", (job, err) => {
  console.error(` Job ${job.id} failed: ${err.message}`);
});
