const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
}, { timestamps: true });

// Unique name per company
categorySchema.index({ name: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
