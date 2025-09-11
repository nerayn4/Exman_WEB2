const Income = require('../models/Income');

exports.getIncomes = async (req, res) => {
  const incomes = await Income.find();
  res.json(incomes);
};

exports.createIncome = async (req, res) => {
  const { amount, date, source, description } = req.body;
  const income = new Income({ amount, date, source, description });
  await income.save();
  res.status(201).json(income);
};

exports.getIncome = async (req, res) => {
  const income = await Income.findById(req.params.id);
  if (!income) return res.status(404).json({ message: 'Non trouvé' });
  res.json(income);
};

exports.updateIncome = async (req, res) => {
  const income = await Income.findById(req.params.id);
  if (!income) return res.status(404).json({ message: 'Non trouvé' });

  const { amount, date, source, description } = req.body;
  income.amount = amount ?? income.amount;
  income.date = date ?? income.date;
  income.source = source ?? income.source;
  income.description = description ?? income.description;

  await income.save();
  res.json(income);
};

exports.deleteIncome = async (req, res) => {
  const income = await Income.findById(req.params.id);
  if (!income) return res.status(404).json({ message: 'Non trouvé' });
  await income.remove();
  res.status(204).send();
};
