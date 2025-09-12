const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });


router.post('/', authMiddleware, upload.single('receipt'), expenseController.createExpense);
router.get('/', authMiddleware, expenseController.getExpenses);
router.get('/:id', authMiddleware, expenseController.getExpenseById);
router.put('/:id', authMiddleware, upload.single('receipt'), expenseController.updateExpense);
router.delete('/:id', authMiddleware, expenseController.deleteExpense);

module.exports = router;
