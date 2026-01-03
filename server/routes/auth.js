const express = require("express");
const {
  register,
  login,
  getProfile,
  changePassword,
  checkResetPassword,
  setResetPassword,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/check-reset-password/:ownerId", checkResetPassword);
router.post("/set-reset-password", setResetPassword);

// Protected routes (require authentication)
router.get("/profile", authMiddleware, getProfile);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
