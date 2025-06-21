const { v4: uuidv4 } = require('uuid');
let products = [
  {
    id: '1',
    name: 'Sample Product',
    category: 'Books',
    price: 19.99
  }
];

// GET /api/products
exports.getAllProducts = (req, res) => {
  res.json(products);
};

// GET /api/products/:id
exports.getProductById = (req, res, next) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
};

// POST /api/products
exports.createProduct = (req, res) => {
  const { name, category, price } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newProduct = { id: uuidv4(), name, category, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

// PUT /api/products/:id
exports.updateProduct = (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  const { name, category, price } = req.body;
  if (name !== undefined) products[index].name = name;
  if (category !== undefined) products[index].category = category;
  if (price !== undefined) products[index].price = price;

  res.json(products[index]);
};

// DELETE /api/products/:id
exports.deleteProduct = (req, res, next) => {
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Product not found' });

  const deleted = products.splice(index, 1);
  res.json({ message: 'Product deleted', product: deleted[0] });
};

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getStats
} = require('../controllers/productsController');
