// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// -------------------------
// Custom Error Classes
// -------------------------
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.statusCode = 400;
    }
}

// -------------------------
// Middleware
// -------------------------

// Logger Middleware
const logger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};
app.use(logger);

// Authentication Middleware
const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== 'my-secret-key') {
        return next(new Error('Unauthorized: Invalid API key'));
    }
    next();
};

// Validation Middleware for Product creation and update
const validateProduct = (req, res, next) => {
    // ...field checks...
    next();
};

// Global Error Handling Middleware
const errorHandler = (err, req, res, next) => {
    console.error(err);
    const status = err.statusCode || 500;
    res.status(status).json({
        error: {
            name: err.name,
            message: err.message
        }
    });
};
app.use(errorHandler);

// -------------------------
// In-Memory Products Database
// -------------------------
let products = [
    {
        id: '1',
        name: 'Laptop',
        description: 'High-performance laptop with 16GB RAM',
        price: 1200,
        category: 'electronics',
        inStock: true
    },
    {
        id: '2',
        name: 'Smartphone',
        description: 'Latest model with 128GB storage',
        price: 800,
        category: 'electronics',
        inStock: true
    },
    {
        id: '3',
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with timer',
        price: 50,
        category: 'kitchen',
        inStock: false
    }
];

// -------------------------
// Routes
// -------------------------

// Hello World / Welcome Route
app.get('/', (req, res) => {
    res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// GET /api/products - List all products with filtering, pagination, search
app.get('/api/products', (req, res, next) => {
    try {
        let filteredProducts = products;

        // Filtering by category
        if (req.query.category) {
            filteredProducts = filteredProducts.filter(p =>
                p.category.toLowerCase() === req.query.category.toLowerCase()
            );
        }

        // Search by name
        if (req.query.search) {
            filteredProducts = filteredProducts.filter(p =>
                p.name.toLowerCase().includes(req.query.search.toLowerCase())
            );
        }

        // Sort products by id in ascending order
        filteredProducts.sort((a, b) => a.id.localeCompare(b.id));

        // Apply pagination if page or limit query parameters are provided,
        // otherwise use the full sorted array.
        if (req.query.page || req.query.limit) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || filteredProducts.length;
            const startIndex = (page - 1) * limit;
            filteredProducts = filteredProducts.slice(startIndex, startIndex + limit);
        }

        // Remove curly braces from each product string
        const result = filteredProducts
            .map(product => JSON.stringify(product).slice(1, -1))
            .join(', ');
        res.setHeader('Content-Type', 'text/plain');
        res.send(result);
    } catch (error) {
        next(error);
    }
});

// GET /api/products/:id - Get a specific product by ID
app.get('/api/products/:id', (req, res, next) => {
    try {
        const product = products.find(p => p.id === req.params.id);
        if (!product) {
            throw new NotFoundError('Product not found');
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
});

// POST /api/products - Create a new product
app.post('/api/products', authenticate, validateProduct, (req, res, next) => {
    try {
        const newProduct = {
            id: uuidv4(),
            ...req.body
        };
        products.push(newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
});

// PUT /api/products/:id - Update an existing product
app.put('/api/products/:id', authenticate, validateProduct, (req, res, next) => {
    try {
        const index = products.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            throw new NotFoundError('Product not found');
        }
        products[index] = { id: products[index].id, ...req.body };
        res.json(products[index]);
    } catch (error) {
        next(error);
    }
});

// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', authenticate, (req, res, next) => {
    try {
        const index = products.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            throw new NotFoundError('Product not found');
        }
        const deletedProduct = products.splice(index, 1);
        res.json(deletedProduct[0]);
    } catch (error) {
        next(error);
    }
});

// GET /api/products/stats - Get product statistics (e.g., count by category)
app.get('/api/products/stats', (req, res, next) => {
    try {
        const stats = products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});
        res.json(stats);
    } catch (error) {
        next(error);
    }
});

// -------------------------
// Global Error Handler
// -------------------------
app.use(errorHandler);

// -------------------------
// Start the Server
// -------------------------
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app;

//# sourceMappingURL=server.js.map