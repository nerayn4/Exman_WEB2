import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);
router.get("/", dashboardController.getDashboardData);
router.get("/charts/:chartType", dashboardController.getChartData);
router.get("/charts/:chartType/:timeframe", dashboardController.getChartData);

export default router;
