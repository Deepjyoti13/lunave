const jwt  = require('jsonwebtoken')
const User = require('../models/User')

// ── Protect: any logged-in user ───────────────────────────
const protect = async (req, res, next) => {
  try {
    let token

    // Accept token from Authorization header OR cookie
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorised — no token provided',
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user (without password) to request
    req.user = await User.findById(decoded.id).select('-password')

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists',
      })
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired',
    })
  }
}

// ── Admin only ────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied — admin only',
    })
  }
  next()
}

// ── Helper: sign JWT ──────────────────────────────────────
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

module.exports = { protect, adminOnly, signToken }
