const Cart    = require('../models/Cart')
const Product = require('../models/Product')

// ── GET /api/cart ─────────────────────────────────────────
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name images basePrice stock isActive')

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] })
    }

    res.json({ success: true, cart })
  } catch (err) {
    next(err)
  }
}

// ── POST /api/cart ────────────────────────────────────────
// Add item or increase quantity if already in cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, volume } = req.body

    // Validate product exists and has stock
    const product = await Product.findById(productId)
    if (!product || !product.isActive)
      return res.status(404).json({ success: false, message: 'Product not found' })

    // Determine price — if volume option selected, use that price
    let price = product.basePrice
    if (volume && product.volumeOptions?.length) {
      const opt = product.volumeOptions.find(v => v.size === Number(volume))
      if (opt) price = opt.price
    }

    let cart = await Cart.findOne({ user: req.user._id })
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] })

    // Check if same product+volume already in cart
    const existingIdx = cart.items.findIndex(
      item =>
        item.product.toString() === productId &&
        item.volume === (volume ? Number(volume) : undefined)
    )

    if (existingIdx >= 0) {
      // Increase quantity (cap at 20)
      cart.items[existingIdx].quantity = Math.min(
        cart.items[existingIdx].quantity + Number(quantity),
        20
      )
    } else {
      // New line item
      cart.items.push({
        product:  productId,
        name:     product.name,
        image:    product.images[0]?.url || null,
        price,
        volume:   volume ? Number(volume) : undefined,
        quantity: Number(quantity),
      })
    }

    await cart.save()
    res.status(201).json({ success: true, cart })
  } catch (err) {
    next(err)
  }
}

// ── PUT /api/cart/:itemId ─────────────────────────────────
// Update quantity of a specific cart line
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body
    if (!quantity || quantity < 1)
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' })

    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart)
      return res.status(404).json({ success: false, message: 'Cart not found' })

    const item = cart.items.id(req.params.itemId)
    if (!item)
      return res.status(404).json({ success: false, message: 'Item not found in cart' })

    item.quantity = Math.min(Number(quantity), 20)
    await cart.save()

    res.json({ success: true, cart })
  } catch (err) {
    next(err)
  }
}

// ── DELETE /api/cart/:itemId ──────────────────────────────
// Remove one item from cart
const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (!cart)
      return res.status(404).json({ success: false, message: 'Cart not found' })

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    )
    await cart.save()

    res.json({ success: true, message: 'Item removed from cart', cart })
  } catch (err) {
    next(err)
  }
}

// ── DELETE /api/cart ──────────────────────────────────────
// Clear entire cart
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
    if (cart) {
      cart.items = []
      await cart.save()
    }
    res.json({ success: true, message: 'Cart cleared' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart }
