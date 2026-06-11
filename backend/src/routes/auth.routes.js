// ─────────────────────────────────────────────────────────
// routes/auth.routes.js — Authentication Routes
// POST /api/auth/register          — Create new retailer account
// POST /api/auth/login             — Login (retailer or admin)
// GET  /api/auth/me                — Get current logged-in user
// POST /api/auth/forgot-password   — Request password reset link
// POST /api/auth/reset-password/:token — Reset password with token
// ─────────────────────────────────────────────────────────

const express    = require('express');
const router     = express.Router();
const jwt        = require('jsonwebtoken');
const crypto     = require('crypto');
const User       = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const { sendPasswordResetEmail } = require('../utils/email');

// Helper: Generate JWT token for a user
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// ─── POST /api/auth/register ──────────────────────────────
// Create a new retailer account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile, shopName, address } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }

    // Create new user (password hashed automatically by User model)
    const user = await User.create({
      name, email, password, mobile, shopName, address,
      role: 'retailer', // Always retailer on self-registration
    });

    // Return user + token
    res.status(201).json({
      message: 'Account created successfully!',
      token: generateToken(user._id),
      user: user, // password removed by toJSON() in model
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────
// Login with email + password (works for both retailer and admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Find user by email (include password field for comparison)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated.' });
    }

    res.json({
      message: 'Login successful!',
      token: generateToken(user._id),
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────
// Get the currently logged-in user's profile
// Requires: Authorization: Bearer <token>
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// ─── POST /api/auth/forgot-password ───────────────────────
// User enters email → backend sends a reset link to their email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide your email address.' });
    }

    // Find the user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Always return success — don't reveal if email exists (security)
      return res.json({
        message: 'If this email is registered, you will receive a reset link shortly.',
      });
    }

    // Generate a random 32-byte token
    const rawToken = crypto.randomBytes(32).toString('hex');

    // Hash the token before storing in DB
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    // Save hashed token + expiry to user (expires in 1 hour)
    user.passwordResetToken   = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save({ validateBeforeSave: false });

    // Build the reset URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/auth/reset-password/${rawToken}`;

    // Send the email
    await sendPasswordResetEmail(user.email, user.name, resetUrl);

    res.json({
      message: 'Password reset link sent to your email! Check your inbox (and spam folder).',
    });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    // If email sending fails, clear the token so user can try again
    if (error.message && error.message.includes('EAUTH')) {
      return res.status(500).json({
        message: 'Email service not configured. Please contact the admin.',
      });
    }
    res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
  }
});

// ─── POST /api/auth/reset-password/:token ─────────────────
// Step 2: User clicks reset link → enters new password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide new password and confirm it.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    // Find user with this token that hasn't expired
    const user = await User.findOne({
      passwordResetToken:   hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Token must not be expired
    });

    if (!user) {
      return res.status(400).json({
        message: 'Reset link is invalid or has expired. Please request a new one.',
      });
    }

    // Update password (will be hashed by pre-save hook in User model)
    user.password             = password;
    user.passwordResetToken   = null;  // Clear the token (one-time use)
    user.passwordResetExpires = null;
    await user.save();

    res.json({
      message: 'Password reset successful! You can now login with your new password.',
      token: generateToken(user._id), // Auto-login after reset
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /api/auth/profile ────────────────────────────────
// Update logged-in user's profile info
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, mobile, shopName, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, mobile, shopName, address },
      { new: true, runValidators: true }
    );
    res.json({ message: 'Profile updated successfully!', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─── PUT /api/auth/change-password ────────────────────────
// Change password (requires current password)
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
