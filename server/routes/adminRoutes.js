const express = require('express');
const router = express.Router();
const { getUsers, updateProposerStatus, getPendingProducts, approveProduct } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);

router.put('/users/:id/status', protect, admin, updateProposerStatus);

router.get('/products', protect, admin, getPendingProducts);
router.put('/products/:id/approve', protect, admin, approveProduct);

const { getPendingEducation, approveEducation } = require('../controllers/adminController');
router.get('/education', protect, admin, getPendingEducation);
router.put('/education/:id/approve', protect, admin, approveEducation);

const { getPlatformStats, getCategories, addCategory, deleteCategory } = require('../controllers/adminController');
router.get('/stats', protect, admin, getPlatformStats);

router.route('/categories').get(protect, admin, getCategories).post(protect, admin, addCategory);
router.delete('/categories/:id', protect, admin, deleteCategory);

module.exports = router;
