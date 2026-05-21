// ─────────────────────────────────────────────────────────
// models/Product.js — Product Schema with Bulk Pricing
// ─────────────────────────────────────────────────────────

const mongoose = require('mongoose');

// Sub-schema for pricing tiers
// Example: [{minQty: 1, price: 100}, {minQty: 10, price: 90}, {minQty: 50, price: 80}]
const pricingTierSchema = new mongoose.Schema(
  {
    minQty: {
      type: Number,
      required: true,
      min: [1, 'Minimum quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: false } // Don't create separate _id for each tier
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    // Which company this product belongs to (e.g., Kots)
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },

    // Which category this product belongs to (must match company)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },

    description: {
      type: String,
      trim: true,
      default: '',
    },

    // Cloudinary URL for product image
    image: {
      type: String,
      default: '',
    },

    // Unit of measurement (box, kg, carton, piece, pack, etc.)
    unit: {
      type: String,
      default: 'piece',
      trim: true,
    },

    // Minimum quantity a retailer must order
    minOrderQty: {
      type: Number,
      default: 1,
      min: [1, 'Minimum order quantity must be at least 1'],
    },

    // Bulk pricing tiers — sorted by minQty ascending
    // The highest minQty tier that the order quantity meets applies
    pricingTiers: {
      type: [pricingTierSchema],
      required: [true, 'At least one pricing tier is required'],
      validate: {
        validator: (tiers) => tiers.length > 0,
        message: 'At least one pricing tier is required',
      },
    },

    // Current stock count
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },

    // Admin can hide a product without deleting it
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster search by company and category
productSchema.index({ company: 1, category: 1 });
productSchema.index({ name: 'text', description: 'text' }); // For text search

module.exports = mongoose.model('Product', productSchema);
