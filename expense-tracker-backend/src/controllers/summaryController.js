// src/controllers/summaryController.js
import { Expense, Income } from "../models/index.js";
import { Op } from "sequelize";

export const getMonthlySummary = async (req, res) => {
  try {
    const date = req.query.month ? new Date(req.query.month) : new Date();
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    // Total dépenses
    const totalExpensesResult = await Expense.findAll({
      attributes: [[Expense.sequelize.fn("SUM", Expense.sequelize.col("amount")), "total"]],
      where: {
        userId: req.user.id,
        date: { [Op.between]: [start, end] },
      },
    });
    const totalExpenses = parseFloat(totalExpensesResult[0].get("total")) || 0;

    // Total revenus
    const totalIncomesResult = await Income.findAll({
      attributes: [[Income.sequelize.fn("SUM", Income.sequelize.col("amount")), "total"]],
      where: {
        userId: req.user.id,
        date: { [Op.between]: [start, end] },
      },
    });
    const totalIncomes = parseFloat(totalIncomesResult[0].get("total")) || 0;

    res.json({
      success: true,
      data: {
        totalExpenses,
        totalIncomes,
        balance: totalIncomes - totalExpenses,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
