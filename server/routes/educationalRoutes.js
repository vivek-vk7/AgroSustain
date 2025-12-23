const express = require('express');
const router = express.Router();
const {
    getEducationalContent,
    getContentById,
    createContent,
    getMyContent,
    deleteContent,
} = require('../controllers/educationalController');
const { protect, proposer } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getEducationalContent);
router.get('/mycontent', protect, proposer, getMyContent);
router.get('/:id', getContentById);

// Protected routes
router.post('/', protect, proposer, createContent);
router.delete('/:id', protect, proposer, deleteContent);

module.exports = router;
