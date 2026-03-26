const Wishlist = require('../models/Wishlist')
const Product  = require('../models/Product')

// ── GET /api/wishlist ──────────────────────────────────────────────────────
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] })
    }
    res.json({ success: true, wishlist })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/wishlist ─────────────────────────────────────────────────────
// Body: { productId }
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body

    if (!productId)
      return res.status(400).json({ success: false, message: 'productId is required' })

    const product = await Product.findById(productId)
    if (!product || !product.isActive)
      return res.status(404).json({ success: false, message: 'Product not found' })

    let wishlist = await Wishlist.findOne({ user: req.user._id })
    if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, items: [] })

    // Idempotent — skip if already in wishlist
    const alreadyIn = wishlist.items.some(
      item => item.product.toString() === productId
    )
    if (!alreadyIn) {
      wishlist.items.push({
        product: productId,
        name:    product.name,
        image:   product.images?.[0]?.url || null,
        price:   product.basePrice,
      })
      await wishlist.save()
      return res.status(201).json({ success: true, wishlist })
    }

    res.json({ success: true, wishlist })
  } catch (err) {
    next(err)
  }
}

// ── DELETE /api/wishlist/:productId ───────────────────────────────────────
const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
    if (!wishlist)
      return res.status(404).json({ success: false, message: 'Wishlist not found' })

    const originalLength = wishlist.items.length
    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== req.params.productId
    )
    if (wishlist.items.length < originalLength) {
      await wishlist.save()
    }

    res.json({ success: true, wishlist })
  } catch (err) {
    next(err)
  }
}

// ── DELETE /api/wishlist ───────────────────────────────────────────────────
const clearWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id })
    if (wishlist) {
      wishlist.items = []
      await wishlist.save()
    }
    res.json({ success: true, message: 'Wishlist cleared' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getWishlist, addToWishlist, removeFromWishlist, clearWishlist }
