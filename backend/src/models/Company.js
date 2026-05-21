// ─────────────────────────────────────────────────────────
// models/Company.js — Food Company / Agency Schema
// e.g., Kots, Haldirams, etc.
// ─────────────────────────────────────────────────────────

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      unique: true,
      trim: true,
    },

    // Cloudinary URL for company logo
    logo: {
      type: String,
      default: '',
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    // Admin can deactivate a company without deleting it
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Company', companySchema);
