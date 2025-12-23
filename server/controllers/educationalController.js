const asyncHandler = require('express-async-handler');
const EducationalContent = require('../models/EducationalContent');

// @desc    Fetch all approved educational content
// @route   GET /api/education
// @access  Public
const getEducationalContent = asyncHandler(async (req, res) => {
    const content = await EducationalContent.find({ isApproved: true }).populate('user', 'name');
    res.json(content);
});

// @desc    Fetch single educational content
// @route   GET /api/education/:id
// @access  Public
const getContentById = asyncHandler(async (req, res) => {
    const content = await EducationalContent.findById(req.params.id).populate('user', 'name');

    if (content) {
        res.json(content);
    } else {
        res.status(404);
        throw new Error('Content not found');
    }
});

// @desc    Create educational content
// @route   POST /api/education
// @access  Private/Proposer/Admin
const createContent = asyncHandler(async (req, res) => {
    const { title, content, resourceUrl, category } = req.body;

    const newContent = new EducationalContent({
        user: req.user._id,
        title,
        content,
        resourceUrl,
        category,
        isApproved: false, // Needs admin approval
    });

    const createdContent = await newContent.save();
    res.status(201).json(createdContent);
});

// @desc    Fetch my educational content
// @route   GET /api/education/mycontent
// @access  Private/Proposer
const getMyContent = asyncHandler(async (req, res) => {
    const content = await EducationalContent.find({ user: req.user._id });
    res.json(content);
});

// @desc    Delete educational content
// @route   DELETE /api/education/:id
// @access  Private/Proposer/Admin
const deleteContent = asyncHandler(async (req, res) => {
    const content = await EducationalContent.findById(req.params.id);

    if (content) {
        if (content.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
            await content.deleteOne();
            res.json({ message: 'Content removed' });
        } else {
            res.status(401);
            throw new Error('Not authorized to delete this content');
        }
    } else {
        res.status(404);
        throw new Error('Content not found');
    }
});

module.exports = {
    getEducationalContent,
    getContentById,
    createContent,
    getMyContent,
    deleteContent,
};
