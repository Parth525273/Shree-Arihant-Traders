// ─────────────────────────────────────────────────────────
// routes/order.routes.js — Order Routes
// POST /api/orders        → Place new order (retailer)
// GET  /api/orders/my     → My order history (retailer)
// GET  /api/orders/:id    → Single order detail
// ─────────────────────────────────────────────────────────

const express     = require('express');
const router      = express.Router();
const Order       = require('../models/Order');
const Product     = require('../models/Product');
const { protect } = require('../middleware/auth.middleware');
const { generateWhatsAppLink } = require('../utils/whatsapp');

// POST /api/orders — Place a new order
router.post('/', protect, async (req, res) => {
  try {
    const { items, paymentMode, notes } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must have at least one item.' });
    }

    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product).populate('company', 'name');
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
      if (!product.isActive) return res.status(400).json({ message: `"${product.name}" is unavailable.` });
      if (item.quantity < product.minOrderQty) {
        return res.status(400).json({
          message: `Min order for "${product.name}" is ${product.minOrderQty} ${product.unit}.`,
        });
      }

      // Find applicable pricing tier (highest minQty the order qualifies for)
      const sortedTiers = [...product.pricingTiers].sort((a, b) => b.minQty - a.minQty);
      const tier  = sortedTiers.find((t) => item.quantity >= t.minQty);
      const price = tier ? tier.price : product.pricingTiers[0].price;

      totalAmount += price * item.quantity;
      resolvedItems.push({
        product: product._id,
        productName: product.name,
        companyName: product.company.name,
        quantity: item.quantity,
        priceAtOrder: price,
        unit: product.unit,
      });
    }

    const order = await Order.create({
      customer: req.user._id,
      items: resolvedItems,
      totalAmount,
      paymentMode: paymentMode || 'cod',
      notes: notes || '',
    });

    const whatsappLink = generateWhatsAppLink(order, req.user);
    res.status(201).json({ message: 'Order placed!', order, whatsappLink });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/my — Retailer's own order history
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/orders/:id — Single order (retailer sees own, admin sees any)
router.get('/:id', protect, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') filter.customer = req.user._id;

    const order = await Order.findOne(filter).populate('customer', 'name email mobile shopName');
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
