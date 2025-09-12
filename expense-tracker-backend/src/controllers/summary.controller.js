const { Expense, Income, Category } = require('../models');
const { Op } = require('sequelize');

exports.getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);

   
    const incomes = await Income.sum('amount', {
      where: { userId: req.userId, date: { [Op.between]: [start, end] } }
    });

    
    const expenses = await Expense.sum('amount', {
      where: { userId: req.userId, date: { [Op.between]: [start, end] } }
    });

    
    const expensesByCategory = await Expense.findAll({
      attributes: ['categoryId', [Expense.sequelize.fn('sum', Expense.sequelize.col('amount')), 'total']],
      where: { userId: req.userId, date: { [Op.between]: [start, end] } },
      include: [Category],
      group: ['categoryId']
    });

    res.json({
      incomes: incomes || 0,
      expenses: expenses || 0,
      balance: (incomes || 0) - (expenses || 0),
      expensesByCategory,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
