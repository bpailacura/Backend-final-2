const { Strategy: GitHubStrategy } = require('passport-github2');
const User = require('../models/User');

module.exports = new GitHubStrategy(
  {
    clientID:     process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:  process.env.GITHUB_CALLBACK_URL,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Buscar si ya existe el usuario con ese githubId
      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        // Crear usuario nuevo si es la primera vez
        user = await User.create({
          username: profile.username,
          email:    profile.emails?.[0]?.value || `${profile.id}@github.local`,
          githubId: profile.id,
          role:     'user',
        });
        console.log('✅ Usuario OAuth creado:', user.email);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
);
