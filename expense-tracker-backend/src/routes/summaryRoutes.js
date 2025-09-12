// routes/summaryRoutes.js
import express from "express";
import * as summaryController from "../controllers/summaryController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protection de toutes les routes
router.use(protect);

// Routes de résumé et statistiques
router.get("/monthly", summaryController.getMonthlySummary);
router.get("/", summaryController.getSummaryByDateRange);
router.get("/alerts", summaryController.getBudgetAlerts);
router.get("/overview", summaryController.getOverview);

export default router;
