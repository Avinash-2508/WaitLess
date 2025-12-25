import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get current queue status
router.get("/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      select: { id: true, name: true, currentToken: true }
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.json({ 
      shopId: shop.id,
      shopName: shop.name,
      currentToken: shop.currentToken 
    });
  } catch (error) {
    console.error("Get queue status error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Customer joins queue (no authentication required)
router.post("/:shopId/join", async (req, res) => {
  try {
    const { shopId } = req.params;

    // Find shop
    const shop = await prisma.shop.findUnique({
      where: { id: shopId }
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Increment token
    const newToken = shop.currentToken + 1;
    
    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: { currentToken: newToken },
      select: { id: true, name: true, currentToken: true }
    });

    res.json({ 
      message: "Token assigned",
      token: newToken,
      shopId: updatedShop.id,
      shopName: updatedShop.name
    });
  } catch (error) {
    console.error("Join queue error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Owner calls next customer (requires authentication)
router.post("/:shopId/next", auth, async (req, res) => {
  try {
    const { shopId } = req.params;

    // Find shop and verify ownership
    const shop = await prisma.shop.findUnique({
      where: { id: shopId }
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Verify the shop belongs to the authenticated owner
    if (shop.ownerId !== req.ownerId) {
      return res.status(403).json({ error: "Unauthorized: This shop does not belong to you" });
    }

    // Increment current token
    const updatedShop = await prisma.shop.update({
      where: { id: shopId },
      data: { currentToken: shop.currentToken + 1 },
      select: { id: true, name: true, currentToken: true }
    });

    res.json({ 
      message: "Next customer called",
      currentToken: updatedShop.currentToken,
      shopId: updatedShop.id
    });
  } catch (error) {
    console.error("Next customer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

