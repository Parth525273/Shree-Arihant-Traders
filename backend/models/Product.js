const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    images: {
      type: [String],
      default: ['no-photo.jpg'],
    },
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Please add a base price'],
    },
    priceTiers: [
      {
        minQty: Number,
        price: Number,
      },
    ],
    minOrderQty: {
      type: Number,
      default: 1,
    },
    unit: {
      type: String, // e.g., 'Box', 'Kg', 'Dozen'
      required: [true, 'Please add a unit'],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
