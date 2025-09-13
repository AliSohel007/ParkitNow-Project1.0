// backend/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ Register new user with default role
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login with role + email embedded in JWT
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // 🐛 DEBUG LOGS — to confirm role from DB
    console.log("👉 Logging in user:", user.email);
    console.log("👉 Full user object:", user);
    console.log("👉 Role from DB:", user.role);

    // ✅ Include role and email in JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role || 'user', // fallback in token
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      role: user.role || 'user',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
