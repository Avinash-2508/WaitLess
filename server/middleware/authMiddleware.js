const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { extractToken } = require("../utils/jwtUtils");

const prisma = new PrismaClient();

/**
 * Authentication Middleware
 * - Verifies JWT
 * - Resolves user as Owner or Staff
 * - Sets req.ownerId or req.staffId (and req.shopId for staff)
 */
const authMiddleware = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided. Please login.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Try to resolve as Owner first
    const owner = await prisma.owner.findUnique({ where: { id: userId }, select: { id: true } });
    if (owner) {
      req.ownerId = owner.id;
      return next();
    }

    // Fallback to Staff
    const staff = await prisma.staff.findUnique({ where: { id: userId }, select: { id: true, shopId: true } });
    if (staff) {
      req.staffId = staff.id;
      req.shopId = staff.shopId;
      return next();
    }

    return res.status(401).json({
      success: false,
      error: "User not found. Please login again.",
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, error: "Token expired. Please login again." });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, error: "Invalid token. Please login again." });
    }
    return res.status(401).json({ success: false, error: "Authentication failed." });
  }
};

module.exports = authMiddleware;
