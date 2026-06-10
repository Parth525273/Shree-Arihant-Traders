// ─────────────────────────────────────────────────────────
// models/User.js — Retailer & Admin Schema
// ─────────────────────────────────────────────────────────

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },

    mobile: {
      type: String,
      trim: true,
      default: '',
    },

    // 'retailer' = customer who places orders
    // 'admin'    = shop owner (Shree Arihant Traders)
    role: {
      type: String,
      enum: ['retailer', 'admin'],
      default: 'retailer',
    },

    shopName: {
      type: String,
      trim: true,
      default: '',
    },

    address: {
      type: String,
      trim: true,
      default: '',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Password reset fields (used by forgot-password flow)
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Hash password before saving ──────────────────────────
// This runs every time a user is saved (create or update)
userSchema.pre('save', async function (next) {
  // Only hash if the password field was changed
  if (!this.isModified('password')) return next();

  // Salt rounds = 10 (good balance of security vs speed)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Compare password method ──────────────────────────────
// Used during login to check if entered password matches stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ─── Remove password from JSON output ─────────────────────
// So password hash is never accidentally sent to frontend
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
