const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS setup (Laptop + Mobile Access ke liye IP allow karo)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://192.168.229.191:5173' // 👉 apna laptop ka IP (ipconfig se check karo)
  ],
  credentials: true,
}));

// ✅ JSON body parser
app.use(express.json());

// ✅ Route Imports
const authRoutes = require('./routes/authRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const rateRoutes = require('./routes/rateRoutes');
const adminRoutes = require('./routes/adminRoutes'); 

// ✅ Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rate', rateRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on http://192.168.229.191:${PORT}`);
});
