import Expense from "../models/expense.js";
import Income from "../models/income.js";
import mongoose from "mongoose";

export const getMonthlySummary = async (req, res) => {
  const date = req.query.month ? new Date(req.query.month) : new Date();
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

  try {
    const expenses = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user._id), date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const incomes = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user._id), date: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      success: true,
      data: {
        totalExpenses: expenses[0]?.total || 0,
        totalIncomes: incomes[0]?.total || 0,
        balance: (incomes[0]?.total || 0) - (expenses[0]?.total || 0)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
