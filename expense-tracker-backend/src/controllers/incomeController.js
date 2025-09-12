import Income from "../models/income.js";

export const getIncomes = async (req, res) => {
  const { start, end } = req.query;
  const filter = { userId: req.user._id };
  if (start || end) filter.date = {};
  if (start) filter.date.$gte = new Date(start);
  if (end) filter.date.$lte = new Date(end);

  try {
    const incomes = await Income.find(filter).sort({ date: -1 });
    res.json({ success: true, data: incomes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, userId: req.user._id });
    if (!income) return res.status(404).json({ success: false, message: "Income not found" });
    res.json({ success: true, data: income });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createIncome = async (req, res) => {
  try {
    const { amount, date, source, description } = req.body;
    const income = await Income.create({ amount, date, source, description, userId: req.user._id });
    res.status(201).json({ success: true, data: income });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!income) return res.status(404).json({ success: false, message: "Income not found" });
    res.json({ success: true, data: income });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, userId: req.user._id });
    if (!income) return res.status(404).json({ success: false, message: "Income not found" });
    await income.deleteOne();
    res.json({ success: true, message: "Income deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
