const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');
const mongoose = require('mongoose');

// ✅ Create Booking
const createBooking = async (req, res) => {
  try {
    const { slotId } = req.body;

    const slot = await ParkingSlot.findById(slotId);
    if (!slot || slot.status !== 'vacant') {
      return res.status(400).json({ message: 'Slot is not available' });
    }

    // Mark slot as occupied
    slot.status = 'occupied';
    await slot.save();

    console.log("✅ Booking Created:");
    console.log("Slot:", slot.slot);
    console.log("Rate/hour:", slot.rate);

    const booking = await Booking.create({
      userId: req.user.id,
      slotId,
      startTime: new Date(),
      isActive: true,
    });

    res.status(201).json({ message: 'Booking created', booking });
  } catch (err) {
    console.error("❌ Error in createBooking:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ End Booking with 5-min billing logic
const endBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(bookingId).populate('slotId');
    if (!booking || !booking.isActive) {
      return res.status(400).json({ message: 'Booking not found or already ended' });
    }

    const endTime = new Date();
    const startTime = new Date(booking.startTime);
    const durationMs = endTime - startTime;
    const durationMinutes = Math.ceil(durationMs / 60000); // round up to next minute

    const ratePerHour = booking.slotId?.rate || 60; // fallback to ₹60/hour if undefined
    const ratePer5Min = ratePerHour / 12;
    const blocksUsed = Math.ceil(durationMinutes / 5) || 1; // minimum 1 block
    const totalFare = Math.ceil(blocksUsed * ratePer5Min);

    // 🧪 Debug logs
    console.log("✅ Ending Booking:");
    console.log("Slot:", booking.slotId.slot);
    console.log("Rate/hour:", ratePerHour);
    console.log("Rate/5min:", ratePer5Min);
    console.log("Duration (min):", durationMinutes);
    console.log("Blocks used:", blocksUsed);
    console.log("Total Fare (₹):", totalFare);

    // Update booking record
    booking.endTime = endTime;
    booking.durationMinutes = durationMinutes;
    booking.blocksUsed = blocksUsed;
    booking.fare = totalFare;
    booking.isActive = false;
    await booking.save();

    // Mark slot as vacant
    booking.slotId.status = 'vacant';
    await booking.slotId.save();

    res.status(200).json({
      message: 'Booking ended successfully',
      bookingId: booking._id,
      slot: booking.slotId.slot,
      duration: `${durationMinutes} minutes`,
      blocksUsed,
      totalFare: `₹${booking.fare}`,
      status: 'Payment Pending',
      exitTime: endTime,
    });
  } catch (err) {
    console.error("❌ Error in endBooking:", err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// ✅ Get current booking for user
const getCurrentBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      userId: req.user.id,
      isActive: true,
    }).populate('slotId');

    if (!booking) return res.status(200).json({ booking: null });

    res.status(200).json({ booking });
  } catch (err) {
    console.error('❌ Error getting current booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: 'Invalid booking ID' });
    }

    const booking = await Booking.findById(bookingId)
      .populate('slotId')
      .populate('userId', 'email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json({
      bookingId: booking._id,
      slot: booking.slotId?.slot || 'N/A',
      duration: `${booking.durationMinutes || 0} minutes`,
      blocksUsed: booking.blocksUsed || 0,
      totalFare: `₹${booking.fare || 0}`,
      status: booking.isActive ? 'Active' : 'Payment Pending',
      exitTime: booking.endTime || null,
    });
  } catch (err) {
    console.error('❌ Error in getBookingById:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createBooking,
  endBooking,
  getCurrentBooking,
  getBookingById,
};
