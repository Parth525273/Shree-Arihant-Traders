const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  images: [{ type: String }],
  description: { type: String },
  basePrice: { type: Number, required: true },
  priceTiers: [
    {
      minQty: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  minOrderQty: { type: Number, default: 1 },
  unit: { type: String, required: true }, // e.g., "box", "kg"
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
