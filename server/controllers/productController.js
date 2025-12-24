const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const getProducts = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i',
        },
    } : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const location = req.query.location ? {
        location: {
            $regex: req.query.location,
            $options: 'i',
        }
    } : {};

    const products = await Product.find({ ...keyword, ...category, ...location });
    res.json(products);
});

const getMyProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user._id });
    res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

const createProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, category, location, countInStock } = req.body;

    const product = new Product({
        name,
        price,
        user: req.user._id,
        image,
        category,
        location,
        countInStock,
        numReviews: 0,
        description,
        isApproved: false,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        if (product.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
            await product.deleteOne();
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

const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, category, location, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        if (product.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
            product.name = name;
            product.price = price;
            product.description = description;
            product.image = image;
            product.category = category;
            product.location = location;
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
