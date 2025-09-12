const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/income.controller');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware, incomeController.createIncome);
router.get('/', authMiddleware, incomeController.getIncomes);
router.get('/:id', authMiddleware, incomeController.getIncomeById);
router.put('/:id', authMiddleware, incomeController.updateIncome);
router.delete('/:id', authMiddleware, incomeController.deleteIncome);

module.exports = router;
