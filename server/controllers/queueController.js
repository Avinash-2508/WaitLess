const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Check and reset tokens if it's a new day (runs on every operation)
const checkReset = async (shopId) => {
  try {
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) return;

    const now = new Date();
    const lastResetDate = new Date(shop.lastReset);
    
    // Get start of today (00:00:00)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfLastReset = new Date(
      lastResetDate.getFullYear(), 
      lastResetDate.getMonth(), 
      lastResetDate.getDate()
    );

    // Check if last reset was on a different day
    if (startOfToday.getTime() !== startOfLastReset.getTime()) {
      console.log(`🔄 Daily reset triggered for shop: ${shop.name || shopId}`);
      console.log(`   Last reset: ${lastResetDate.toLocaleString()}`);
      console.log(`   Current time: ${now.toLocaleString()}`);
      
      await prisma.shop.update({
        where: { id: shopId },
        data: {
          currentToken: 0,
          lastIssuedToken: 0,
          dailyServed: 0,
          lastReset: now
        }
      });

      // Delete all token records from previous days
      const deletedCount = await prisma.token.deleteMany({
        where: { 
          shopId,
          createdAt: {
            lt: startOfToday // Before today 00:00:00
          }
        }
      });

      console.log(`✅ Daily reset completed for shop: ${shop.name || shopId}`);
      console.log(`   Deleted ${deletedCount.count} old token records`);
      
      // Emit real-time notification
      if (global.io) {
        global.io.emit('queueUpdate', {
          shopId,
          currentToken: 0,
          waiting: 0,
          servedToday: 0,
          resetNotification: 'Queue has been reset for the new day'
        });
      }
    }
  } catch (err) {
    console.error(`❌ Daily reset error for shop ${shopId}:`, err.message);
  }
};

// Status endpoint: return current token, next token, and waiting count
exports.status = async (req, res) => {
  try {
    const { shopId } = req.params;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: "Shop ID is required",
      });
    }

    await checkReset(shopId);

    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    
    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    const waiting = Math.max(0, shop.lastIssuedToken - shop.currentToken);
    const nextToken = shop.lastIssuedToken + 1;

    res.json({
      success: true,
      data: {
        currentToken: shop.currentToken,
        nextToken,
        waiting,
        servedToday: shop.dailyServed || 0,
      },
    });
  } catch (err) {
    console.error("❌ Status error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch queue status",
    });
  }
};

// Join Queue (Customer): issue new token without advancing current
exports.joinQueue = async (req, res) => {
  console.log('📥 JOIN QUEUE REQUEST:', {
    shopId: req.params.shopId,
    body: req.body,
    headers: {
      'content-type': req.headers['content-type'],
      'authorization': req.headers['authorization'] ? 'present' : 'none'
    }
  });
  
  try {
    const { shopId } = req.params;

    if (!shopId) {
      console.error('❌ No shopId provided');
      return res.status(400).json({
        success: false,
        error: "Shop ID is required",
      });
    }

    console.log('🔄 Running checkReset for shop:', shopId);
    await checkReset(shopId);

    console.log('🔍 Finding shop:', shopId);
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      console.error('❌ Shop not found:', shopId);
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    const issuedToken = shop.lastIssuedToken + 1;
    console.log('🎫 Issuing token:', issuedToken);

    await prisma.shop.update({
      where: { id: shopId },
      data: { lastIssuedToken: issuedToken },
    });

    // Create Token record
    try {
      await prisma.token.create({
        data: {
          shopId,
          token: issuedToken,
          status: "waiting",
        },
      });
      console.log("✅ Token created:", issuedToken, "for shop:", shopId);
    } catch (tokenErr) {
      console.error("❌ Token creation error:", tokenErr.message);
      // Continue even if token creation fails (for backward compatibility)
    }

    console.log('✅ JOIN QUEUE SUCCESS - Token issued:', issuedToken);
    return res.json({
      success: true,
      message: "Token issued successfully",
      data: {
        token: issuedToken,
      },
    });
  } catch (err) {
    console.error("❌ JOIN QUEUE ERROR:", {
      message: err.message,
      stack: err.stack,
      shopId: req.params.shopId
    });
    return res.status(500).json({
      success: false,
      error: "Failed to join queue: " + err.message,
    });
  }
};

