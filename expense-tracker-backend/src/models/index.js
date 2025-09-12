const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./user');
const Expense = require('./Expense');
const Income = require('./Income');
const Category = require('./category');

// Définir associations si nécessaire
User.hasMany(Expense, { foreignKey: 'userId' });
Expense.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Income, { foreignKey: 'userId' });
Income.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Category, { foreignKey: 'userId' });
Category.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,  
  User,
  Expense,
  Income,
  Category,
};
