let slots = [
  { id: 1, slot: 'A1', status: 'vacant' },
  { id: 2, slot: 'A2', status: 'occupied' },
];

const bcrypt = require('bcryptjs');
const User = require('../models/User'); // ✅ Admin/User model

// =============================
// ➕ Add Slot (In-Memory Example)
// =============================
exports.addSlot = (req, res) => {
  const { slot, status } = req.body;
  const newSlot = { id: Date.now(), slot, status };
  slots.push(newSlot);
  res.status(201).json({ message: 'Slot added', slot: newSlot });
};

// =============================
// ✏️ Update Slot
// =============================
exports.updateSlot = (req, res) => {
  const slotId = parseInt(req.params.id);
  const { slot, status } = req.body;
  const index = slots.findIndex((s) => s.id === slotId);
  if (index === -1) return res.status(404).json({ message: 'Slot not found' });

  slots[index] = { ...slots[index], slot, status };
  res.status(200).json({ message: 'Slot updated', slot: slots[index] });
};

// =============================
// 🗑️ Delete Slot
// =============================
exports.deleteSlot = (req, res) => {
  const slotId = parseInt(req.params.id);
  slots = slots.filter((s) => s.id !== slotId);
  res.status(200).json({ message: 'Slot deleted' });
};

// =============================
// 🔐 Change Admin Password
// =============================
exports.changePassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// 👤 Get Admin Profile
// =============================
exports.getProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await User.findById(adminId).select('-password');
    if (!admin) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(admin);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// =============================
// 📝 Update Admin Profile
// =============================
exports.updateProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, email } = req.body;

    const admin = await User.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'User not found' });

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    await admin.save();

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
