const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  slotId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSlot',
    required: true
  },

  // ⏱️ Booking start and end times
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },

  // 💵 Final fare calculated based on 5-min billing logic
  fare: {
    type: Number,
    default: 0
  },

  // 📦 5-minute blocks used (rounded up)
  blocksUsed: {
    type: Number,
    default: 0
  },

  // 🔢 Duration in minutes
  durationMinutes: {
    type: Number,
    default: 0
  },

  // ✅ Whether the booking is currently active
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
