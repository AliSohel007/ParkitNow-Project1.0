const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');
const User = require('../models/User');

// ✅ Create Booking
router.post('/create', authenticate, async (req, res) => {
  try {
    const { slotId } = req.body;

    if (!slotId || !mongoose.Types.ObjectId.isValid(slotId)) {
      return res.status(400).json({ message: 'Valid Slot ID is required' });
    }

    const slot = await ParkingSlot.findById(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.status !== 'vacant') {
      return res.status(400).json({ message: 'Slot is not available' });
    }

    const existing = await Booking.findOne({ userId: req.user.id, isActive: true });
    if (existing) {
      return res.status(400).json({ message: 'You already have an active booking' });
    }

    const booking = new Booking({
      userId: req.user.id,
      slotId,
      startTime: new Date(),
      isActive: true,
    });

    await booking.save();
    slot.status = 'occupied';
    await slot.save();

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    console.error('Booking create error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ End Booking
router.post('/exit/:bookingId', authenticate, async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(bookingId).populate('slotId');
    if (!booking || !booking.isActive) {
      return res.status(400).json({ message: 'Invalid or already completed booking' });
    }

    const endTime = new Date();
    const durationMs = endTime - new Date(booking.startTime);
    const minutes = Math.ceil(durationMs / 60000);
    const rate = booking.slotId.rate || 50;
    const totalFare = Math.ceil(minutes / 30) * rate;

    booking.endTime = endTime;
    booking.isActive = false;
    booking.duration = minutes;
    booking.fare = totalFare;
    await booking.save();

    booking.slotId.status = 'vacant';
    await booking.slotId.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('slotId')
      .populate('userId', 'email');

    res.status(200).json({
      message: 'Booking closed successfully',
      booking: updatedBooking,
    });
  } catch (err) {
    console.error('Booking exit error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Get Current Booking (User)
router.get('/current', authenticate, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      userId: req.user.id,
      isActive: true,
    }).populate('slotId');

    res.status(200).json({ booking: booking || null });
  } catch (err) {
    console.error('Fetch current booking error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Get Booking History (User)
router.get('/my', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('slotId')
      .sort({ startTime: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    console.error('Fetch my bookings error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Get All Bookings (Admin only)
router.get('/all', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can view all bookings' });
    }

    const bookings = await Booking.find()
      .populate('slotId')
      .populate('userId', 'email')
      .sort({ startTime: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    console.error('Fetch all bookings error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Get Booking by ID (For Exit Summary)
router.get('/:bookingId', authenticate, async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(bookingId)
      .populate('userId', 'email')
      .populate('slotId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      booking,
    });
  } catch (err) {
    console.error('Fetch booking by ID error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