// Next Customer (Staff/Owner): advance current token and mark as served
exports.nextCustomer = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { staffId } = req.body;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: "Shop ID is required",
      });
    }

    await checkReset(shopId);

    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    const newCurrent = shop.currentToken + 1;

    // Update shop with new current token
    const updated = await prisma.shop.update({
      where: { id: shopId },
      data: {
        currentToken: newCurrent,
        dailyServed: { increment: 1 },
      },
    });

    // Update Token record: mark as served
    const updatedToken = await prisma.token.updateMany({
      where: {
        shopId,
        token: newCurrent,
        status: "waiting",
      },
      data: {
        status: "served",
        servedBy: staffId || "Owner",
        servedAt: new Date(),
      },
    });

    const waiting = Math.max(0, updated.lastIssuedToken - updated.currentToken);

    console.log(
      `✅ Customer served: Token ${newCurrent} at shop ${shopId}`
    );

    // Emit real-time update via Socket.io
    if (global.io) {
      global.io.emit("queueUpdate", {
        shopId,
        currentToken: updated.currentToken,
        waiting,
        servedToday: updated.dailyServed,
      });
    }

    return res.json({
      success: true,
      message: "Customer served",
      data: {
        currentToken: updated.currentToken,
        waiting,
        servedToday: updated.dailyServed,
      },
    });
  } catch (err) {
    console.error("❌ NEXT CUSTOMER ERROR:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to serve next customer",
    });
  }
};

// Pause queue
exports.pauseQueue = async (req, res) => {
  try {
    const { shopId } = req.body;

    if (!shopId) {
      return res.status(400).json({ success: false, error: "Shop ID is required" });
    }

    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: { pauseState: true },
    });

    if (global.io) {
      global.io.emit("queuePaused", { shopId, pauseState: true });
    }

    return res.json({
      success: true,
      message: "Queue paused",
      data: { pauseState: shop.pauseState },
    });
  } catch (err) {
    console.error("❌ PAUSE QUEUE ERROR:", err.message);
    res.status(500).json({ success: false, error: "Failed to pause queue" });
  }
};

// Resume queue
exports.resumeQueue = async (req, res) => {
  try {
    const { shopId } = req.body;

    if (!shopId) {
      return res.status(400).json({ success: false, error: "Shop ID is required" });
    }

    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: { pauseState: false },
    });

    if (global.io) {
      global.io.emit("queueResumed", { shopId, pauseState: false });
    }

    return res.json({
      success: true,
      message: "Queue resumed",
      data: { pauseState: shop.pauseState },
    });
  } catch (err) {
    console.error("❌ RESUME QUEUE ERROR:", err.message);
    res.status(500).json({ success: false, error: "Failed to resume queue" });
  }
};

// Get estimated wait time
exports.getWaitTime = async (req, res) => {
  try {
    const { shopId, tokenNumber } = req.query;

    if (!shopId || !tokenNumber) {
      return res.status(400).json({ success: false, error: "Shop ID and token number are required" });
    }

    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      return res.status(404).json({ success: false, error: "Shop not found" });
    }

    const tokensAhead = Math.max(0, parseInt(tokenNumber) - shop.currentToken - 1);
    const estimatedMinutes = tokensAhead * shop.avgServiceTime;

    return res.json({
      success: true,
      data: {
        tokensAhead,
        estimatedMinutes,
        avgServiceTime: shop.avgServiceTime,
      },
    });
  } catch (err) {
    console.error("❌ GET WAIT TIME ERROR:", err.message);
    res.status(500).json({ success: false, error: "Failed to get wait time" });
  }
};

