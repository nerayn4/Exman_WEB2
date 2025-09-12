// src/controllers/expenseController.js
import { Expense } from '../models/index.js';
import { Op } from 'sequelize';
import fs from 'fs';

export const getExpenses = async (req, res) => {
  try {
    const { start, end, category, type } = req.query;
    const where = { userId: req.user.id };

    if (category) where.categoryId = category;
    if (type) where.type = type;
    if (start || end) where.date = {};
    if (start) where.date[Op.gte] = new Date(start);
    if (end) where.date[Op.lte] = new Date(end);

    const expenses = await Expense.findAll({
      where,
      order: [['date', 'DESC']],
    });

    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.user.id }
    });

    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { amount, date, categoryId, description, type, startDate, endDate } = req.body;
    const expense = await Expense.create({
      amount,
      date,
      categoryId,
      description,
      type,
      startDate,
      endDate,
      receipt: req.file?.path || null,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.file?.path) updates.receipt = req.file.path;

    const [updatedCount, [updatedExpense]] = await Expense.update(updates, {
      where: { id: req.params.id, userId: req.user.id },
      returning: true,
    });

    if (updatedCount === 0) return res.status(404).json({ success: false, message: 'Expense not found' });
    res.json({ success: true, data: updatedExpense });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!expense) return res.status(404).json({ success: false, message: 'Expense not found' });

    if (expense.receipt && fs.existsSync(expense.receipt)) fs.unlinkSync(expense.receipt);
    await expense.destroy();

    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
