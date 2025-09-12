const { Income } = require('../models');

// CREATE
exports.createIncome = async (req, res) => {
  try {
    const { amount, source, date } = req.body;

    const income = await Income.create({
      amount,
      source,
      date,
      userId: req.userId,
    });

    res.json(income);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.findAll({ where: { userId: req.userId } });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ ONE
exports.getIncomeById = async (req, res) => {
  try {
    const income = await Income.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!income) return res.status(404).json({ message: 'Not found' });
    res.json(income);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!income) return res.status(404).json({ message: 'Not found' });

    const { amount, source, date } = req.body;
    await income.update({ amount, source, date });

    res.json(income);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!income) return res.status(404).json({ message: 'Not found' });

    await income.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
