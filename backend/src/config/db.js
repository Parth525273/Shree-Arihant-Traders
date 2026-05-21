// ─────────────────────────────────────────────────────────
// config/db.js — MongoDB Atlas Connection
// ─────────────────────────────────────────────────────────

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB Atlas using the URI from .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit the process if DB connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
