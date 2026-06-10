const User = require('../models/User');

// GET /api/v1/profile — protegida por JWT (cualquier usuario autenticado)
exports.getProfile = async (req, res) => {
  try {
    // req.user viene del JWT decodificado por verifyToken
    const user = await User.findById(req.user.userId).select('-password -__v');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({
      userId:    user._id,
      username:  user.username,
      email:     user.email,
      role:      user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
};

// GET /api/v1/admin — protegida por JWT + rol admin
exports.getAdmin = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.json({
      message: 'Panel de administración',
      totalUsers: users.length,
      users,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno' });
  }
};
