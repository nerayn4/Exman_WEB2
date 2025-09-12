// src/models/Income.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './user.js';

const Income = sequelize.define('Income', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  source: { type: DataTypes.STRING, defaultValue: '' },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  userId: { type: DataTypes.INTEGER, allowNull: false }, // référence à l'utilisateur
}, {
  tableName: 'incomes',
  timestamps: true, // createdAt / updatedAt
});

// Associations
Income.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Income;
