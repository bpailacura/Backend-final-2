const express       = require('express');
const router        = express.Router();
const verifyToken   = require('../middlewares/verifyToken');
const checkRole     = require('../middlewares/checkRole');
const protectedCtrl = require('../controllers/protected.controller');

// GET /api/v1/profile  — requiere JWT válido de cualquier usuario
router.get('/profile', verifyToken, protectedCtrl.getProfile);

// GET /api/v1/admin    — requiere JWT válido + rol 'admin'
router.get('/admin', verifyToken, checkRole('admin'), protectedCtrl.getAdmin);

module.exports = router;