// Owner: generate next token immediately after payment is received
exports.generateTokenWithPayment = async (req, res) => {
  try {
    const { shopId } = req.body;

    if (!shopId) {
      return res.status(400).json({ success: false, error: "Shop ID is required" });
    }

    await checkReset(shopId);

    const tokenNumber = await prisma.$transaction(async (tx) => {
      const shop = await tx.shop.findUnique({ where: { id: shopId } });
      if (!shop) {
        throw new Error("Shop not found");
      }

      const nextToken = shop.lastIssuedToken + 1;

      await tx.shop.update({
        where: { id: shopId },
        data: { lastIssuedToken: nextToken },
      });

      await tx.token.create({
        data: {
          shopId,
          token: nextToken,
          status: "waiting",
          paymentId: null,
        },
      });

      return nextToken;
    });

    const shopAfter = await prisma.shop.findUnique({ where: { id: shopId } });
    const waiting = Math.max(0, (shopAfter?.lastIssuedToken || 0) - (shopAfter?.currentToken || 0));

    return res.json({
      success: true,
      message: "Token generated",
      data: { tokenNumber, waiting },
    });
  } catch (err) {
    console.error("❌ GENERATE TOKEN ERROR:", err.message);
    const status = err.message === "Shop not found" ? 404 : 500;
    return res.status(status).json({ success: false, error: err.message || "Failed to generate token" });
  }
};

// Customer: claim earliest waiting token by attaching paymentId
exports.claimTokenWithPayment = async (req, res) => {
  try {
    const { shopId, paymentId } = req.body;

    if (!shopId || !paymentId) {
      return res.status(400).json({ success: false, error: "shopId and paymentId are required" });
    }

    await checkReset(shopId);

    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      return res.status(404).json({ success: false, error: "Shop not found" });
    }

    const tokenNumber = await prisma.$transaction(async (tx) => {
      const nextToken = await tx.token.findFirst({
        where: { shopId, status: "waiting", paymentId: null },
        orderBy: [
          { createdAt: "asc" },
          { token: "asc" },
        ],
      });

      if (!nextToken) {
        throw new Error("No waiting tokens available");
      }

      const updated = await tx.token.updateMany({
        where: { id: nextToken.id, paymentId: null },
        data: { paymentId },
      });

      if (updated.count === 0) {
        throw new Error("Token already claimed, please retry");
      }

      return nextToken.token;
    });

    // Emit update for listeners to refresh waiting count
    const shopAfter = await prisma.shop.findUnique({ where: { id: shopId } });
    const waiting = Math.max(0, (shopAfter?.lastIssuedToken || 0) - (shopAfter?.currentToken || 0));
    if (global.io) {
      global.io.emit("queueUpdate", {
        shopId,
        currentToken: shopAfter?.currentToken || 0,
        waiting,
        servedToday: shopAfter?.dailyServed || 0,
      });
    }

    return res.json({
      success: true,
      message: "Token claimed",
      data: { tokenNumber },
    });
  } catch (err) {
    console.error("❌ CLAIM TOKEN ERROR:", err.message);
    const status = err.message === "Shop not found" ? 404 : err.message.includes("No waiting") ? 404 : 400;
    return res.status(status).json({ success: false, error: err.message });
  }
};

/**
 * Skip customer (mark as missed)
 * POST /queue/:shopId/skip
 * Requires: Authentication middleware
 */
exports.skipCustomer = async (req, res) => {
  try {
    const { shopId } = req.params;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: "Shop ID is required",
      });
    }

    await checkReset(shopId);

    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    // Mark skipped token as missed
    await prisma.token.updateMany({
      where: { shopId, token: shop.currentToken + 1 },
      data: { status: "missed" },
    });

    // Increment current token
    const updated = await prisma.shop.update({
      where: { id: shopId },
      data: { currentToken: { increment: 1 } },
    });

    const waiting = Math.max(0, updated.lastIssuedToken - updated.currentToken);

    console.log(
      `⏭️  Customer skipped: Token ${shop.currentToken + 1} at shop ${shopId}`
    );

    // Emit real-time update
    if (global.io) {
      global.io.emit("queueUpdate", {
        shopId,
        currentToken: updated.currentToken,
        waiting,
      });
    }

    return res.json({
      success: true,
      message: "Customer skipped",
      data: {
        currentToken: updated.currentToken,
        waiting,
      },
    });
  } catch (error) {
    console.error("❌ SKIP CUSTOMER ERROR:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to skip customer",
    });
  }
};

