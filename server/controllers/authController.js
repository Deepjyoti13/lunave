const User      = require('../models/User')
const { signToken } = require('../middleware/auth')

// ── Helper: send token response ───────────────────────────
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
  })
}

// ── POST /api/auth/register ───────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    // Prevent self-promoting to admin unless first user or via env secret
    const safeRole = role === 'admin' &&
      req.headers['x-admin-secret'] === process.env.ADMIN_SECRET
        ? 'admin'
        : 'customer'

    const user = await User.create({ name, email, password, role: safeRole })
    sendToken(user, 201, res)
  } catch (err) {
    next(err)
  }
}

// ── POST /api/auth/login ──────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' })

    // Include password for comparison (select: false in schema)
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' })

    sendToken(user, 200, res)
  } catch (err) {
    next(err)
  }
}

// ── GET /api/auth/me ──────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

// ── PUT /api/auth/me ──────────────────────────────────────
const updateMe = async (req, res, next) => {
  try {
    const { name, phone, addresses } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, addresses },
      { new: true, runValidators: true }
    )
    res.json({ success: true, user })
  } catch (err) {
    next(err)
  }
}

// ── PUT /api/auth/change-password ─────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id).select('+password')

    if (!(await user.matchPassword(currentPassword)))
      return res.status(401).json({ success: false, message: 'Current password is wrong' })

    user.password = newPassword
    await user.save()
    sendToken(user, 200, res)
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, getMe, updateMe, changePassword }
