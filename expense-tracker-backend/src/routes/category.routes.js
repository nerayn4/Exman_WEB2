const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', authMiddleware, categoryController.createCategory);
router.get('/', authMiddleware, categoryController.getCategories);
router.put('/:id', authMiddleware, categoryController.updateCategory);
router.delete('/:id', authMiddleware, categoryController.deleteCategory);

module.exports = router;
