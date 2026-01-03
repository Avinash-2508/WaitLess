const jwt = require("jsonwebtoken");

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @param {string} expiresIn - Token expiry (default from ENV)
 * @returns {string} JWT token
 */
const generateToken = (id, expiresIn = process.env.JWT_EXPIRY || "7d") => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {object} Decoded token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header
 * @returns {string|null} Token or null
 */
const extractToken = (authHeader) => {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken,
};
