const express  = require('express');
const passport = require('passport');
const router   = express.Router();
const authCtrl = require('../controllers/auth.controller');

// Redirige a GitHub para autenticación
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub redirige acá después del login
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login-failed' }),
  authCtrl.oauthCallback
);

router.get('/login-failed', (req, res) => {
  res.status(401).json({ error: 'Login con GitHub fallido' });
});

module.exports = router;
