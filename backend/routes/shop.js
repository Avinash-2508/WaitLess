import express from "express";
import { PrismaClient } from "@prisma/client";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Create Shop
router.post("/create", auth, async (req, res) => {
  try {
    const { name, address, category } = req.body;

    // Validate input
    if (!name || !address || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if shop already exists for this owner
    const existingShop = await prisma.shop.findUnique({
      where: { ownerId: req.ownerId }
    });

    if (existingShop) {
      return res.status(400).json({ error: "Shop already exists for this owner" });
    }

    // Create shop
    const shop = await prisma.shop.create({
      data: { name, address, category, ownerId: req.ownerId },
    });

    res.status(201).json({ message: "Shop created", shop });
  } catch (error) {
    console.error("Create shop error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Shop Details
router.get("/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
      include: {
        Owner: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.json({ shop });
  } catch (error) {
    console.error("Get shop error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Owner's Shop
router.get("/owner/my-shop", auth, async (req, res) => {
  try {
    const shop = await prisma.shop.findUnique({
      where: { ownerId: req.ownerId },
      include: {
        Owner: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    res.json({ shop });
  } catch (error) {
    console.error("Get owner shop error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

