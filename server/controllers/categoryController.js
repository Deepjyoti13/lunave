// server/controllers/categoryController.js
const Category = require('../models/Category')

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name')
    res.json({ success: true, categories })
  } catch (err) { next(err) }
}

const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true })
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' })
    res.json({ success: true, category })
  } catch (err) { next(err) }
}

module.exports = { getAllCategories, getCategoryBySlug }
