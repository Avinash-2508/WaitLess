const express = require("express");
const { status, joinQueue, nextCustomer, skipCustomer, getHistory, resetTokens, generateTokenWithPayment, claimTokenWithPayment, pauseQueue, resumeQueue, getWaitTime } = require("../controllers/queueController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// More specific routes must come before generic routes
router.post("/owner/generate", authMiddleware, generateTokenWithPayment);
router.post("/customer/claim", claimTokenWithPayment);
router.post("/pause", authMiddleware, pauseQueue);
router.post("/resume", authMiddleware, resumeQueue);
router.get("/wait-time", getWaitTime);
router.get("/history/:shopId", getHistory);
router.get("/:shopId", status);
router.post("/:shopId/join", joinQueue);
router.post("/:shopId/next", authMiddleware, nextCustomer);
router.post("/:shopId/skip", authMiddleware, skipCustomer);
router.post("/:shopId/reset", resetTokens);

module.exports = router;
