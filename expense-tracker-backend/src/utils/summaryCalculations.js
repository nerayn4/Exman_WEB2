const Expense = require('../models/Expense');
const Income = require('../models/Income');
exports.calculateSummary = async (userId, startDate, endDate) => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const expensesAggregate = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' }
        }
      }
    ]);
    const incomesAggregate = await Income.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' }
        }
      }
    ]);
    const expensesByCategory = await Expense.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: start, $lte: end }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $group: {
          _id: '$categoryId',
          categoryName: { $first: '$category.name' },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { totalAmount: -1 }
      }
    ]);

    const totalExpenses = expensesAggregate[0]?.totalAmount || 0;
    const totalIncomes = incomesAggregate[0]?.totalAmount || 0;
    const balance = totalIncomes - totalExpenses;

    return {
      period: {
        start: start,
        end: end,
        days: Math.ceil((end - start) / (1000 * 60 * 60 * 24))
      },
      totals: {
        expenses: totalExpenses,
        incomes: totalIncomes,
        balance: balance
      },
      counts: {
        expenses: expensesAggregate[0]?.count || 0,
        incomes: incomesAggregate[0]?.count || 0
      },
      averages: {
        expense: expensesAggregate[0]?.average || 0,
        income: incomesAggregate[0]?.average || 0
      },
      byCategory: expensesByCategory,
      alerts: await this.checkAlerts(userId, totalExpenses, totalIncomes, balance)
    };
  } catch (error) {
    throw new Error(`Error calculating summary: ${error.message}`);
  }
};
exports.checkAlerts = async (userId, totalExpenses, totalIncomes, balance) => {
  const alerts = [];
  if (balance < 0) {
    alerts.push({
      type: 'warning',
      code: 'BUDGET_EXCEEDED',
      message: `You've exceeded your budget by $${Math.abs(balance).toFixed(2)}`,
      amount: Math.abs(balance)
    });
  }
  if (totalIncomes > 0 && (totalExpenses / totalIncomes) > 0.8) {
    const percentage = Math.round((totalExpenses / totalIncomes) * 100);
    alerts.push({
      type: 'info',
      code: 'HIGH_SPENDING',
      message: `You've spent ${percentage}% of your income this period`,
      percentage: percentage
    });
  }

  const upcomingRecurring = await this.checkUpcomingRecurringExpenses(userId);
  if (upcomingRecurring.length > 0) {
    alerts.push({
      type: 'info',
      code: 'UPCOMING_RECURRING',
      message: `You have ${upcomingRecurring.length} recurring expense(s) due soon`,
      expenses: upcomingRecurring
    });
  }

  return alerts;
};
exports.checkUpcomingRecurringExpenses = async (userId) => {
  try {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingExpenses = await Expense.find({
      userId: userId,
      type: 'recurring',
      $or: [
        { endDate: { $gte: today } },
        { endDate: { $exists: false } }
      ]
    }).populate('categoryId', 'name');

    return upcomingExpenses.filter(expense => {
      return true; 
    }).slice(0, 5);

  } catch (error) {
    console.error('Error checking recurring expenses:', error);
    return [];
  }
};
exports.calculateMonthlySummary = async (userId, year, month) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  
  return await this.calculateSummary(userId, startDate, endDate);
};