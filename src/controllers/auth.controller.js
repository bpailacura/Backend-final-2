const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── REGISTER ──────────────────────────────────────────────────────
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'username, email y password son obligatorios' });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'El email ya está registrado' });

    const user = await User.create({ username, email, password });
    res.status(201).json({ message: 'Usuario creado correctamente', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ── LOGIN (Passport ya autenticó, req.user disponible) ────────────
exports.login = (req, res) => {
  const token = jwt.sign(
    { userId: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // Cookie httpOnly — el browser la envía automáticamente
  res.cookie('authToken', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   3600000, // 1 hora en ms
  });

  // También se devuelve en el body para clientes móviles o SPAs
  res.json({
    message: 'Login exitoso',
    token,
    role: req.user.role,
  });
};

// ── OAUTH CALLBACK ────────────────────────────────────────────────
exports.oauthCallback = (req, res) => {
  const token = jwt.sign(
    { userId: req.user._id, role: req.user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.cookie('authToken', token, {
    httpOnly: true,
    sameSite: 'Lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   3600000,
  });

  // En OAuth redirigimos al frontend (o devolvemos JSON si es API pura)
  res.json({ message: 'Login con GitHub exitoso', token, role: req.user.role });
};

// ── SESSION INFO ──────────────────────────────────────────────────
exports.getSession = (req, res) => {
  if (!req.session?.passport?.user) {
    return res.status(401).json({ active: false, message: 'Sin sesión activa' });
  }
  res.json({ active: true, userId: req.session.passport.user });
};

// ── LOGOUT ───────────────────────────────────────────────────────
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Error al cerrar la sesión' });

    res.clearCookie('authToken', {
      httpOnly: true,
      sameSite: 'Lax',
      secure:   process.env.NODE_ENV === 'production',
    });

    res.json({ message: 'Sesión cerrada correctamente' });
  });
};
