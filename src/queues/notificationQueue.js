const { Queue } = require("bullmq");

// نصيحة: استخدم اسم الخدمة 'redis' مباشرة إذا كنت داخل Docker
const connection = {
  host: "redis", // ⚠️ تأكد أنها redis وليست localhost أو 127.0.0.1
  port: 6379,
  maxRetriesPerRequest: null,
};

const notificationQueue = new Queue("main-tasks", { connection });

module.exports = { notificationQueue };
