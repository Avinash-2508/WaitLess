import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Register Owner
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if owner already exists
    const exists = await prisma.owner.findUnique({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create owner
    const owner = await prisma.owner.create({
      data: { name, email, password: hash },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    res.status(201).json({ message: "Registered successfully", owner });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login Owner
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find owner
    const owner = await prisma.owner.findUnique({ where: { email } });
    if (!owner) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Verify password
    const match = await bcrypt.compare(password, owner.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: owner.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ 
      token, 
      ownerId: owner.id,
      owner: {
        id: owner.id,
        name: owner.name,
        email: owner.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

