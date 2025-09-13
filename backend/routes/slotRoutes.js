const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  getAllSlots,
  createSlot,
  deleteSlot,
  updateSlot,
  getSlotCount,
  getVacantCount,
  getOccupiedCount,
  getReservedCount
} = require('../controllers/slotController');

// 🔐 All routes require authentication

// ✅ Get all parking slots
router.get('/', verifyToken, getAllSlots);

// ✅ Get total count of slots
router.get('/count', verifyToken, getSlotCount);

// ✅ Get count of vacant slots
router.get('/count/vacant', verifyToken, getVacantCount);

// ✅ Get count of occupied slots
router.get('/count/occupied', verifyToken, getOccupiedCount);

// ✅ Get count of reserved slots
router.get('/count/reserved', verifyToken, getReservedCount);

// ✅ Create a new parking slot
router.post('/', verifyToken, createSlot);

// ✅ Update an existing slot by ID
router.put('/:id', verifyToken, updateSlot);

// ✅ Delete a slot by ID
router.delete('/:id', verifyToken, deleteSlot);

module.exports = router;
