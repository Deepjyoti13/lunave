// ── Central error handler ─────────────────────────────────
// Must be registered LAST in Express (after all routes)

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let message    = err.message    || 'Internal Server Error'

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 404
    message    = `Resource not found — invalid ID: ${err.value}`
  }

  // Mongoose duplicate key (e.g. duplicate email / slug)
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]
    message    = `${field} already exists`
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400
    message    = Object.values(err.errors).map(e => e.message).join(', ')
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  { statusCode = 401; message = 'Invalid token' }
  if (err.name === 'TokenExpiredError')  { statusCode = 401; message = 'Token expired' }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

// ── 404 handler (no route matched) ───────────────────────
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.originalUrl}`)
  err.statusCode = 404
  next(err)
}

module.exports = { errorHandler, notFound }
