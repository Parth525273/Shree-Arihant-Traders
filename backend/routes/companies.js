const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const { protect, admin } = require('../middleware/auth');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ isActive: true });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a company
// @route   POST /api/companies
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, logo, description } = req.body;

  try {
    const company = new Company({
      name,
      logo,
      description,
    });

    const createdCompany = await company.save();
    res.status(201).json(createdCompany);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a company
// @route   PUT /api/companies/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      company.name = req.body.name || company.name;
      company.logo = req.body.logo || company.logo;
      company.description = req.body.description || company.description;
      company.isActive = req.body.isActive ?? company.isActive;

      const updatedCompany = await company.save();
      res.json(updatedCompany);
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a company (Deactivate)
// @route   DELETE /api/companies/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (company) {
      company.isActive = false;
      await company.save();
      res.json({ message: 'Company deactivated' });
    } else {
      res.status(404).json({ message: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
