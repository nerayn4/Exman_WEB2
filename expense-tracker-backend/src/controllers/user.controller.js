const { User } = require('../models');

exports.getProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user);

    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error("Erreur dans getProfile:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
