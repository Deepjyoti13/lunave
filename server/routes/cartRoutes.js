const router = require('express').Router()
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cartController')
const { protect } = require('../middleware/auth')

// All cart routes require login
router.use(protect)

router.get(   '/',         getCart)        // GET    /api/cart
router.post(  '/',         addToCart)      // POST   /api/cart
router.put(   '/:itemId',  updateCartItem) // PUT    /api/cart/:itemId
router.delete('/:itemId',  removeCartItem) // DELETE /api/cart/:itemId
router.delete('/',         clearCart)      // DELETE /api/cart  (clear all)

module.exports = router
