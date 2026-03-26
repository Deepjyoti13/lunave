// require('dotenv').config()

// const express  = require('express')
// const cors     = require('cors')
// const morgan   = require('morgan')
// const path     = require('path')
// const connectDB = require('./config/db')

// const authRoutes    = require('./routes/authRoutes')
// const productRoutes = require('./routes/productRoutes')
// const cartRoutes    = require('./routes/cartRoutes')
// const orderRoutes   = require('./routes/orderRoutes')

// const { errorHandler, notFound } = require('./middleware/errorHandler')

// // ── Connect Database ──────────────────────────────────────
// connectDB()

// const app = express()

// // ── Core Middleware ───────────────────────────────────────
// app.use(cors({
//   origin:      process.env.CLIENT_URL || 'http://localhost:5173',
//   credentials: true,
// }))
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'))
// }

// // ── Serve uploaded images as static files ─────────────────
// // Accessible at: http://localhost:5001/uploads/filename.jpg
// app.use('/uploads', express.static('uploads'))
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// // ── Health check ──────────────────────────────────────────
// app.get('/api/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'LUNAVE API is running 🌙',
//     env:     process.env.NODE_ENV,
//     time:    new Date().toISOString(),
//   })
// })

// // ── API Routes ────────────────────────────────────────────
// app.use('/api/auth',     authRoutes)
// app.use('/api/products', productRoutes)
// app.use('/api/cart',     cartRoutes)
// app.use('/api/orders',   orderRoutes)

// // ── Error Handling ────────────────────────────────────────
// app.use(notFound)
// app.use(errorHandler)

// // ── Start Server ──────────────────────────────────────────
// const PORT = process.env.PORT || 5001
// app.listen(PORT, () => {
//   console.log(`\n🚀 LUNAVE Server running on http://localhost:${PORT}`)
//   console.log(`📦 Environment: ${process.env.NODE_ENV}`)
//   console.log(`🖼️  Uploads:     http://localhost:${PORT}/uploads/\n`)
// })

//.....................................................................................................//

require('dotenv').config()

const express   = require('express')
const cors      = require('cors')
const morgan    = require('morgan')
const connectDB = require('./config/db')

const authRoutes    = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const cartRoutes    = require('./routes/cartRoutes')
const orderRoutes   = require('./routes/orderRoutes')
const wishlistRoutes = require('./routes/wishlistRoutes')
const { errorHandler, notFound } = require('./middleware/errorHandler')

connectDB()

const app = express()

app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// NOTE: No more /uploads static folder needed — images are on Cloudinary CDN

app.get('/api/health', (req, res) => res.json({
  success: true,
  message: 'LUNAVE API is running',
  cloudinary: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`,
  env:  process.env.NODE_ENV,
  time: new Date().toISOString(),
}))

app.use('/api/auth',     authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart',     cartRoutes)
app.use('/api/orders',   orderRoutes)
app.use('/api/wishlist', wishlistRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5001
app.listen(PORT, () => {
  console.log(`\n🚀 LUNAVE Server running on http://localhost:${PORT}`)
  console.log(`☁️  Cloudinary: https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV}\n`)
})
