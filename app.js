require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
const MongoStore   = require('connect-mongo');
const passport     = require('./src/config/passport');
const connectDB    = require('./src/config/db');

// Rutas
const authRoutes      = require('./src/routes/auth.routes');
const oauthRoutes     = require('./src/routes/oauth.routes');
const protectedRoutes = require('./src/routes/protected.routes');

// ── Conectar a MongoDB ────────────────────────────────────────────
connectDB();

const app = express();

// ── Middlewares globales ──────────────────────────────────────────
app.use(cors({
  origin:      'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Sesiones (necesario para Passport OAuth) ──────────────────────
app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false,
  store: new MongoStore({
  mongoUrl:       process.env.MONGODB_URI,
  collectionName: 'sessions',
  ttl:            3600,
}),
  cookie: {
    httpOnly: true,
    sameSite: 'Lax',
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   3600000,
  },
}));

// ── Passport (después de session) ────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ── Rutas ─────────────────────────────────────────────────────────
app.use('/api/v1/auth',   authRoutes);
app.use('/api/v1/oauth',  oauthRoutes);
app.use('/api/v1',        protectedRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'API corriendo', version: '1.0.0' }));

// ── 404 ───────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ── Error handler global ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ── Iniciar servidor ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📌 Entorno: ${process.env.NODE_ENV}`);
});
