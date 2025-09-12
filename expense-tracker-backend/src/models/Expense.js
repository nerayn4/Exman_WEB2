// src/models/Expense.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './user.js';
import Category from './category.js';

const Expense = sequelize.define('Expense', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  date: { type: DataTypes.DATEONLY },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  type: { type: DataTypes.ENUM('one-time','recurring'), defaultValue: 'one-time' },
  startDate: { type: DataTypes.DATEONLY },
  endDate: { type: DataTypes.DATEONLY },
  receipt: { type: DataTypes.STRING },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'expenses',
  timestamps: true,
});

// Associations
Expense.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Expense.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

export default Expense;
