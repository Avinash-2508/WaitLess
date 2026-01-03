const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendSuccess, sendError } = require('../utils/response');

// Create a new counter for a shop
exports.createCounter = async (req, res) => {
  try {
    const { shopId, name, number } = req.body;

    if (!shopId || !name || number === undefined) {
      return sendError(res, 'Shop ID, counter name, and number are required', 400);
    }

    // Verify shop belongs to logged-in owner
    const shop = await prisma.shop.findUnique({
      where: { id: shopId, ownerId: req.ownerId },
    });

    if (!shop) {
      return sendError(res, 'Shop not found or unauthorized', 404);
    }

    // Check if counter number already exists for this shop
    const existingCounter = await prisma.counter.findUnique({
      where: {
        shopId_number: {
          shopId,
          number: parseInt(number),
        },
      },
    });

    if (existingCounter) {
      return sendError(res, 'Counter number already exists for this shop', 400);
    }

    const counter = await prisma.counter.create({
      data: {
        shopId,
        name,
        number: parseInt(number),
        isActive: true,
      },
    });

    sendSuccess(res, 'Counter created successfully', counter);
  } catch (error) {
    console.error('❌ Create counter error:', error);
    sendError(res, 'Failed to create counter', 500);
  }
};

// Get all counters for a shop
exports.getCountersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    if (!shopId) {
      return sendError(res, 'Shop ID is required', 400);
    }

    const counters = await prisma.counter.findMany({
      where: { shopId },
      orderBy: { number: 'asc' },
      include: {
        Staff: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    sendSuccess(res, 'Counters retrieved successfully', counters);
  } catch (error) {
    console.error('❌ Get counters error:', error);
    sendError(res, 'Failed to retrieve counters', 500);
  }
};

// Toggle counter active status
exports.toggleCounter = async (req, res) => {
  try {
    const { counterId } = req.params;
    const { isActive } = req.body;

    if (!counterId || isActive === undefined) {
      return sendError(res, 'Counter ID and active status are required', 400);
    }

    // Verify counter belongs to owner's shop
    const counter = await prisma.counter.findFirst({
      where: {
        id: counterId,
        Shop: { ownerId: req.ownerId },
      },
    });

    if (!counter) {
      return sendError(res, 'Counter not found or unauthorized', 404);
    }

    const updatedCounter = await prisma.counter.update({
      where: { id: counterId },
      data: { isActive },
    });

    sendSuccess(res, 'Counter status updated successfully', updatedCounter);
  } catch (error) {
    console.error('❌ Toggle counter error:', error);
    sendError(res, 'Failed to update counter status', 500);
  }
};

// Assign staff to counter
exports.assignStaffToCounter = async (req, res) => {
  try {
    const { staffId, counterId } = req.body;

    if (!staffId) {
      return sendError(res, 'Staff ID is required', 400);
    }

    // Verify staff exists and belongs to owner's shop
    const staff = await prisma.staff.findFirst({
      where: {
        id: staffId,
        Shop: { ownerId: req.ownerId },
      },
    });

    if (!staff) {
      return sendError(res, 'Staff not found or unauthorized', 404);
    }

    // If counterId is provided, verify it exists and belongs to same shop
    if (counterId) {
      const counter = await prisma.counter.findFirst({
        where: {
          id: counterId,
          shopId: staff.shopId,
        },
      });

      if (!counter) {
        return sendError(res, 'Counter not found or does not belong to same shop', 404);
      }
    }

    const updatedStaff = await prisma.staff.update({
      where: { id: staffId },
      data: { counterId: counterId || null },
    });

    sendSuccess(res, 'Staff assigned to counter successfully', updatedStaff);
  } catch (error) {
    console.error('❌ Assign staff error:', error);
    sendError(res, 'Failed to assign staff to counter', 500);
  }
};

// Delete counter
exports.deleteCounter = async (req, res) => {
  try {
    const { counterId } = req.params;

    if (!counterId) {
      return sendError(res, 'Counter ID is required', 400);
    }

    // Verify counter belongs to owner's shop
    const counter = await prisma.counter.findFirst({
      where: {
        id: counterId,
        Shop: { ownerId: req.ownerId },
      },
    });

    if (!counter) {
      return sendError(res, 'Counter not found or unauthorized', 404);
    }

    await prisma.counter.delete({
      where: { id: counterId },
    });

    sendSuccess(res, 'Counter deleted successfully', { id: counterId });
  } catch (error) {
    console.error('❌ Delete counter error:', error);
    sendError(res, 'Failed to delete counter', 500);
  }
};
