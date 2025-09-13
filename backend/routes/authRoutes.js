// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');

router.get('/test', (req, res) => {
  res.send('✅ Auth route working!');
});

router.get('/protected-test', verifyToken, (req, res) => {
  res.json({ message: '🔒 Protected route working!' });
});

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
