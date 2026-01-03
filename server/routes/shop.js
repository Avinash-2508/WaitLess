const express = require("express");
const {
  createShop,
  getShop,
  getShopByOwnerId,
  deleteShop,
  getAllShops,
} = require("../controllers/shopController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes (require authentication)
router.post("/", authMiddleware, createShop);
router.delete("/:id", authMiddleware, deleteShop);

// Public routes
router.get("/", getAllShops); // Get all shops for staff registration
router.get("/owner/:ownerId", getShopByOwnerId);
router.get("/:id", getShop);

module.exports = router;
