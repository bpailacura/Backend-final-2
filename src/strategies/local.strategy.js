const { Strategy: LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const User   = require('../models/User');

module.exports = new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) return done(null, false, { message: 'Email no encontrado' });

      if (!user.password) return done(null, false, { message: 'Usuario registrado con OAuth, usá login social' });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return done(null, false, { message: 'Contraseña incorrecta' });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
