import { Worker } from "bullmq";
import { sendEmailReminder } from "../controllers/AiControllers.js";
import redisConnection from "../config/redis.js";

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    console.log(`Processing job for: ${job.data.clientName}`);
    await sendEmailReminder(job.data);
    console.log(`Finished job for: ${job.data.clientName}`);
  },
  {
    connection: redisConnection,
    skipVerSionCheck: true,
  }
);

emailWorker.on("completed", (job) => {
  console.log(`Email sent successfully to: ${job.data.clientName}`);
});

emailWorker.on("failed", (job, err) => {
  console.error(`Failed to send email to ${job.data.clientName}: ${err.message}`);
});