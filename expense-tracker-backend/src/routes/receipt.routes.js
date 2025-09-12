const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');


router.get('/:idExpense', authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.idExpense);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    
    if (expense.UserId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!expense.receipt) {
      return res.status(404).json({ message: 'No receipt uploaded' });
    }

    const filePath = path.join(__dirname, '..', '..', 'uploads', expense.receipt);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error('❌ Error fetching receipt:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
