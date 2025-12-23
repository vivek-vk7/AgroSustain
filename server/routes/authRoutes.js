const express = require('express');
const router = express.Router();
const { authUser, registerUser, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Route for User Registration
router.post('/register', registerUser);

// Route for User Login
router.post('/login', authUser);

// Route for User Profile (Protected)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;
