const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const Rate = require("../models/Rate");

// ✅ GET current parking rate
router.get("/", authenticate, async (req, res) => {
  try {
    let rate = await Rate.findOne();
    if (!rate) {
      rate = new Rate({ price: 50, interval: 30 }); // 👈 Default rate values
      await rate.save();
    }
    res.json(rate);
  } catch (err) {
    console.error("❌ Fetch rate error:", err);
    res.status(500).json({ message: "Failed to fetch rate" });
  }
});

// ✅ PUT update rate (Admin only)
router.put("/", authenticate, async (req, res) => {
  try {
    console.log("🔐 Authenticated user:", req.user); // ✅ Debugging role from token

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update rate" });
    }

    const { price, interval } = req.body;

    if (!price || !interval) {
      return res.status(400).json({ message: "Price and interval required" });
    }

    let rate = await Rate.findOne();
    if (!rate) {
      rate = new Rate({ price, interval });
    } else {
      rate.price = price;
      rate.interval = interval;
    }

    await rate.save();
    res.status(200).json({ message: "✅ Rate updated successfully", rate });
  } catch (err) {
    console.error("❌ Update rate error:", err);
    res.status(500).json({ message: "Failed to update rate" });
  }
});

module.exports = router;
