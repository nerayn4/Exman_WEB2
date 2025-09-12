const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
router.use(auth);
router.get('/', dashboardController.getDashboardData);
router.get('/charts/:chartType', dashboardController.getChartData);
router.get('/charts/:chartType/:timeframe', dashboardController.getChartData);

module.exports = router;