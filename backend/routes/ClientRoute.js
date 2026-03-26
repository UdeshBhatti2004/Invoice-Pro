import express from "express";
import { getClientsSummary } from "../controllers/ClientController.js";
import authMiddlware from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get("/", authMiddlware, getClientsSummary);

export default router;
