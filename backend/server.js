const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ CORS FIX (FINAL)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://parkit-now-project1-0.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 🔑 VERY IMPORTANT: handle preflight requests
app.options('*', cors());

// JSON body parser
app.use(express.json());

// Root route (Render test)
app.get('/', (req, res) => {
  res.send('🚀 ParkitNow Backend is running!');
});

// Test API route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Route Imports
const authRoutes = require('./routes/authRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const rateRoutes = require('./routes/rateRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rate', rateRoutes);
app.use('/api/admin', adminRoutes);

// Start Server (Render compatible)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
