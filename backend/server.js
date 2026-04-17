const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const { protect } = require('./middleware/auth');

// Load environment variables
dotenv.config();

const app = express();

// Global Logger (Move to top)
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Direct route for session verification (Express 5 compatibility)
app.get('/api/auth/me', protect, (req, res) => {
  res.json(req.user);
});

// Routes
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/companies', require('./routes/companies.js'));
app.use('/api/categories', require('./routes/categories.js'));
app.use('/api/products', require('./routes/products.js'));
app.use('/api/orders', require('./routes/orders.js'));
app.use('/api/analytics', require('./routes/analytics.js'));
app.use('/api/admin', require('./routes/admin.js'));

// Basic Route
app.get('/', (req, res) => {
  res.send('Shree Arihant Traders API is running...');
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
