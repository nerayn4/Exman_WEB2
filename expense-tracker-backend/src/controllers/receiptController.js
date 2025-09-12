// src/controllers/receiptController.js
import { Expense } from '../models/index.js';
import fs from 'fs';
import path from 'path';

export const uploadReceipt = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });

    if (req.file?.path) {
      expense.receipt = req.file.path;
      await expense.save();
    }

    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getReceipt = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!expense || !expense.receipt)
      return res.status(404).json({ success: false, message: 'Receipt not found' });

    res.sendFile(path.resolve(expense.receipt));
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteReceipt = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!expense || !expense.receipt)
      return res.status(404).json({ success: false, message: 'Receipt not found' });

    if (fs.existsSync(expense.receipt)) fs.unlinkSync(expense.receipt);

    expense.receipt = null;
    await expense.save();

    res.json({ success: true, message: 'Receipt deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
