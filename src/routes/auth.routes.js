const express    = require('express');
const passport   = require('passport');
const router     = express.Router();
const authCtrl   = require('../controllers/auth.controller');

// POST /api/v1/auth/register
router.post('/register', authCtrl.register);

// POST /api/v1/auth/login  — Passport valida, luego el controller genera el JWT
router.post(
  '/login',
  passport.authenticate('local', { session: true, failWithError: true }),
  authCtrl.login,
  // Manejo de error de Passport (credenciales incorrectas)
  (err, req, res, next) => {
    res.status(401).json({ error: err.message || 'Credenciales inválidas' });
  }
);

// GET  /api/v1/auth/session
router.get('/session', authCtrl.getSession);

// POST /api/v1/auth/logout
router.post('/logout', authCtrl.logout);

module.exports = router;
