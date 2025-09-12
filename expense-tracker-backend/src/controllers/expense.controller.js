const { Expense, Category } = require('../models');

// CREATE
exports.createExpense = async (req, res) => {
  try {
    const { amount, date, description, categoryId, type, startDate, endDate } = req.body;
    const receiptPath = req.file ? req.file.path : null;

    const expense = await Expense.create({
      amount,
      date,
      description,
      type,
      receiptPath,
      startDate,
      endDate,
      categoryId,
      userId: req.userId, 
    });

    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.userId },
      include: [Category],
    });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      where: { id: req.params.id, userId: req.userId },
      include: [Category],
    });
    if (!expense) return res.status(404).json({ message: 'Not found' });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!expense) return res.status(404).json({ message: 'Not found' });

    const { amount, date, description, categoryId, type, startDate, endDate } = req.body;
    const receiptPath = req.file ? req.file.path : expense.receiptPath;

    await expense.update({
      amount,
      date,
      description,
      categoryId,
      type,
      startDate,
      endDate,
      receiptPath,
    });

    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!expense) return res.status(404).json({ message: 'Not found' });

    await expense.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
