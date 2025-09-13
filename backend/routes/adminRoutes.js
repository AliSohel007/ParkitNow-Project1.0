const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const ParkingSlot = require('../models/ParkingSlot');

// 🔒 Import admin controller functions
const {
  changePassword,
  getProfile,
  updateProfile,   // ✅ NEW
  addSlot,
  updateSlot,
  deleteSlot
} = require('../controllers/adminController'); // ✅ All functions

// ==============================
// 👤 Admin Profile Routes
// ==============================
router.get('/me', authenticate, getProfile);          // ✅ Get admin profile
router.put('/me', authenticate, updateProfile);       // ✅ Update admin profile

// ==============================
// 🔐 Change Admin Password
// ==============================
router.put('/change-password', authenticate, changePassword); // ✅ Change password

// ==============================
// ➕ Add Parking Slot
// ==============================
router.post('/add', authenticate, async (req, res) => {
  const { slot, status, rate } = req.body;
  try {
    const existing = await ParkingSlot.findOne({ slot });
    if (existing) return res.status(400).json({ message: 'Slot already exists' });

    const newSlot = new ParkingSlot({ slot, status, rate });
    await newSlot.save();
    res.status(201).json({ message: 'Slot added', slot: newSlot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==============================
// ✏️ Edit Parking Slot
// ==============================
router.put('/edit/:id', authenticate, async (req, res) => {
  const { status, rate } = req.body;
  try {
    const slot = await ParkingSlot.findByIdAndUpdate(
      req.params.id,
      { status, rate },
      { new: true }
    );
    res.status(200).json({ message: 'Slot updated', slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==============================
// 🗑️ Delete Parking Slot
// ==============================
router.delete('/delete/:id', authenticate, async (req, res) => {
  try {
    await ParkingSlot.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Slot deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
