const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  retailerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: { type: String, required: true },
      qty: { type: Number, required: true },
      priceAtOrder: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'packed', 'dispatched', 'delivered'], 
    default: 'pending' 
  },
  paymentMode: { type: String, enum: ['cod', 'upi'], default: 'cod' },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'received'], 
    default: 'pending' 
  },
  paymentReceivedAt: { type: Date },
  notes: { type: String },
  whatsappSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
