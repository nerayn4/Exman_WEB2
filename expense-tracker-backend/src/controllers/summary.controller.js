const { Expense, Income, Category } = require('../models');
const { Op } = require('sequelize');

exports.getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    const start = new Date(year, month - 1, 1);   
    const end = new Date(year, month, 1);         

    const incomes = await Income.sum('amount', {
      where: {
        userId: req.userId,
        date: { [Op.gte]: start, [Op.lt]: end }
      }
    });

    const expenses = await Expense.sum('amount', {
      where: {
        userId: req.userId,
        date: { [Op.gte]: start, [Op.lt]: end }
      }
    });

    const expensesByCategoryRaw = await Expense.findAll({
      attributes: [
        'categoryId',
        [Expense.sequelize.fn('sum', Expense.sequelize.col('amount')), 'total']
      ],
      where: {
        userId: req.userId,
        date: { [Op.gte]: start, [Op.lt]: end }
      },
      include: [{ model: Category, attributes: ['name'] }],
      group: ['categoryId']
    });

    const expensesByCategory = expensesByCategoryRaw.map(e => ({
      name: e.Category?.name || "Uncategorized",
      value: parseFloat(e.get('total'))
    }));

    res.json({
      incomes: incomes || 0,
      expenses: expenses || 0,
      balance: (incomes || 0) - (expenses || 0),
      expensesByCategory,
    });
  } catch (err) {
    console.error("Erreur getMonthlySummary:", err);
    res.status(500).json({ error: err.message });
  }
};
