// ─────────────────────────────────────────────────────────
// scripts/seed-admin.js — Create Admin Account (Run Once)
//
// Usage: node scripts/seed-admin.js
//
// This creates the admin account for Shree Arihant Traders.
// Run this ONCE after setting up the database.
// ─────────────────────────────────────────────────────────

const mongoose = require('mongoose');
const dotenv   = require('dotenv');
const path     = require('path');

// Load .env from backend folder
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../src/models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ email: 'tradersshreearihant@gmail.com' });
    if (existing) {
      console.log('⚠️  Admin already exists:', existing.email);
      console.log('   Role:', existing.role);
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name:     'Shree Arihant Traders',
      email:    'tradersshreearihant@gmail.com',
      password: 'Admin@1234',          // ← CHANGE THIS after first login!
      mobile:   '9403153875',
      role:     'admin',
      shopName: 'Shree Arihant Traders',
      address:  'Your shop address here',
    });

    console.log('\n✅ Admin account created successfully!');
    console.log('─────────────────────────────────────');
    console.log('  Email   :', admin.email);
    console.log('  Password: Admin@1234');
    console.log('  Role    :', admin.role);
    console.log('─────────────────────────────────────');
    console.log('⚠️  IMPORTANT: Change the password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
