const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const roomRoutes = require('./routes/roomRoutes');
const socketHandler = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*', // Allow any frontend during development
    methods: ['GET', 'POST'],
  },
});

// Connect to DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/rooms', roomRoutes);

// Socket Events
socketHandler(io);

// Start server
server.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});
