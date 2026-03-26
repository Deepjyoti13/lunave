const router = require('express').Router()
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require('../controllers/wishlistController')
const { protect } = require('../middleware/auth')

// All wishlist routes require login
router.use(protect)

router.get(   '/',            getWishlist)         // GET    /api/wishlist
router.post(  '/',            addToWishlist)       // POST   /api/wishlist
router.delete('/:productId',  removeFromWishlist)  // DELETE /api/wishlist/:productId
router.delete('/',            clearWishlist)       // DELETE /api/wishlist

module.exports = router
