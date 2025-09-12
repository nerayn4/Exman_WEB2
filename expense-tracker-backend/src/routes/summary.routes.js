const express = require('express');
const router = express.Router();
const summaryController = require('../controllers/summary.controller');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/monthly', authMiddleware, summaryController.getMonthlySummary);

module.exports = router;
