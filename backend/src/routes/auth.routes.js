// ─────────────────────────────────────────────────────────
// routes/auth.routes.js — Authentication Routes
// POST /api/auth/register  — Create new retailer account
// POST /api/auth/login     — Login (retailer or admin)
// GET  /api/auth/me        — Get current logged-in user
// ─────────────────────────────────────────────────────────

const express    = require('express');
const router     = express.Router();
const jwt        = require('jsonwebtoken');
const User       = require('../models/User');
const { protect } = require('../middleware/auth.middleware');

// Helper: Generate JWT token for a user
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// ─── POST /api/auth/register ──────────────────────────────
// Create a new retailer account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile, shopName, address } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }

    // Create new user (password hashed automatically by User model)
    const user = await User.create({
      name, email, password, mobile, shopName, address,
      role: 'retailer', // Always retailer on self-registration
    });

    // Return user + token
    res.status(201).json({
      message: 'Account created successfully!',
      token: generateToken(user._id),
      user: user, // password removed by toJSON() in model
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────
// Login with email + password (works for both retailer and admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Find user by email (include password field for comparison)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated.' });
    }

    res.json({
      message: 'Login successful!',
      token: generateToken(user._id),
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────
// Get the currently logged-in user's profile
// Requires: Authorization: Bearer <token>
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
