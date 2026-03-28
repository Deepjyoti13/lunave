// server/routes/categoryRoutes.js
const express    = require('express')
const router     = express.Router()
const { getAllCategories, getCategoryBySlug } = require('../controllers/categoryController')

router.get('/',      getAllCategories)
router.get('/:slug', getCategoryBySlug)

module.exports = router
