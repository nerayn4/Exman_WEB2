// src/controllers/incomeController.js
import { Income } from '../models/index.js';
import { Op } from 'sequelize';

export const getIncomes = async (req, res) => {
  try {
    const { start, end } = req.query;
    const where = { userId: req.user.id };

    if (start || end) where.date = {};
    if (start) where.date[Op.gte] = new Date(start);
    if (end) where.date[Op.lte] = new Date(end);

    const incomes = await Income.findAll({
      where,
      order: [['date', 'DESC']],
    });

    res.json({ success: true, data: incomes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getIncome = async (req, res) => {
  try {
    const income = await Income.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });
    res.json({ success: true, data: income });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createIncome = async (req, res) => {
  try {
    const { amount, date, source, description } = req.body;
    const income = await Income.create({
      amount,
      date,
      source,
      description,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, data: income });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const [updatedCount, [updatedIncome]] = await Income.update(req.body, {
      where: { id: req.params.id, userId: req.user.id },
      returning: true,
    });

    if (updatedCount === 0) return res.status(404).json({ success: false, message: 'Income not found' });
    res.json({ success: true, data: updatedIncome });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!income) return res.status(404).json({ success: false, message: 'Income not found' });

    await income.destroy();
    res.json({ success: true, message: 'Income deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
