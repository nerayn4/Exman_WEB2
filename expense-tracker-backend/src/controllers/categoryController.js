import Category from "../models/Category.js";
import Expense from "../models/expense.js";

export const getUserCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.user._id }).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching categories", error: err.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ 
      userId: req.user._id, 
      name: { $regex: new RegExp(`^${name}$`, "i") } 
    });
    if (existingCategory) return res.status(400).json({ success: false, message: "Category already exists" });

    const category = await Category.create({ name, userId: req.user._id });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating category", error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existingCategory = await Category.findOne({ 
      userId: req.user._id, 
      _id: { $ne: req.params.id },
      name: { $regex: new RegExp(`^${name}$`, "i") } 
    });
    if (existingCategory) return res.status(400).json({ success: false, message: "Category name already exists" });

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, data: category });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating category", error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const expenseCount = await Expense.countDocuments({ categoryId: req.params.id, userId: req.user._id });
    if (expenseCount > 0) return res.status(400).json({ success: false, message: "Cannot delete category with associated expenses" });

    const category = await Category.findOneAndDelete({ _id: req.params.id, userId: req.user._id, isDefault: false });
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting category", error: err.message });
  }
};

export const getDefaultCategories = async (req, res) => {
  try {
    const defaultCategories = [
      "Food & Dining", "Transportation", "Housing", "Utilities",
      "Healthcare", "Entertainment", "Shopping", "Education",
      "Travel", "Other"
    ];
    res.json({ success: true, data: defaultCategories });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching default categories", error: err.message });
  }
};
