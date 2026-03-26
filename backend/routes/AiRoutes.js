import express from "express";
import {
  createInvoiceWithAI,
  generateReminderEmail,
  getAIDashboardInsights,
  generateAllReminders,
} from "../controllers/AiControllers.js";
import authMiddlware from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.use(authMiddlware);

router.post("/createInvoiceWithAI", createInvoiceWithAI);

router.post("/generateReminder", generateReminderEmail);

router.post("/generateAllReminders", generateAllReminders);

router.get("/insights", getAIDashboardInsights);

export default router;
