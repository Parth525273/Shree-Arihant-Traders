const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a category name'],
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent same category name within a single company
categorySchema.index({ name: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
