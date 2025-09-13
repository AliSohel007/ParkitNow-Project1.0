const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS setup
// Localhost for dev + allow all origins in production
const allowedOrigins = [
  'http://localhost:5173', // React frontend local dev
  'http://127.0.0.1:5173'  // fallback local dev
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // Reject other origins
      return callback(new Error('CORS policy violation'), false);
    }
    return callback(null, true);
  },
  credentials: true
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
  console.log(`🚀 Server is running on port ${PORT}`);
});
