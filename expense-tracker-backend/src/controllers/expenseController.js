const Expense = require('../models/Expense');
const fs = require('fs');
const path = require('path');

// Liste des dépenses
exports.getExpenses = async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
};

// Créer une dépense
exports.createExpense = async (req, res) => {
  try {
    const { amount, date, categoryId, description, type, startDate, endDate } = req.body;
    const expense = new Expense({
      amount, date, categoryId, description, type, startDate, endDate,
      receipt: req.file ? req.file.path : undefined
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Récupérer une dépense
exports.getExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Non trouvé' });
  res.json(expense);
};

// Mettre à jour une dépense
exports.updateExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Non trouvé' });

  const { amount, date, categoryId, description, type, startDate, endDate } = req.body;
  expense.amount = amount ?? expense.amount;
  expense.date = date ?? expense.date;
  expense.categoryId = categoryId ?? expense.categoryId;
  expense.description = description ?? expense.description;
  expense.type = type ?? expense.type;
  expense.startDate = startDate ?? expense.startDate;
  expense.endDate = endDate ?? expense.endDate;

  if (req.file) {
    if (expense.receipt && fs.existsSync(expense.receipt)) fs.unlinkSync(expense.receipt);
    expense.receipt = req.file.path;
  }

  await expense.save();
  res.json(expense);
};

// Supprimer une dépense
exports.deleteExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Non trouvé' });

  if (expense.receipt && fs.existsSync(expense.receipt)) fs.unlinkSync(expense.receipt);
  await expense.remove();
  res.status(204).send();
};