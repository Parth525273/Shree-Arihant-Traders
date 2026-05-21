// ─────────────────────────────────────────────────────────
// middleware/admin.middleware.js — Admin Role Check
// Used AFTER protect middleware to ensure user is admin
// ─────────────────────────────────────────────────────────

const adminOnly = (req, res, next) => {
  // req.user is set by the protect middleware
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

module.exports = { adminOnly };
