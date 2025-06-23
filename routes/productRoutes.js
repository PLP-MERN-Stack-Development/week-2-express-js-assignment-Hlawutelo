const express = require('express');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productsController');
const validateProduct = require('../middleware/validateProduct');
const authMiddleware = require('../middleware/authMiddleware');
const Product = require('../models/Product'); // Ensure the Product model is required

const router = express.Router();

// Public routes (e.g., GET)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Apply authMiddleware only to protected routes (e.g., POST, PUT, DELETE)
router.post('/', authMiddleware, validateProduct, createProduct);

// Update a product by MongoDB _id
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update by custom ID field (not MongoDB _id)
router.put('/by-id/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
