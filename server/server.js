require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const prisma = new PrismaClient();
const app = express();
const BASE_PORT = Number(process.env.PORT) || 5000;

// ============ BODY PARSER - Must come first ============
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============ CORS - Allow all origins in development ============
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
}));

// ============ SECURITY MIDDLEWARE ============

// Helmet - Set secure HTTP headers (after CORS)
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Rate limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased limit for development
  message: "Too many requests, please try again later",
  skip: (req) => {
    // Skip rate limiting for queue operations in development
    return req.path.includes('/queue/') || req.path.includes('/shop/');
  }
});
app.use(limiter);

// Auth route specific rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Increased for development
  message: "Too many login attempts, please try again later",
  skipSuccessfulRequests: true,
});

// ============ HEALTH & DB CHECK ROUTES ============

app.get("/", (req, res) => {
  res.json({ 
    message: "WaitLess Backend Running 🚀",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/test-db", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT NOW()`;
    res.json({ 
      message: "🟢 PostgreSQL Connected Successfully!",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).json({ 
      message: "🔴 Database Connection Failed", 
      error: error.message 
    });
  }
});

// ============ IMPORT ROUTES ============

const authRoutes = require("./routes/auth");
const shopRoutes = require("./routes/shop");
const queueRoutes = require("./routes/queue");
const staffRoutes = require("./routes/staff");
const counterRoutes = require("./routes/counter");

// Apply auth limiter to auth routes
app.use("/auth/login", authLimiter);
app.use("/auth/register", authLimiter);

app.use("/auth", authRoutes);
app.use("/shop", shopRoutes);
app.use("/queue", queueRoutes);
app.use("/staff", staffRoutes);
app.use("/counter", counterRoutes);

// ============ ERROR HANDLING ============

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const status = err.status || 500;
  const message = process.env.NODE_ENV === "production" 
    ? "Internal server error" 
    : err.message;

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: "Route not found",
    path: req.path 
  });
});

// ============ SERVER STARTUP ============

function startServer(port) {
  const server = http.createServer(app);
  
  // Socket.io with enhanced security
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
      methods: ["GET", "POST"]
    },
    transports: ["websocket", "polling"],
    maxHttpBufferSize: 1e6, // 1 MB
  });

  io.on("connection", (socket) => {
    console.log(`🟢 Client Connected: ${socket.id}`);
    
    socket.on("disconnect", () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });

    socket.on("error", (error) => {
      console.error(`⚠️ Socket error for ${socket.id}:`, error);
    });
  });

  global.io = io;

  // ============ DAILY RESET SCHEDULER ============
  
  // Run daily reset at midnight for all shops
  const scheduleDailyReset = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Next midnight
    
    const timeUntilMidnight = tomorrow - now;
    const hours = Math.floor(timeUntilMidnight / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilMidnight % (1000 * 60 * 60)) / (1000 * 60));
    
    console.log(`⏰ Daily reset scheduled for: ${tomorrow.toLocaleString()}`);
    console.log(`   Time until next reset: ${hours}h ${minutes}m`);
    
    setTimeout(async () => {
      console.log('\n🔄 ============ DAILY RESET STARTING ============');
      console.log(`   Time: ${new Date().toLocaleString()}`);
      
      try {
        // Get all shops for logging
        const shops = await prisma.shop.findMany({
          select: { id: true, name: true, currentToken: true, lastIssuedToken: true }
        });
        
        console.log(`   Resetting ${shops.length} shop(s)...`);
        
        // Reset all shops
        const updateResult = await prisma.shop.updateMany({
          data: {
            currentToken: 0,
            lastIssuedToken: 0,
            dailyServed: 0,
            lastReset: new Date()
          }
        });
        
        console.log(`   ✓ Updated ${updateResult.count} shop(s)`);
        
        // Delete token records from previous days
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        
        const deleteResult = await prisma.token.deleteMany({
          where: {
            createdAt: {
              lt: startOfToday
            }
          }
        });
        
        console.log(`   ✓ Deleted ${deleteResult.count} old token record(s)`);
        
        // Emit update to all connected clients
        if (global.io) {
          global.io.emit('dailyReset', { 
            message: 'All queues have been reset for the new day',
            timestamp: new Date().toISOString()
          });
          
          // Emit individual updates for each shop
          shops.forEach(shop => {
            global.io.emit('queueUpdate', {
              shopId: shop.id,
              currentToken: 0,
              waiting: 0,
              servedToday: 0,
              resetNotification: 'Queue reset for the new day'
            });
          });
        }
        
        console.log('✅ ============ DAILY RESET COMPLETED ============\n');
      } catch (err) {
        console.error('❌ ============ DAILY RESET FAILED ============');
        console.error('   Error:', err.message);
        console.error('   Stack:', err.stack);
      }
      
      // Schedule next reset
      scheduleDailyReset();
    }, timeUntilMidnight);
  };
  
  // Run initial check on startup for any shops that need reset
  const runInitialResetCheck = async () => {
    try {
      console.log('🔍 Checking if any shops need reset on startup...');
      
      const shops = await prisma.shop.findMany({
        select: { id: true, name: true, lastReset: true }
      });
      
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      for (const shop of shops) {
        const lastResetDate = new Date(shop.lastReset);
        const startOfLastReset = new Date(
          lastResetDate.getFullYear(),
          lastResetDate.getMonth(),
          lastResetDate.getDate()
        );
        
        // If last reset was on a different day, reset now
        if (startOfToday.getTime() !== startOfLastReset.getTime()) {
          console.log(`   Resetting shop: ${shop.name || shop.id}`);
          
          await prisma.shop.update({
            where: { id: shop.id },
            data: {
              currentToken: 0,
              lastIssuedToken: 0,
              dailyServed: 0,
              lastReset: now
            }
          });
          
          await prisma.token.deleteMany({
            where: {
              shopId: shop.id,
              createdAt: { lt: startOfToday }
            }
          });
        }
      }
      
      console.log('✅ Initial reset check completed\n');
    } catch (err) {
      console.error('❌ Initial reset check failed:', err.message);
    }
  };
  
  // Run initial check and start scheduler
  runInitialResetCheck();
  scheduleDailyReset();

  // Error handling for server
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`⚠️  Port ${port} in use. Trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Server error:", err);
      process.exit(1);
    }
  });

  server.listen(port, "0.0.0.0", () => {
    console.log(`\n🚀 WaitLess Backend running on port ${port}`);
    console.log(`📍 Test DB: http://localhost:${port}/test-db`);
    console.log(`📍 Health: http://localhost:${port}/health`);
    console.log(`🔐 Environment: ${process.env.NODE_ENV || "development"}\n`);
  });
}

// ============ GRACEFUL SHUTDOWN ============

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer(BASE_PORT);

module.exports = app;
