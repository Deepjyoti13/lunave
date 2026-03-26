const Order   = require('../models/Order')
const Cart    = require('../models/Cart')
const Product = require('../models/Product')

// ─────────────────────────────────────────────────────────
//  USER ROUTES
// ─────────────────────────────────────────────────────────

// POST /api/orders  — place order from current cart
const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, couponCode } = req.body

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name images basePrice stock isActive')

    if (!cart || cart.items.length === 0)
      return res.status(400).json({ success: false, message: 'Cart is empty' })

    // Validate stock for all items
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive)
        return res.status(400).json({
          success: false,
          message: `Product "${item.name}" is no longer available`,
        })
      if (item.product.stock < item.quantity)
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.name}"`,
        })
    }

    // Build order items from cart
    const orderItems = cart.items.map(item => ({
      product:  item.product._id,
      name:     item.name,
      image:    item.image,
      price:    item.price,
      volume:   item.volume,
      quantity: item.quantity,
    }))

    const itemsTotal    = cart.subtotal
    const shippingPrice = itemsTotal >= 500 ? 0 : 50  // free shipping over ₹500
    const taxPrice      = +(itemsTotal * 0.18).toFixed(2)  // 18% GST
    const discount      = 0  // expand later with coupon logic
    const totalPrice    = +(itemsTotal + shippingPrice + taxPrice - discount).toFixed(2)

    const order = await Order.create({
      user:            req.user._id,
      items:           orderItems,
      shippingAddress,
      paymentMethod,
      couponCode,
      itemsTotal,
      shippingPrice,
      taxPrice,
      discount,
      totalPrice,
      orderStatus: 'Placed',
    })

    // Decrement stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      })
    }

    // Clear the cart after order placed
    cart.items = []
    await cart.save()

    res.status(201).json({ success: true, order })
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/my  — logged-in user's orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .select('-statusHistory')
      .sort('-createdAt')
    res.json({ success: true, count: orders.length, orders })
  } catch (err) {
    next(err)
  }
}

// GET /api/orders/:id  — get one order (must belong to user or admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' })

    // Only the owner or admin can view
    if (
      req.user.role !== 'admin' &&
      order.user._id.toString() !== req.user._id.toString()
    )
      return res.status(403).json({ success: false, message: 'Not authorised' })

    res.json({ success: true, order })
  } catch (err) {
    next(err)
  }
}

// PUT /api/orders/:id/cancel  — user can cancel if still Placed/Confirmed
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' })

    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorised' })

    if (!['Placed', 'Confirmed'].includes(order.orderStatus))
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.orderStatus}`,
      })

    order.orderStatus  = 'Cancelled'
    order.cancelReason = req.body.reason || 'Cancelled by customer'

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      })
    }

    await order.save()
    res.json({ success: true, order })
  } catch (err) {
    next(err)
  }
}

// ─────────────────────────────────────────────────────────
//  ADMIN ROUTES
// ─────────────────────────────────────────────────────────

// GET /api/admin/orders
const adminGetAllOrders = async (req, res, next) => {
  try {
    const {
      status,
      page  = 1,
      limit = 20,
      sort  = '-createdAt',
    } = req.query

    const filter = {}
    if (status) filter.orderStatus = status

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await Order.countDocuments(filter)

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .select('-statusHistory -items')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))

    res.json({ success: true, total, orders })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/orders/:id/status  — update order status
const adminUpdateOrderStatus = async (req, res, next) => {
  try {
    const { status, note, trackingId } = req.body

    const order = await Order.findById(req.params.id)
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' })

    order.orderStatus = status

    if (note)       order.statusHistory[order.statusHistory.length - 1].note = note
    if (trackingId) order.trackingId = trackingId

    if (status === 'Delivered') {
      order.isDelivered = true
      order.deliveredAt = Date.now()
    }

    await order.save()
    res.json({ success: true, order })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/orders/:id/payment  — mark as paid
const adminMarkPaid = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' })

    order.paymentStatus = 'Paid'
    order.paidAt        = Date.now()
    order.paymentResult = req.body.paymentResult || {}
    await order.save()

    res.json({ success: true, order })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/orders/:id  — hard delete (use carefully)
const adminDeleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order)
      return res.status(404).json({ success: false, message: 'Order not found' })
    res.json({ success: true, message: 'Order deleted' })
  } catch (err) {
    next(err)
  }
}

// GET /api/admin/stats  — dashboard summary
const adminGetStats = async (req, res, next) => {
  try {
    const [totalOrders, totalRevenue, pendingOrders, totalProducts] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
      Order.countDocuments({ orderStatus: { $in: ['Placed', 'Confirmed', 'Processing'] } }),
      Product.countDocuments({ isActive: true }),
    ])

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
        totalProducts,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  adminGetAllOrders,
  adminUpdateOrderStatus,
  adminMarkPaid,
  adminDeleteOrder,
  adminGetStats,
}
