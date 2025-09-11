const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload');
const controller = require('../controllers/expenseController');

router.get('/', controller.getExpenses);
router.post('/', upload.single('receipt'), controller.createExpense);
router.get('/:id', controller.getExpense);
router.put('/:id', upload.single('receipt'), controller.updateExpense);
router.delete('/:id', controller.deleteExpense);

module.exports = router;
