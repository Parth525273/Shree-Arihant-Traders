// ─────────────────────────────────────────────────────────
// routes/product.routes.js — Product Routes
//
// PUBLIC  GET  /api/products                   → List products (with filters)
// PUBLIC  GET  /api/products/:id               → Single product detail
// ADMIN   POST /api/products                   → Create product
// ADMIN   PUT  /api/products/:id               → Update product
// ADMIN   DELETE /api/products/:id             → Delete product
// ADMIN   PATCH /api/products/:id/stock        → Update stock
// ─────────────────────────────────────────────────────────

const express      = require('express');
const router       = express.Router();
const Product      = require('../models/Product');
const { protect }  = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');
const { upload }   = require('../config/cloudinary');

// ─── GET /api/products ────────────────────────────────────
// Public: List products with optional filters
// Query params: company, category, search, page, limit
router.get('/', async (req, res) => {
  try {
    const { company, category, search, page = 1, limit = 20 } = req.query;

    // Build filter object
    const filter = { isActive: true };
    if (company)  filter.company  = company;
    if (category) filter.category = category;

    // Text search (searches name and description)
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('company', 'name logo')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/products/:id ────────────────────────────────
// Public: Get a single product with full details
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('company', 'name logo description')
      .populate('category', 'name');

    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /api/products ───────────────────────────────────
// Admin only: Create a new product with image upload
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, company, category, description, unit, minOrderQty, pricingTiers, stock } = req.body;
    const image = req.file ? req.file.path : '';

    // pricingTiers comes as JSON string from multipart form
    const tiers = typeof pricingTiers === 'string' ? JSON.parse(pricingTiers) : pricingTiers;

    const product = await Product.create({
      name, company, category, description, unit, minOrderQty,
      pricingTiers: tiers, stock, image,
    });

    await product.populate('company', 'name');
    await product.populate('category', 'name');

    res.status(201).json({ message: 'Product created!', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /api/products/:id ────────────────────────────────
// Admin only: Update a product
router.put('/:id', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, company, category, description, unit, minOrderQty, pricingTiers, stock, isActive } = req.body;

    const updateData = { name, company, category, description, unit, minOrderQty, stock, isActive };

    // Parse pricing tiers if sent as string
    if (pricingTiers) {
      updateData.pricingTiers = typeof pricingTiers === 'string' ? JSON.parse(pricingTiers) : pricingTiers;
    }

    // Update image only if new one uploaded
    if (req.file) updateData.image = req.file.path;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('company', 'name').populate('category', 'name');

    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product updated!', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── DELETE /api/products/:id ─────────────────────────────
// Admin only: Delete a product
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PATCH /api/products/:id/stock ───────────────────────
// Admin only: Update stock quantity
router.patch('/:id/stock', protect, adminOnly, async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Stock updated!', product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
