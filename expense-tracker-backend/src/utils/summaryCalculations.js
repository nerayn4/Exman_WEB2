// models/dashboardCalculations.js
import { Op, fn, col, literal } from 'sequelize';
import Expense from './Expense.js';
import Income from './Income.js';
import Category from './Category.js';

const dashboardCalculations = {

  async calculateSummary(userId, startDate, endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      // Totaux et moyennes pour dépenses
      const expensesAgg = await Expense.findAll({
        attributes: [
          [fn('SUM', col('amount')), 'total'],
          [fn('COUNT', col('id')), 'count'],
          [fn('AVG', col('amount')), 'avg']
        ],
        where: {
          userId,
          date: { [Op.between]: [start, end] }
        },
        raw: true
      });

      const incomesAgg = await Income.findAll({
        attributes: [
          [fn('SUM', col('amount')), 'total'],
          [fn('COUNT', col('id')), 'count'],
          [fn('AVG', col('amount')), 'avg']
        ],
        where: {
          userId,
          date: { [Op.between]: [start, end] }
        },
        raw: true
      });

      const totalExpenses = parseFloat(expensesAgg[0]?.total || 0);
      const totalIncomes = parseFloat(incomesAgg[0]?.total || 0);
      const balance = totalIncomes - totalExpenses;

      // Dépenses par catégorie
      const byCategory = await Expense.findAll({
        attributes: [
          'categoryId',
          [fn('SUM', col('amount')), 'total'],
          [fn('COUNT', col('id')), 'count']
        ],
        where: {
          userId,
          date: { [Op.between]: [start, end] }
        },
        include: [{
          model: Category,
          as: 'category',
          attributes: ['name']
        }],
        group: ['categoryId', 'category.id'],
        order: [[literal('total'), 'DESC']],
        raw: true,
        nest: true
      });

      const alerts = await this.checkAlerts(userId, totalExpenses, totalIncomes, balance);

      return {
        period: {
          start,
          end,
          days: Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        },
        totals: { expenses: totalExpenses, incomes: totalIncomes, balance },
        counts: {
          expenses: parseInt(expensesAgg[0]?.count || 0),
          incomes: parseInt(incomesAgg[0]?.count || 0)
        },
        averages: {
          expense: parseFloat(expensesAgg[0]?.avg || 0),
          income: parseFloat(incomesAgg[0]?.avg || 0)
        },
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
      const upcoming = await Expense.findAll({
        where: {
          userId,
          type: 'recurring',
          [Op.or]: [
            { endDate: { [Op.gte]: today } },
            { endDate: null }
          ]
        },
        include: [{ model: Category, as: 'category', attributes: ['name'] }],
        order: [['date', 'ASC']],
        limit: 5
      });

      return upcoming;
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

export default dashboardCalculations;
