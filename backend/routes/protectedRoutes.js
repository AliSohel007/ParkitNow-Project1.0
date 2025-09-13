const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({
    message: 'Welcome to your profile!',
    user: req.user,
  });
});

module.exports = router;
