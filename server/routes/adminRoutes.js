const express = require('express');
const router = express.Router();
const { getUsers, updateProposerStatus, getPendingProducts, approveProduct } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all users (can filter pending proposers) - Admin only
router.get('/users', protect, admin, getUsers);

// Update proposer status - Admin only
router.put('/users/:id/status', protect, admin, updateProposerStatus);

// Product Approval Routes
router.get('/products', protect, admin, getPendingProducts);
router.put('/products/:id/approve', protect, admin, approveProduct);

// Education Approval Routes
const { getPendingEducation, approveEducation } = require('../controllers/adminController');
router.get('/education', protect, admin, getPendingEducation);
router.put('/education/:id/approve', protect, admin, approveEducation);

module.exports = router;
