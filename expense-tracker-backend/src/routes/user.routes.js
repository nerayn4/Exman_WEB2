const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/profile', authMiddleware, userController.getProfile);
router.get('/me', authMiddleware, (req, res) => {
  res.json({ userId: req.userId });
});

module.exports = router;

