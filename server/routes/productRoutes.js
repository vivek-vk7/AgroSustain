const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    getMyProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, proposer } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/myproducts', protect, proposer, getMyProducts);
router.get('/:id', getProductById);

router.post('/', protect, proposer, createProduct);
router.put('/:id', protect, proposer, updateProduct);
router.delete('/:id', protect, proposer, deleteProduct);

module.exports = router;
