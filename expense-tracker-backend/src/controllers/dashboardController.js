// src/controllers/dashboardController.js
import { Expense, Income, Category } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

// Fonctions utilitaires pour les calculs du dashboard
const dashboardCalculations = {

  // Sommaire pour un mois donné
  async calculateMonthlySummary(userId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    return this.calculateSummary(userId, startDate, endDate);
  },

  async calculateSummary(userId, start, end) {
    // Totaux et moyennes des dépenses
    const expensesAgg = await Expense.findAll({
      where: { userId, date: { [Op.between]: [start, end] } },
      attributes: [
        [fn('SUM', col('amount')), 'total'],
        [fn('AVG', col('amount')), 'avg'],
        [fn('COUNT', col('id')), 'count']
      ]
    });

    const incomesAgg = await Income.findAll({
      where: { userId, date: { [Op.between]: [start, end] } },
      attributes: [
        [fn('SUM', col('amount')), 'total'],
        [fn('AVG', col('amount')), 'avg'],
        [fn('COUNT', col('id')), 'count']
      ]
    });

    const totalExpenses = parseFloat(expensesAgg[0]?.dataValues.total || 0);
    const totalIncomes = parseFloat(incomesAgg[0]?.dataValues.total || 0);
    const balance = totalIncomes - totalExpenses;

    return {
      totalExpenses,
      totalIncomes,
      balance,
      avgExpense: parseFloat(expensesAgg[0]?.dataValues.avg || 0),
      avgIncome: parseFloat(incomesAgg[0]?.dataValues.avg || 0),
      expenseCount: parseInt(expensesAgg[0]?.dataValues.count || 0),
      incomeCount: parseInt(incomesAgg[0]?.dataValues.count || 0),
      period: { start, end }
    };
  },

  // Dépenses par catégorie pour un mois donné
  async calculateExpensesByCategory(userId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const expenses = await Expense.findAll({
      where: { userId, date: { [Op.between]: [startDate, endDate] } },
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
    });

    // Grouper par catégorie
    const byCategory = {};
    expenses.forEach(e => {
      const catName = e.category?.name || 'Uncategorized';
      if (!byCategory[catName]) byCategory[catName] = 0;
      byCategory[catName] += parseFloat(e.amount);
    });

    return Object.entries(byCategory)
      .map(([categoryName, total]) => ({ categoryName, total }))
      .sort((a, b) => b.total - a.total);
  },

  // Tendances mensuelles pour n derniers mois
  async calculateMonthlyTrends(userId, months = 6) {
    const trends = [];
    const today = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const end = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59, 999);
      const summary = await this.calculateSummary(userId, start, end);
      trends.push({
        month: start.getMonth() + 1,
        year: start.getFullYear(),
        totalExpenses: summary.totalExpenses,
        totalIncomes: summary.totalIncomes,
        balance: summary.balance
      });
    }
    return trends;
  }

};

// Controller
export const getDashboardData = async (req, res) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const currentMonth = month || now.getMonth() + 1;
    const currentYear = year || now.getFullYear();

    const summary = await dashboardCalculations.calculateMonthlySummary(req.user.id, currentYear, currentMonth);
    const expensesByCategory = await dashboardCalculations.calculateExpensesByCategory(req.user.id, currentYear, currentMonth);
    const trends = await dashboardCalculations.calculateMonthlyTrends(req.user.id, 6);

    const alerts = [];
    if (summary.balance < 0) {
      alerts.push({
        type: 'warning',
        message: `Budget dépassé de $${Math.abs(summary.balance).toFixed(2)} ce mois-ci`
      });
    }
    if (summary.totalExpenses > summary.totalIncomes * 0.8) {
      alerts.push({
        type: 'info',
        message: 'Vous avez dépensé plus de 80% de vos revenus ce mois-ci'
      });
    }

    res.json({
      success: true,
      data: {
        summary,
        expensesByCategory,
        trends,
        alerts,
        period: {
          month: currentMonth,
          year: currentYear,
          monthName: new Date(currentYear, currentMonth - 1).toLocaleString('default', { month: 'long' })
        }
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getChartData = async (req, res) => {
  try {
    const { chartType, timeframe } = req.params;
    let data;

    const now = new Date();
    switch (chartType) {
      case 'expenses-by-category':
        data = await dashboardCalculations.calculateExpensesByCategory(req.user.id, now.getFullYear(), now.getMonth() + 1);
        break;
      case 'monthly-trends':
        data = await dashboardCalculations.calculateMonthlyTrends(req.user.id, 12);
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid chart type' });
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('Chart data error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
