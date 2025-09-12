// src/controllers/categoryController.js
import Category from '../models/category.js';
import Expense from '../models/expense.js';
import { Op } from 'sequelize';

// Récupérer toutes les catégories de l'utilisateur
export const getUserCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [['name', 'ASC']]
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching categories', error: err.message });
  }
};

// Créer une catégorie
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({
      where: {
        userId: req.user.id,
        name: { [Op.iLike]: name } // iLike pour insensible à la casse (Postgres)
      }
    });
    if (existingCategory) return res.status(400).json({ success: false, message: 'Category already exists' });

    const category = await Category.create({ name, userId: req.user.id });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating category', error: err.message });
  }
};

// Mettre à jour une catégorie
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const existingCategory = await Category.findOne({
      where: {
        userId: req.user.id,
        id: { [Op.ne]: id },
        name: { [Op.iLike]: name }
      }
    });
    if (existingCategory) return res.status(400).json({ success: false, message: 'Category name already exists' });

    const [updatedCount, [updatedCategory]] = await Category.update(
      { name },
      { where: { id, userId: req.user.id, isDefault: false }, returning: true }
    );

    if (updatedCount === 0) return res.status(404).json({ success: false, message: 'Category not found' });

    res.json({ success: true, data: updatedCategory });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error updating category', error: err.message });
  }
};

// Supprimer une catégorie
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const expenseCount = await Expense.count({ where: { categoryId: id, userId: req.user.id } });
    if (expenseCount > 0)
      return res.status(400).json({ success: false, message: 'Cannot delete category with associated expenses' });

    const deletedCount = await Category.destroy({ where: { id, userId: req.user.id, isDefault: false } });
    if (deletedCount === 0) return res.status(404).json({ success: false, message: 'Category not found' });

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error deleting category', error: err.message });
  }
};

// Récupérer les catégories par défaut
export const getDefaultCategories = async (req, res) => {
  try {
    const defaultCategories = [
      'Food & Dining', 'Transportation', 'Housing', 'Utilities',
      'Healthcare', 'Entertainment', 'Shopping', 'Education',
      'Travel', 'Other'
    ];
    res.json({ success: true, data: defaultCategories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching default categories', error: err.message });
  }
};
