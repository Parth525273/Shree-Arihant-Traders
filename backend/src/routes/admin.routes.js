// ─────────────────────────────────────────────────────────
// routes/admin.routes.js — Admin-Only Routes
//
// GET   /api/admin/orders              → All orders
// PATCH /api/admin/orders/:id/status   → Update order status
// PATCH /api/admin/orders/:id/payment  → Mark payment received
// GET   /api/admin/customers           → All retailers
// GET   /api/admin/dashboard           → Stats summary
// ─────────────────────────────────────────────────────────

const express      = require('express');
const router       = express.Router();
const Order        = require('../models/Order');
const User         = require('../models/User');
const Product      = require('../models/Product');
const { protect }  = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

// All admin routes require login + admin role
router.use(protect, adminOnly);

// GET /api/admin/dashboard — Sales summary stats
router.get('/dashboard', async (req, res) => {
  try {
    const [totalOrders, pendingOrders, totalRevenue, pendingPayments, totalCustomers, totalProducts] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ status: 'pending' }),
        Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
        Order.countDocuments({ paymentStatus: 'pending' }),
        User.countDocuments({ role: 'retailer' }),
        Product.countDocuments({ isActive: true }),
      ]);

    res.json({
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingPayments,
      totalCustomers,
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/orders — All orders (newest first)
router.get('/orders', async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status)        filter.status        = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('customer', 'name email mobile shopName address')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/admin/orders/:id/status — Update order fulfilment status
router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'packed', 'dispatched', 'delivered'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Use: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('customer', 'name shopName');

    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: `Order status updated to "${status}"`, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PATCH /api/admin/orders/:id/payment — Mark payment as received
router.patch('/orders/:id/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body; // 'pending' or 'received'
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentStatus },
      { new: true }
    ).populate('customer', 'name shopName');

    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: `Payment marked as "${paymentStatus}"`, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/admin/customers — List all retailers
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'retailer' }).sort({ createdAt: -1 });
    res.json({ customers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
