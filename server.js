require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const logger = require('./middleware/logger');
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./middleware/errorHandler');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());

// ✅ Logger
app.use(logger);

// ✅ Hello World route before auth
app.get('/', (req, res) => {
  res.send('Hello World');
});

// ✅ Auth (applies to protected routes only)
app.use(authMiddleware);

// ✅ API routes
app.use('/api/products', authMiddleware, productRoutes);

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/productsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

