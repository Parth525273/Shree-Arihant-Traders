const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Company = require('../models/Company');
const { protect, admin } = require('../middleware/auth');

// @desc    Get dashboard stats
// @route   GET /api/analytics/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCompanyCount = await Company.countDocuments({ isActive: true });
    const totalCustomerCount = await User.countDocuments({ role: 'retailer' });
    
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    // Get revenue by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      totalOrders,
      totalRevenue,
      totalCompanyCount,
      totalCustomerCount,
      dailyStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
