const express = require('express');
const router = express.Router();
const controller = require('../controllers/incomeController');

router.get('/', controller.getIncomes);
router.post('/', controller.createIncome);
router.get('/:id', controller.getIncome);
router.put('/:id', controller.updateIncome);
router.delete('/:id', controller.deleteIncome);

module.exports = router;

