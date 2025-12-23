const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    // Basic search functionality
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const products = await Product.find({ ...keyword });
    res.json(products);
});

// @desc    Fetch products by user
// @route   GET /api/products/myproducts
// @access  Private/Proposer
const getMyProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user._id });
    res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Proposer/Admin
const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, category, countInStock } = req.body;

    const product = new Product({
        name,
        price,
        user: req.user._id,
        image,
        category,
        countInStock,
        numReviews: 0,
        description,
        isApproved: false, // Default to not approved
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Proposer/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        // Ensure user owns the product or is admin
        if (product.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
            await product.deleteOne(); // or product.remove() in older mongoose
            res.json({ message: 'Product removed' });
        } else {
            res.status(401);
            throw new Error('Not authorized to delete this product');
        }
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Proposer/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        if (product.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.category = category;
            product.countInStock = countInStock;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(401);
            throw new Error('Not authorized to update this product');
        }
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    getMyProducts,
    createProduct,
    deleteProduct,
    updateProduct,
};
