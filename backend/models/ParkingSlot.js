const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  slot: {
    type: String,
    required: true,
    unique: true, // e.g., "A1", "B2", etc.
  },
  status: {
    type: String,
    enum: ['vacant', 'occupied', 'reserved'],
    default: 'vacant', // Default availability
  },
  rate: {
    type: Number,
    default: 50, // ₹ per 30 minutes or per hour
  },
  reserved: {
    type: Boolean,
    default: false, // True if advance booked
  },
  location: {
    type: String,
    default: '', // Example: "Level 1 - Zone C"
  },
  cameraId: {
    type: String,
    default: '', // Optional: useful if slots are monitored
  },
  currentBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null, // Link to active booking (if any)
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('ParkingSlot', slotSchema);
