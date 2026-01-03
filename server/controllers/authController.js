const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { generateToken } = require("../utils/jwtUtils");
const {
  isValidEmail,
  validatePassword,
  isValidName,
  sanitizeInput,
} = require("../utils/validators");

const prisma = new PrismaClient();

/**
 * Register a new owner
 * POST /auth/register
 * Body: { name, email, password }
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ============ INPUT VALIDATION ============

    // Check all required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required",
      });
    }

    // Validate name
    if (!isValidName(name)) {
      return res.status(400).json({
        success: false,
        error: "Name must be between 2 and 50 characters",
      });
    }

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: "Password requirements not met",
        details: passwordValidation.errors,
      });
    }

    // ============ CHECK IF EMAIL EXISTS ============

    const exists = await prisma.owner.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        error: "Email already registered",
      });
    }

    // ============ HASH PASSWORD & CREATE USER ============

    const hashedPassword = await bcrypt.hash(password, 12);

    const owner = await prisma.owner.create({
      data: {
        name: sanitizeInput(name),
        email: email.toLowerCase(),
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    console.log(`✅ Owner registered: ${owner.email}`);

    return res.status(201).json({
      success: true,
      message: "Registration successful! Please login.",
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Registration failed. Please try again.",
    });
  }
};

/**
 * Login owner
 * POST /auth/login
 * Body: { email, password }
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ============ INPUT VALIDATION ============

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    // ============ FIND USER ============

    const owner = await prisma.owner.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
      },
    });

    if (!owner) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // ============ VERIFY PASSWORD ============

    const passwordMatch = await bcrypt.compare(password, owner.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // ============ GENERATE TOKEN ============

    const token = generateToken(owner.id);

    console.log(`✅ Owner logged in: ${owner.email}`);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Login failed. Please try again.",
    });
  }
};

/**
 * Get current user profile
 * GET /auth/profile
 * Requires: Authentication middleware
 */
exports.getProfile = async (req, res) => {
  try {
    const owner = await prisma.owner.findUnique({
      where: { id: req.ownerId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.json({
      success: true,
      owner,
    });
  } catch (err) {
    console.error("❌ Get profile error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch profile",
    });
  }
};

/**
 * Change password
 * POST /auth/change-password
 * Body: { currentPassword, newPassword }
 * Requires: Authentication middleware
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // ============ INPUT VALIDATION ============

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Current password and new password are required",
      });
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: "New password requirements not met",
        details: passwordValidation.errors,
      });
    }

    // ============ VERIFY CURRENT PASSWORD ============

    const owner = await prisma.owner.findUnique({
      where: { id: req.ownerId },
      select: { password: true },
    });

    const passwordMatch = await bcrypt.compare(currentPassword, owner.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // ============ UPDATE PASSWORD ============

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.owner.update({
      where: { id: req.ownerId },
      data: { password: hashedPassword },
    });

    console.log(`✅ Password changed for user: ${req.ownerId}`);

    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("❌ Change password error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Failed to change password",
    });
  }
};

/**
 * Check if owner has reset password set
 * GET /auth/check-reset-password/:ownerId
 */
exports.checkResetPassword = async (req, res) => {
  try {
    const { ownerId } = req.params;

    const owner = await prisma.owner.findUnique({
      where: { id: ownerId },
      select: { resetPassword: true },
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        error: "Owner not found",
      });
    }

    return res.json({
      success: true,
      hasResetPassword: !!owner.resetPassword,
    });
  } catch (err) {
    console.error("❌ Check reset password error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Failed to check reset password",
    });
  }
};

/**
 * Set reset password for token reset
 * POST /auth/set-reset-password
 * Body: { ownerId, resetPassword }
 */
exports.setResetPassword = async (req, res) => {
  try {
    const { ownerId, resetPassword } = req.body;

    if (!ownerId || !resetPassword) {
      return res.status(400).json({
        success: false,
        error: "Owner ID and reset password are required",
      });
    }

    if (resetPassword.length < 4) {
      return res.status(400).json({
        success: false,
        error: "Reset password must be at least 4 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(resetPassword, 12);

    await prisma.owner.update({
      where: { id: ownerId },
      data: { resetPassword: hashedPassword },
    });

    console.log(`✅ Reset password set for owner: ${ownerId}`);

    return res.json({
      success: true,
      message: "Reset password set successfully",
    });
  } catch (err) {
    console.error("❌ Set reset password error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Failed to set reset password",
    });
  }
};
