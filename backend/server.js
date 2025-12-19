const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

/*
|--------------------------------------------------------------------------
| ✅ CORS CONFIG (RENDER + VERCEL SAFE)
|--------------------------------------------------------------------------
| IMPORTANT RULE:
| - Do NOT mix custom origin logic + app.options
| - Let cors() handle OPTIONS automatically
*/
app.use(cors({
  origin: 'https://parkit-now-project1-0.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));

// Body parser
app.use(express.json());

// Root route (health check)
app.get('/', (req, res) => {
  res.send('🚀 ParkitNow Backend is running!');
});

// Test API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const rateRoutes = require('./routes/rateRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rate', rateRoutes);
app.use('/api/admin', adminRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