/**
 * Get token history with pagination
 * GET /queue/history/:shopId?page=1&limit=20
 */
exports.getHistory = async (req, res) => {
  try {
    const { shopId } = req.params;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: "Shop ID is required",
      });
    }

    // Verify shop exists
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: { id: true },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    // Get total count
    const totalCount = await prisma.token.count({
      where: { shopId },
    });

    // Get paginated tokens
    const tokensRaw = await prisma.token.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        token: true,
        paymentId: true,
        createdAt: true,
        servedBy: true,
        servedAt: true,
        status: true,
      },
    });

    const tokens = tokensRaw.map((t) => ({
      tokenNumber: t.token,
      paymentId: t.paymentId || null,
      createdAt: t.createdAt,
      servedBy: t.servedBy || null,
      servedAt: t.servedAt || null,
      status: t.status,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    console.log(`📋 History fetched: ${tokens.length} tokens for shop ${shopId}`);

    return res.json({
      success: true,
      data: {
        tokens,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasMore: page < totalPages,
        },
      },
    });
  } catch (error) {
    console.error("❌ HISTORY ERROR:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch history",
    });
  }
};

/**
 * Reset all tokens (manual reset with password protection)
 * POST /queue/:shopId/reset
 * Body: { resetPassword }
 */
exports.resetTokens = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { resetPassword } = req.body;

    if (!shopId) {
      return res.status(400).json({
        success: false,
        error: "Shop ID is required",
      });
    }

    if (!resetPassword) {
      return res.status(400).json({
        success: false,
        error: "Reset password is required",
      });
    }

    // Get shop and owner
    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: { Owner: true },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    // Check if reset password is set
    if (!shop.Owner.resetPassword) {
      return res.status(400).json({
        success: false,
        error: "Reset password not set. Please set it first.",
      });
    }

    // Verify reset password
    const bcrypt = require("bcrypt");
    const passwordMatch = await bcrypt.compare(
      resetPassword,
      shop.Owner.resetPassword
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid reset password",
      });
    }

    // Reset tokens
    await prisma.shop.update({
      where: { id: shopId },
      data: {
        currentToken: 0,
        lastIssuedToken: 0,
        dailyServed: 0,
        lastReset: new Date(),
      },
    });

    // Delete all token records for this shop
    await prisma.token.deleteMany({
      where: { shopId },
    });

    console.log(`🔄 Tokens manually reset for shop: ${shopId}`);

    // Emit real-time update
    if (global.io) {
      global.io.emit("queueUpdate", {
        shopId,
        currentToken: 0,
        waiting: 0,
        servedToday: 0,
      });
    }

    return res.json({
      success: true,
      message: "All tokens have been reset",
      data: {
        currentToken: 0,
        waiting: 0,
        servedToday: 0,
      },
    });
  } catch (error) {
    console.error("❌ RESET TOKENS ERROR:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to reset tokens",
    });
  }
};

module.exports = { 
  status: exports.status, 
  joinQueue: exports.joinQueue, 
  nextCustomer: exports.nextCustomer,
  skipCustomer: exports.skipCustomer,
  getHistory: exports.getHistory,
  resetTokens: exports.resetTokens,
  generateTokenWithPayment: exports.generateTokenWithPayment,
  claimTokenWithPayment: exports.claimTokenWithPayment,
  pauseQueue: exports.pauseQueue,
  resumeQueue: exports.resumeQueue,
  getWaitTime: exports.getWaitTime
};
