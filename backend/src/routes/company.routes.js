// ─────────────────────────────────────────────────────────
// routes/company.routes.js — Company / Agency Routes
//
// PUBLIC  GET  /api/companies          → List all active companies
// PUBLIC  GET  /api/companies/:id      → Get single company
// ADMIN   POST /api/companies          → Create company
// ADMIN   PUT  /api/companies/:id      → Update company
// ADMIN   DELETE /api/companies/:id    → Delete company
// ─────────────────────────────────────────────────────────

const express     = require('express');
const router      = express.Router();
const Company     = require('../models/Company');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/admin.middleware');
const { upload }  = require('../config/cloudinary');

// ─── GET /api/companies ───────────────────────────────────
// Public: Anyone can browse companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true }).sort({ name: 1 });
    res.json({ companies });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/companies/:id ───────────────────────────────
// Public: Get a single company by ID
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found.' });
    res.json({ company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /api/companies ──────────────────────────────────
// Admin only: Create a new company with optional logo upload
router.post('/', protect, adminOnly, upload.single('logo'), async (req, res) => {
  try {
    const { name, description } = req.body;
    const logo = req.file ? req.file.path : ''; // Cloudinary URL

    const company = await Company.create({ name, description, logo });
    res.status(201).json({ message: 'Company created!', company });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Company name already exists.' });
    }
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /api/companies/:id ───────────────────────────────
// Admin only: Update company details
router.put('/:id', protect, adminOnly, upload.single('logo'), async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    const updateData = { name, description, isActive };

    // Only update logo if a new one was uploaded
    if (req.file) updateData.logo = req.file.path;

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!company) return res.status(404).json({ message: 'Company not found.' });
    res.json({ message: 'Company updated!', company });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── DELETE /api/companies/:id ────────────────────────────
// Admin only: Delete a company
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: 'Company not found.' });
    res.json({ message: 'Company deleted.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
