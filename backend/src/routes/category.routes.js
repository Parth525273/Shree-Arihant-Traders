// ─────────────────────────────────────────────────────────
// routes/category.routes.js — Category Routes
//
// PUBLIC  GET  /api/categories?company=<id>  → Categories for a company
// PUBLIC  GET  /api/categories/:id           → Single category
// ADMIN   POST /api/categories               → Create category
// ADMIN   PUT  /api/categories/:id           → Update category
// ADMIN   DELETE /api/categories/:id         → Delete category
// ─────────────────────────────────────────────────────────

const express      = require('express');
const router       = express.Router();
const Category     = require('../models/Category');
const { protect }  = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');

// ─── GET /api/categories?company=<id> ────────────────────
// Public: Get categories (optionally filtered by company)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.company) filter.company = req.query.company;

    const categories = await Category.find(filter)
      .populate('company', 'name logo') // Include company name + logo
      .sort({ name: 1 });

    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/categories/:id ──────────────────────────────
// Public: Single category detail
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('company', 'name');
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /api/categories ─────────────────────────────────
// Admin only: Create a new category (must belong to a company)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, company, description } = req.body;
    const category = await Category.create({ name, company, description });
    await category.populate('company', 'name');
    res.status(201).json({ message: 'Category created!', category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category already exists for this company.' });
    }
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /api/categories/:id ──────────────────────────────
// Admin only: Update a category
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    ).populate('company', 'name');

    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ message: 'Category updated!', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── DELETE /api/categories/:id ───────────────────────────
// Admin only: Delete a category
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found.' });
    res.json({ message: 'Category deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
