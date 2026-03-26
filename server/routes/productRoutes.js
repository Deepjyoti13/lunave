const router = require('express').Router()
const {
  getAllProducts, getProductById, getFeaturedProducts, getBestSellers,
  createProduct, updateProduct, deleteProduct, deleteProductImage,
  addReview, deleteReview, adminGetAllProducts,
} = require('../controllers/productController')
const { protect, adminOnly } = require('../middleware/auth')
const { uploadProductImages } = require('../middleware/upload')

// Public
router.get('/featured',    getFeaturedProducts)
router.get('/bestsellers', getBestSellers)
router.get('/',            getAllProducts)
router.get('/:id',         getProductById)

// Protected (logged-in users)
router.post(  '/:id/reviews',             protect, addReview)
router.delete('/:id/reviews/:reviewId',   protect, deleteReview)

// Admin
router.get(   '/admin/all',               protect, adminOnly, adminGetAllProducts)
router.post(  '/',                        protect, adminOnly, uploadProductImages, createProduct)
router.put(   '/:id',                     protect, adminOnly, uploadProductImages, updateProduct)
router.delete('/:id',                     protect, adminOnly, deleteProduct)
// publicId is URL-encoded because it contains slashes e.g. lunave/products/bottle-123
router.delete('/:id/images/:publicId(*)', protect, adminOnly, deleteProductImage)

module.exports = router
