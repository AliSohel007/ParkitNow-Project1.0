const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
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

/* ======================================================
   🔥 SOCKET.IO SETUP (LIVE UPDATES)
====================================================== */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://parkit-now-project1-0.vercel.app',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🟢 WebSocket client connected:', socket.id);

  // From detector.py (slot status)
  socket.on('slot_update', (data) => {
    console.log('📡 SLOT UPDATE:', data);
    io.emit('slot_update', data); // broadcast to website
  });

  // From lpr_entry_clean.py (entry gate)
  socket.on('lpr_event', (data) => {
    console.log('🚗 LPR EVENT:', data);
    io.emit('lpr_update', data); // broadcast to website
  });

  socket.on('disconnect', () => {
    console.log('🔴 WebSocket client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.IO running on port ${PORT}`);
});
