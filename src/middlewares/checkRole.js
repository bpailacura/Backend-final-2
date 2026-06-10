// Uso: checkRole('admin')  o  checkRole('admin', 'moderator')
module.exports = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Acceso denegado: no tenés el rol requerido' });
  }
  next();
};
