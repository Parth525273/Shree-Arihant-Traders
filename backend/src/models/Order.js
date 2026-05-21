// ─────────────────────────────────────────────────────────
// models/Order.js — Order Schema
// ─────────────────────────────────────────────────────────

const mongoose = require('mongoose');

// Sub-schema for each item in the order
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    // We snapshot the name at order time so it doesn't change
    // even if admin edits the product later
    productName: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },

    // Price locked at the time of ordering (from pricing tier)
    priceAtOrder: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      default: 'piece',
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Auto-generated order number: SAT-2024-0001
    orderNumber: {
      type: String,
      unique: true,
    },

    // The retailer who placed the order
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },

    // All items in this order
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must have at least one item'],
      validate: {
        validator: (items) => items.length > 0,
        message: 'Order must have at least one item',
      },
    },

    // Total amount = sum of (qty × priceAtOrder) for all items
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },

    // Order fulfilment status (admin updates this)
    status: {
      type: String,
      enum: ['pending', 'packed', 'dispatched', 'delivered'],
      default: 'pending',
    },

    // Payment status (admin ticks when money is received)
    paymentStatus: {
      type: String,
      enum: ['pending', 'received'],
      default: 'pending',
    },

    // Payment method chosen by retailer
    paymentMode: {
      type: String,
      enum: ['cod', 'upi'],
      default: 'cod',
    },

    // Optional note from retailer
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true, // createdAt = order date, updatedAt = last status change
  }
);

// ─── Auto-generate Order Number ───────────────────────────
// Runs before saving a new order
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    // Count existing orders to generate sequential number
    const count = await mongoose.model('Order').countDocuments();
    const year  = new Date().getFullYear();
    const num   = String(count + 1).padStart(4, '0'); // e.g., 0001
    this.orderNumber = `SAT-${year}-${num}`;           // e.g., SAT-2024-0001
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
