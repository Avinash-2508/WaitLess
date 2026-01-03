const express = require("express");
const {
  staffRegister,
  staffLogin,
  getStaffProfile,
} = require("../controllers/staffController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", staffRegister);
router.post("/login", staffLogin);

// Protected routes (require authentication)
router.get("/profile", authMiddleware, getStaffProfile);

module.exports = router;
