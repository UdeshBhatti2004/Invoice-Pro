import express from "express";
import authMiddlware from "../middleware/AuthMiddleware.js";
import { getDashboardStats,getRecentInvoices } from "../controllers/DashboardController.js";

const router = express.Router();


router.get("/",authMiddlware, getDashboardStats);
router.get("/recent", authMiddlware, getRecentInvoices);


export default router;
