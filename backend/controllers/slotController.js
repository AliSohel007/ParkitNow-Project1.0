const ParkingSlot = require('../models/ParkingSlot');

// ✅ GET all parking slots
exports.getAllSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find().sort({ createdAt: 1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to fetch parking slots', details: err.message });
  }
};

// ✅ CREATE a new parking slot
exports.createSlot = async (req, res) => {
  try {
    const { slot, status = 'vacant', rate = 50, location = '', reserved = false } = req.body;

    if (!slot || typeof slot !== 'string' || slot.trim() === '') {
      return res.status(400).json({ error: '❌ Slot name is required and must be a non-empty string.' });
    }

    const exists = await ParkingSlot.findOne({ slot });
    if (exists) {
      return res.status(409).json({ error: `❌ Slot "${slot}" already exists` });
    }

    const newSlot = new ParkingSlot({ slot, status, rate, location, reserved });
    await newSlot.save();

    res.status(201).json({ message: '✅ Slot created successfully', slot: newSlot });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to create slot', details: err.message });
  }
};

// ✅ DELETE a slot by ID
exports.deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ParkingSlot.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: '❌ Slot not found with the provided ID' });
    }

    res.json({ message: '✅ Slot deleted successfully', slotId: id });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to delete slot', details: err.message });
  }
};

// ✅ UPDATE a slot by ID
exports.updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedSlot = await ParkingSlot.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedSlot) {
      return res.status(404).json({ error: '❌ Slot not found for update' });
    }

    res.json({ message: '✅ Slot updated successfully', slot: updatedSlot });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to update slot', details: err.message });
  }
};

// ✅ GET total parking slot count
exports.getSlotCount = async (req, res) => {
  try {
    const count = await ParkingSlot.countDocuments();
    res.json({ totalSlots: count });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to count slots', details: err.message });
  }
};

// ✅ GET vacant slots count
exports.getVacantCount = async (req, res) => {
  try {
    const count = await ParkingSlot.countDocuments({ status: 'vacant' });
    res.json({ vacantCount: count });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to count vacant slots', details: err.message });
  }
};

// ✅ GET occupied slots count
exports.getOccupiedCount = async (req, res) => {
  try {
    const count = await ParkingSlot.countDocuments({ status: 'occupied' });
    res.json({ occupiedCount: count });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to count occupied slots', details: err.message });
  }
};

// ✅ GET reserved slots count
exports.getReservedCount = async (req, res) => {
  try {
    const count = await ParkingSlot.countDocuments({ reserved: true });
    res.json({ reservedCount: count });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to count reserved slots', details: err.message });
  }
};
