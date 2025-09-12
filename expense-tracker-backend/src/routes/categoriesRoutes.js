// src/controllers/categoryController.js
import { Sequelize } from "sequelize";
import sequelize from "../config/database.js"; // ton instance Sequelize
import CategoryModel from "../models/category.js";

const Category = CategoryModel(sequelize);

// GET: toutes les catégories de l'utilisateur
export const getUserCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [["name", "ASC"]],
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET: catégories par défaut
export const getDefaultCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: null },
      order: [["name", "ASC"]],
    });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST: créer une catégorie
export const createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Nom requis" });

    const category = await Category.create({
      name,
      color,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT: mettre à jour une catégorie
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const [updatedRows] = await Category.update(
      { name, color },
      { where: { id, userId: req.user.id } }
    );

    if (updatedRows === 0)
      return res.status(404).json({ success: false, message: "Catégorie non trouvée" });

    const updatedCategory = await Category.findByPk(id);
    res.json({ success: true, data: updatedCategory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE: supprimer une catégorie
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await Category.destroy({ where: { id, userId: req.user.id } });
    if (deletedRows === 0)
      return res.status(404).json({ success: false, message: "Catégorie non trouvée" });

    res.json({ success: true, message: "Catégorie supprimée" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
