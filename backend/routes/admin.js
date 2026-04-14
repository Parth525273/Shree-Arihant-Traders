const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all customers (retailers)
// @route   GET /api/admin/customers
// @access  Private/Admin
router.get('/customers', protect, admin, async (req, res) => {
  try {
    const customers = await User.find({ role: 'retailer' }).sort('-createdAt');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
