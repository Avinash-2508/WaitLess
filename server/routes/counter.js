const express = require('express');
const router = express.Router();
const counterController = require('../controllers/counterController');
const authMiddleware = require('../middleware/authMiddleware');

// All counter routes require owner authentication
router.use(authMiddleware);

// Create a new counter
router.post('/create', counterController.createCounter);

// Get all counters for a shop
router.get('/by-shop/:shopId', counterController.getCountersByShop);

// Toggle counter active status
router.patch('/:counterId/toggle', counterController.toggleCounter);

// Assign staff to counter
router.patch('/assign-staff', counterController.assignStaffToCounter);

// Delete counter
router.delete('/:counterId', counterController.deleteCounter);

module.exports = router;
