// server/server.js
const express = require('express');
const http = require('http'); // Required for Socket.IO integration
const { Server } = require('socket.io'); // Required for Socket.IO integration
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware'); // Ensure custom error handling is imported

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (ONLY CALL ONCE)
connectDB();

// CORS for frontend
// Use process.env.CORS_ORIGIN for the deployed frontend URL, defaults to localhost for local dev
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Body parser middleware (for raw JSON)
app.use(express.json());
// Body parser for URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Create an HTTP server from the Express app (REQUIRED FOR SOCKET.IO)
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server (REQUIRED FOR SOCKET.IO)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Use same origin as Express CORS
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Store connected users (map userId to socket.id) - for future notification use
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`Socket.IO: User connected: ${socket.id}`);

  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`Socket.IO: User ${userId} registered with socket ID ${socket.id}`);
    io.emit('onlineUsersUpdate', Array.from(onlineUsers.keys()));
  });

  socket.on('disconnect', () => {
    console.log(`Socket.IO: User disconnected: ${socket.id}`);
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`Socket.IO: User ${userId} removed from online list.`);
        break;
      }
    }
    io.emit('onlineUsersUpdate', Array.from(onlineUsers.keys()));
  });
});

// Make io instance and onlineUsers map available to controllers via req object (middleware)
app.use((req, res, next) => {
  req.io = io;
  req.onlineUsers = onlineUsers;
  next();
});

// Define API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
// Note: If you add notification routes later, they would go here too

// Custom error handling middleware (must be after all routes)
// app.use(notFound); // If you have a separate notFound middleware, place it before errorHandler
app.use(errorHandler); // Handles general errors

// Change app.listen to server.listen for Socket.IO integration (listen on the http server)
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
