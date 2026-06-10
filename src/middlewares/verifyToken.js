const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Acepta el token desde la cookie httpOnly O desde el header Authorization: Bearer ...
  const token =
    req.cookies?.authToken ||
    req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No autenticado: token ausente' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};
