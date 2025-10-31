
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

// Import configurations
const connectDB = require("./config/database");
const socketHandlers = require("./socket/socketHandlers");
const errorHandler = require("./middleware/errorHandler");
const { apiLimiter } = require("./middleware/rateLimiter");

// Import routes
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");
const webhookRoutes = require("./routes/webhooks");

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  maxHttpBufferSize: 10e6, // 10MB
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Connect to MongoDB
connectDB();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Request logging (development only)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Initialize socket handlers
socketHandlers(io);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: "connected",
  });
});

//test
console.log("userRoutes type:", typeof userRoutes);
console.log("messageRoutes type:", typeof messageRoutes);
console.log("webhookRoutes type:", typeof webhookRoutes);

// API Routes
app.use("/api/users", apiLimiter, userRoutes);
app.use("/api/messages", apiLimiter, messageRoutes);
app.use("/webhooks", webhookRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    name: "Enhanced Chat API",
    version: "2.0.0",
    status: "running",
    endpoints: {
      websocket: `ws://localhost:${process.env.PORT || 5000}`,
      health: "/health",
      api: {
        users: "/api/users",
        messages: "/api/messages",
      },
      webhooks: {
        clerk: "/webhooks/clerk",
      },
    },
    documentation: "https://github.com/yourusername/chat-app",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.path,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 Enhanced Chat Server Started Successfully        ║
║                                                       ║
║   📡 Port:        ${PORT.toString().padEnd(35)}║
║   🌐 Environment: ${(process.env.NODE_ENV || "development").padEnd(35)}║
║   🔗 Client URL:  ${(
    process.env.CLIENT_URL || "http://localhost:5173"
  ).padEnd(35)}║
║   ⏰ Started:     ${new Date().toLocaleString().padEnd(35)}║
║                                                       ║
║   📚 API Endpoints:                                   ║
║      • GET  /health                                   ║
║      • GET  /api/users                                ║
║      • GET  /api/messages/recent                      ║
║      • POST /webhooks/clerk                           ║
║                                                       ║
║   🔌 WebSocket:   ws://localhost:${PORT}                     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} signal received: closing HTTP server`);

  // Close socket connections
  io.close(() => {
    console.log("Socket.io connections closed");
  });

  // Close HTTP server
  server.close(async () => {
    console.log("HTTP server closed");

    // Close database connection
    const mongoose = require("mongoose");
    await mongoose.connection.close();
    console.log("MongoDB connection closed");

    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

// Handle termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  gracefulShutdown("uncaughtException");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

module.exports = { app, server, io };