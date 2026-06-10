const passport    = require('passport');
const User        = require('../models/User');
const localStrategy  = require('../strategies/local.strategy');
const githubStrategy = require('../strategies/github.strategy');

passport.use('local', localStrategy);
passport.use('github', githubStrategy);

// Serialize: guarda el userId en la sesión
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize: recupera el usuario completo desde la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
