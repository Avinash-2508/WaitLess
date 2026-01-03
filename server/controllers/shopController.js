const { PrismaClient } = require("@prisma/client");
const { sanitizeInput } = require("../utils/validators");

const prisma = new PrismaClient();

/**
 * Create or update shop for authenticated owner
 * POST /shop
 * Body: { name, address, category }
 * Requires: Authentication middleware
 */
exports.createShop = async (req, res) => {
  try {
    const { name, address, category } = req.body;
    const ownerId = req.ownerId;

    // ============ INPUT VALIDATION ============

    if (!name || !address || !category) {
      return res.status(400).json({
        success: false,
        error: "Shop name, address, and category are required",
      });
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        error: "Shop name must be between 2 and 100 characters",
      });
    }

    if (address.trim().length < 5 || address.trim().length > 255) {
      return res.status(400).json({
        success: false,
        error: "Address must be between 5 and 255 characters",
      });
    }

    const validCategories = [
      "restaurant",
      "pharmacy",
      "bank",
      "hospital",
      "government",
      "retail",
      "other",
    ];
    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: `Category must be one of: ${validCategories.join(", ")}`,
      });
    }

    // ============ UPSERT SHOP ============

    const shop = await prisma.shop.upsert({
      where: { ownerId },
      update: {
        name: sanitizeInput(name),
        address: sanitizeInput(address),
        category: category.toLowerCase(),
      },
      create: {
        name: sanitizeInput(name),
        address: sanitizeInput(address),
        category: category.toLowerCase(),
        ownerId,
        avgServiceTime: 5,
        pauseState: false,
      },
      select: {
        id: true,
        name: true,
        address: true,
        category: true,
        currentToken: true,
        lastIssuedToken: true,
        avgServiceTime: true,
        pauseState: true,
      },
    });

    console.log(`✅ Shop created/updated: ${shop.id} for owner: ${ownerId}`);

    return res.status(201).json({
      success: true,
      message: "Shop saved successfully",
      data: { shop },
    });
  } catch (err) {
    console.error("❌ Create shop error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to create/update shop",
    });
  }
};

/**
 * Get shop by owner ID
 * GET /shop/owner/:ownerId
 */
exports.getShopByOwnerId = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        error: "Owner ID is required",
      });
    }

    const shop = await prisma.shop.findFirst({
      where: { ownerId },
      select: {
        id: true,
        name: true,
        address: true,
        category: true,
        currentToken: true,
        lastIssuedToken: true,
        dailyServed: true,
        avgServiceTime: true,
        pauseState: true,
      },
    });

    if (!shop) {
      return res.json({
        success: true,
        data: { shop: null },
      });
    }

    return res.json({
      success: true,
      data: { shop },
    });
  } catch (error) {
    console.error("❌ Get shop by owner error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch shop",
    });
  }
};

/**
 * Get shop by ID
 * GET /shop/:id
 */
exports.getShop = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Shop ID is required",
      });
    }

    const shop = await prisma.shop.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        category: true,
        currentToken: true,
        lastIssuedToken: true,
        dailyServed: true,
        avgServiceTime: true,
        pauseState: true,
        Owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    return res.json({
      success: true,
      data: { shop },
    });
  } catch (error) {
    console.error("❌ Get shop error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch shop",
    });
  }
};

/**
 * Delete shop (owner only)
 * DELETE /shop/:id
 * Requires: Authentication middleware
 */
exports.deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.ownerId;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Shop ID is required",
      });
    }

    // ============ PERMISSION CHECK ============

    const shop = await prisma.shop.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!shop) {
      return res.status(404).json({
        success: false,
        error: "Shop not found",
      });
    }

    if (shop.ownerId !== ownerId) {
      return res.status(403).json({
        success: false,
        error: "You do not have permission to delete this shop",
      });
    }

    // ============ DELETE RELATED DATA ============

    // Delete tokens
    await prisma.token.deleteMany({
      where: { shopId: id },
    });

    // Delete staff
    await prisma.staff.deleteMany({
      where: { shopId: id },
    });

    // Delete shop
    await prisma.shop.delete({
      where: { id },
    });

    console.log(`✅ Shop deleted: ${id}`);

    return res.json({
      success: true,
      message: "Shop deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete shop error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to delete shop",
    });
  }
};

/**
 * Get all shops (public endpoint for staff registration)
 * GET /shop/all
 */
exports.getAllShops = async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        address: true,
      },
      orderBy: { name: "asc" },
    });

    return res.json({
      success: true,
      data: shops,
    });
  } catch (error) {
    console.error("❌ Get all shops error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch shops",
    });
  }
};
