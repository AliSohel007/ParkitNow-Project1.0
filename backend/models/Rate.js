const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
    default: 50, // ₹50
  },
  interval: {
    type: Number,
    required: true,
    default: 30, // 30 minutes
  },
});

module.exports = mongoose.model("Rate", rateSchema);
