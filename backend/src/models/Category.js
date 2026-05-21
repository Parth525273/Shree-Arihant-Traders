// ─────────────────────────────────────────────────────────
// models/Category.js — Product Category Schema
// Each company has its OWN categories (not shared)
// e.g., Kots > Snacks, Kots > Beverages
// ─────────────────────────────────────────────────────────

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },

    // Each category belongs to a specific company
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate category names within the same company
categorySchema.index({ name: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
