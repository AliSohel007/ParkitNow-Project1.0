// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

// ==============================
// ✅ Public Test Route
// ==============================
router.get('/test', (req, res) => {
  res.json({ message: '✅ Auth route is working!' });
});

// ==============================
// 🔒 Protected Test Route
// ==============================
router.get('/protected-test', verifyToken, (req, res) => {
  res.json({ message: '🔒 Protected route is working!' });
});

// ==============================
// 🔐 Auth Routes
// ==============================
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
