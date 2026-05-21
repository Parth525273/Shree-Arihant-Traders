// ─────────────────────────────────────────────────────────
// middleware/auth.middleware.js — JWT Verification
// Attaches req.user to all protected routes
// ─────────────────────────────────────────────────────────

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check for JWT in Authorization header: "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. Please log in.' });
  }

  try {
    // Verify the token using our JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the logged-in user to the request object
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({ message: 'User not found. Please log in again.' });
    }

    if (!req.user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
  }
};

module.exports = { protect };
