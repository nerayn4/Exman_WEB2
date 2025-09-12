const Category = require('../models/Category');
const Expense = require('../models/Expense');

exports.getUserCategories = async (req, res) => {
  try {
    const categories = await Category.find({ userId: req.userId }).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching categories', 
      error: error.message 
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    const existingCategory = await Category.findOne({ 
      userId: req.userId, 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const category = new Category({
      name,
      userId: req.userId
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating category', 
      error: error.message 
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    
    const existingCategory = await Category.findOne({ 
      userId: req.userId, 
      _id: { $ne: req.params.id },
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { name },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating category', 
      error: error.message 
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {

    const expenseCount = await Expense.countDocuments({ 
      categoryId: req.params.id, 
      userId: req.userId 
    });
    
    if (expenseCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with associated expenses' 
      });
    }
    
    const category = await Category.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId,
      isDefault: false 
    });
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error deleting category', 
      error: error.message 
    });
  }
};

exports.getDefaultCategories = async (req, res) => {
  try {
    const defaultCategories = [
      'Food & Dining',
      'Transportation',
      'Housing',
      'Utilities',
      'Healthcare',
      'Entertainment',
      'Shopping',
      'Education',
      'Travel',
      'Other'
    ];
    
    res.json(defaultCategories);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching default categories', 
      error: error.message 
    });
  }
};