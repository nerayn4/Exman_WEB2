const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const Expense = require('./Expense');
const Income = require('./Income');
const Category = require('./category');


User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Income, { foreignKey: 'userId' });
Income.belongsTo(User, { foreignKey: 'userId' });


User.hasMany(Category, { foreignKey: 'userId' });
Category.belongsTo(User, { foreignKey: 'userId' });


Category.hasMany(Expense, { foreignKey: 'categoryId' });
Expense.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'SET NULL' });

module.exports = {
  sequelize,  
  User,
  Expense,
  Income,
  Category,
};
