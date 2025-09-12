import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Protection de toutes les routes
router.use(protect);

// Routes du dashboard
router.get("/", dashboardController.getDashboardData);
router.get("/charts/:chartType", dashboardController.getChartData);
router.get("/charts/:chartType/:timeframe", dashboardController.getChartData);

export default router;
