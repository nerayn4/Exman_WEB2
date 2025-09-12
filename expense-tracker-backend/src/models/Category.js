// src/models/Category.js
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './user.js';

const Category = sequelize.define('Category', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  isDefault: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'categories'
});

// association defined after all models imported in index or main setup
export default Category;
