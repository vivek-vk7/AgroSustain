const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const EducationalContent = require('../models/EducationalContent');

// @desc    Get all users (or filter by role/status)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    // Optional: Filter by 'proposerStatus' if query param exists
    // ?status=pending
    const status = req.query.status;
    let query = {};

    if (status) {
        query.proposerStatus = status;
        query.role = { $in: ['proposer', 'farmer', 'expert', 'user'] }; // Include 'user' for approval
    }

    const users = await User.find(query).select('-password');
    res.json(users);
});

// @desc    Update user proposer status (Approve/Reject)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateProposerStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        // Validate valid status
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            res.status(400);
            throw new Error('Invalid status');
        }

        user.proposerStatus = status;
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            proposerStatus: updatedUser.proposerStatus,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get all pending products
// @route   GET /api/admin/products
// @access  Private/Admin
const getPendingProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isApproved: false }).populate('user', 'name email');
    res.json(products);
});

// @desc    Approve/Reject a product
// @route   PUT /api/admin/products/:id/approve
// @access  Private/Admin
const approveProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        const { isApproved } = req.body;
        product.isApproved = isApproved;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Get all pending educational content
// @route   GET /api/admin/education
// @access  Private/Admin
const getPendingEducation = asyncHandler(async (req, res) => {
    const content = await EducationalContent.find({ isApproved: false }).populate('user', 'name');
    res.json(content);
});

// @desc    Approve/Reject educational content
// @route   PUT /api/admin/education/:id/approve
// @access  Private/Admin
const approveEducation = asyncHandler(async (req, res) => {
    const content = await EducationalContent.findById(req.params.id);

    if (content) {
        const { isApproved } = req.body;
        content.isApproved = isApproved;

        const updatedContent = await content.save();
        res.json(updatedContent);
    } else {
        res.status(404);
        throw new Error('Content not found');
    }
});

const Order = require('../models/Order');
const Category = require('../models/Category');

// ... existing imports ...

// @desc    Get platform stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getPlatformStats = asyncHandler(async (req, res) => {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const educationCount = await EducationalContent.countDocuments();

    res.json({
        users: usersCount,
        products: productsCount,
        orders: ordersCount,
        education: educationCount,
    });
});

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private/Admin
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});

// @desc    Add a category
// @route   POST /api/admin/categories
// @access  Private/Admin
const addCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
        res.status(400);
        throw new Error('Category already exists');
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
});

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (category) {
        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } else {
        res.status(404);
        throw new Error('Category not found');
    }
});

module.exports = {
    getUsers,
    updateProposerStatus,
    getPendingProducts,
    approveProduct,
    getPendingEducation,
    approveEducation,
    getPlatformStats,
    getCategories,
    addCategory,
    deleteCategory,
};
