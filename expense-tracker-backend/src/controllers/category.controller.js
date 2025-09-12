const { Category } = require('../models');

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name, userId: req.userId });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { userId: req.userId } });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!category) return res.status(404).json({ message: 'Not found' });

    await category.update({ name: req.body.name });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ where: { id: req.params.id, userId: req.userId } });
    if (!category) return res.status(404).json({ message: 'Not found' });

    await category.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
