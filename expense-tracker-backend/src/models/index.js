import mongoose from "mongoose";
import Expense from "./expense.js";
import Income from "./income.js";

const dashboardCalculations = {
  calculateMonthlySummary: async (userId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const expenses = await Expense.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    const incomes = await Income.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    return {
      totalExpenses: expenses[0]?.total || 0,
      totalIncomes: incomes[0]?.total || 0,
      expenseCount: expenses[0]?.count || 0,
      incomeCount: incomes[0]?.count || 0,
      balance: (incomes[0]?.total || 0) - (expenses[0]?.total || 0)
    };
  },

  calculateExpensesByCategory: async (userId, year, month) => {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return Expense.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
      { $lookup: { from: "categories", localField: "categoryId", foreignField: "_id", as: "category" } },
      { $unwind: "$category" },
      { $group: { _id: "$categoryId", categoryName: { $first: "$category.name" }, total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
  },

  calculateMonthlyTrends: async (userId, months = 6) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const aggregateTrends = async (Model) => {
      return Model.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId), date: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: { year: { $year: "$date" }, month: { $month: "$date" } }, total: { $sum: "$amount" }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);
    };

    const expenseTrends = await aggregateTrends(Expense);
    const incomeTrends = await aggregateTrends(Income);

    return { expenseTrends, incomeTrends };
  }
};

export default dashboardCalculations;
