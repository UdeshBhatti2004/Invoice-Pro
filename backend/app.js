import dns from "dns";
dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/DbConnection.js";
import redisClient from "./config/redis.js";
import authRoutes from "./routes/AuthRoutes.js";
import invoiceRoutes from "./routes/InvoiceRoutes.js";
import dashboardRoutes from "./routes/DashboardRoutes.js";
import aiRoutes from "./routes/AiRoutes.js";
import clientRoute from "./routes/ClientRoute.js";
import "./worker/reminderWorker.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;


connectDB();

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});


app.use(express.json());


app.use(
  cors({
    origin: "*",
  })
);

// Ping route (for UptimeRobot)
app.get("/ping", (req, res) => {
  res.send("OK");
});


app.use("/auth", authRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/ai", aiRoutes);
app.use("/clients", clientRoute);


app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});