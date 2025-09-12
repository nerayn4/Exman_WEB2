// models/dashboardCalculations.js
const Expense = require('../models/expense');
const Income = require('../models/income');

const dashboardCalculations = {

  async calculateSummary(userId, startDate, endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      // Totaux et moyennes pour dépenses et revenus
      const [expensesAgg, incomesAgg] = await Promise.all([
        Expense.aggregate([
          { $match: { userId, date: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 }, avg: { $avg: '$amount' } } }
        ]),
        Income.aggregate([
          { $match: { userId, date: { $gte: start, $lte: end } } },
          { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 }, avg: { $avg: '$amount' } } }
        ])
      ]);

      const totalExpenses = expensesAgg[0]?.total || 0;
      const totalIncomes = incomesAgg[0]?.total || 0;
      const balance = totalIncomes - totalExpenses;

      // Dépenses par catégorie
      const byCategory = await Expense.aggregate([
        { $match: { userId, date: { $gte: start, $lte: end } } },
        { $lookup: { from: 'categories', localField: 'categoryId', foreignField: '_id', as: 'category' } },
        { $unwind: '$category' },
        { $group: { _id: '$categoryId', categoryName: { $first: '$category.name' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } }
      ]);

      const alerts = await this.checkAlerts(userId, totalExpenses, totalIncomes, balance);

      return {
        period: {
          start,
          end,
          days: Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        },
        totals: { expenses: totalExpenses, incomes: totalIncomes, balance },
        counts: { expenses: expensesAgg[0]?.count || 0, incomes: incomesAgg[0]?.count || 0 },
        averages: { expense: expensesAgg[0]?.avg || 0, income: incomesAgg[0]?.avg || 0 },
        byCategory,
        alerts
      };

    } catch (error) {
      throw new Error(`Error calculating summary: ${error.message}`);
    }
  },

  async checkAlerts(userId, totalExpenses, totalIncomes, balance) {
    const alerts = [];

    if (balance < 0) {
      alerts.push({
        type: 'warning',
        code: 'BUDGET_EXCEEDED',
        message: `Budget dépassé de $${Math.abs(balance).toFixed(2)}`,
        amount: Math.abs(balance)
      });
    }

    if (totalIncomes > 0 && totalExpenses / totalIncomes > 0.8) {
      const percentage = Math.round((totalExpenses / totalIncomes) * 100);
      alerts.push({
        type: 'info',
        code: 'HIGH_SPENDING',
        message: `Vous avez dépensé ${percentage}% de vos revenus`,
        percentage
      });
    }

    const upcomingRecurring = await this.checkUpcomingRecurringExpenses(userId);
    if (upcomingRecurring.length > 0) {
      alerts.push({
        type: 'info',
        code: 'UPCOMING_RECURRING',
        message: `Vous avez ${upcomingRecurring.length} dépense(s) récurrentes à venir`,
        expenses: upcomingRecurring
      });
    }

    return alerts;
  },

  async checkUpcomingRecurringExpenses(userId) {
    try {
      const today = new Date();
      const upcoming = await Expense.find({
        userId,
        type: 'recurring',
        $or: [{ endDate: { $gte: today } }, { endDate: { $exists: false } }]
      }).populate('categoryId', 'name');

      return upcoming.slice(0, 5);
    } catch (error) {
      console.error('Error fetching recurring expenses:', error);
      return [];
    }
  },

  async calculateMonthlySummary(userId, year, month) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    return await this.calculateSummary(userId, startDate, endDate);
  }

};

module.exports = dashboardCalculations;
