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
 * Register a new staff member
 * POST /staff/register
 * Body: { shopId, name, email, password }
 */
exports.staffRegister = async (req, res) => {
  try {
    const { shopId, name, email, password } = req.body;

    // ============ INPUT VALIDATION ============

    if (!shopId || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Shop ID, name, email, and password are required",
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

    // ============ VERIFY SHOP EXISTS ============

    const shop = await prisma.shop.findUnique({ where: { id: shopId } });

    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    // ============ CHECK IF EMAIL EXISTS ============

    const exists = await prisma.staff.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        error: "Email already registered",
      });
    }

    // ============ HASH PASSWORD & CREATE STAFF ============

    const hashedPassword = await bcrypt.hash(password, 12);

    const staff = await prisma.staff.create({
      data: {
        shopId,
        name: sanitizeInput(name),
        email: email.toLowerCase(),
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        shopId: true,
      },
    });

    console.log(`✅ Staff registered: ${staff.email} for shop: ${shopId}`);

    return res.status(201).json({
      success: true,
      message: "Staff member registered successfully",
      staff,
    });
  } catch (err) {
    console.error("❌ Staff registration error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Failed to register staff member",
    });
  }
};

/**
 * Login staff member
 * POST /staff/login
 * Body: { email, password }
 */
exports.staffLogin = async (req, res) => {
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

    // ============ FIND STAFF ============

    const staff = await prisma.staff.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        shopId: true,
        password: true,
      },
    });

    if (!staff) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // ============ VERIFY PASSWORD ============

    const passwordMatch = await bcrypt.compare(password, staff.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    // ============ GENERATE TOKEN ============

    const token = generateToken(staff.id);

    console.log(`✅ Staff logged in: ${staff.email}`);

    return res.json({
      success: true,
      message: "Login successful",
      token,
      staff: {
        id: staff.id,
        name: staff.name,
        email: staff.email,
        shopId: staff.shopId,
      },
    });
  } catch (err) {
    console.error("❌ Staff login error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
};

/**
 * Get staff profile
 * GET /staff/profile
 * Requires: Authentication middleware
 */
exports.getStaffProfile = async (req, res) => {
  try {
    const staff = await prisma.staff.findUnique({
      where: { id: req.staffId || req.ownerId },
      select: {
        id: true,
        name: true,
        email: true,
        shopId: true,
      },
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        error: "Staff member not found",
      });
    }

    return res.json({
      success: true,
      staff,
    });
  } catch (err) {
    console.error("❌ Get staff profile error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch profile",
    });
  }
};

module.exports = {
  staffRegister: exports.staffRegister,
  staffLogin: exports.staffLogin,
  getStaffProfile: exports.getStaffProfile,
};
