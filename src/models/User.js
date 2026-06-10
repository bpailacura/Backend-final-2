const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type:     String,
    required: true,
    trim:     true,
  },
  email: {
    type:     String,
    required: true,
    unique:   true,
    lowercase: true,
    trim:     true,
  },
  password: {
    type: String,
    // No required: los usuarios OAuth no tienen password
  },
  role: {
    type:    String,
    enum:    ['user', 'admin'],
    default: 'user',
  },
  githubId: {
    type: String,
  },
}, { timestamps: true });

// Hook pre-save: hashea la contraseña solo si fue modificada
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
