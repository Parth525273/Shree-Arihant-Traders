const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    retailerId: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
          required: true,
        },
        productName: String,
        qty: {
          type: Number,
          required: true,
        },
        priceAtOrder: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'packed', 'dispatched', 'delivered'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'received'],
      default: 'pending',
    },
    paymentReceivedAt: Date,
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
