const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const EducationalContent = require('../models/EducationalContent');


const getUsers = asyncHandler(async (req, res) => {
    
    const status = req.query.status;
    let query = {};

    if (status) {
        query.proposerStatus = status;
        query.role = { $in: ['proposer', 'farmer', 'expert', 'user'] }; // Include 'user' for approval
    }

    const users = await User.find(query).select('-password');
    res.json(users);
});


const updateProposerStatus = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
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


const getPendingProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isApproved: false }).populate('user', 'name email');
    res.json(products);
});


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


const getPendingEducation = asyncHandler(async (req, res) => {
    const content = await EducationalContent.find({ isApproved: false }).populate('user', 'name');
    res.json(content);
});

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


const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json(categories);
});

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
