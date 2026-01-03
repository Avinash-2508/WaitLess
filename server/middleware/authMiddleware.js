const jwt = require("jsonwebtoken");
const { extractToken } = require("../utils/jwtUtils");

/**
 * Authentication Middleware - Verify JWT token
 * Extracts token from Authorization header and verifies it
 * Sets req.ownerId if valid
 */
const authMiddleware = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = extractToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided. Please login.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.ownerId = decoded.id;
    next();
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired. Please login again.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token. Please login again.",
      });
    }

    return res.status(401).json({
      success: false,
      error: "Authentication failed.",
    });
  }
};

module.exports = authMiddleware;
