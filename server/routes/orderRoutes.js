const router = require('express').Router()
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  adminGetAllOrders,
  adminUpdateOrderStatus,
  adminMarkPaid,
  adminDeleteOrder,
  adminGetStats,
} = require('../controllers/orderController')
const { protect, adminOnly } = require('../middleware/auth')

// ── User routes (logged in) ───────────────────────────────
router.post( '/',               protect, placeOrder)      // POST   /api/orders
router.get(  '/my',             protect, getMyOrders)     // GET    /api/orders/my
router.get(  '/:id',            protect, getOrderById)    // GET    /api/orders/:id
router.put(  '/:id/cancel',     protect, cancelOrder)     // PUT    /api/orders/:id/cancel

// ── Admin routes ──────────────────────────────────────────
router.get(   '/admin/all',          protect, adminOnly, adminGetAllOrders)        // GET    /api/orders/admin/all
router.get(   '/admin/stats',        protect, adminOnly, adminGetStats)            // GET    /api/orders/admin/stats
router.put(   '/admin/:id/status',   protect, adminOnly, adminUpdateOrderStatus)   // PUT    /api/orders/admin/:id/status
router.put(   '/admin/:id/payment',  protect, adminOnly, adminMarkPaid)            // PUT    /api/orders/admin/:id/payment
router.delete('/admin/:id',          protect, adminOnly, adminDeleteOrder)         // DELETE /api/orders/admin/:id

module.exports = router
