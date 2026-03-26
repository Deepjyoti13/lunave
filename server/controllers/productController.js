const Product        = require('../models/Product')
const { cloudinary } = require('../middleware/upload')

// ── Extract public_id from a Cloudinary URL ───────────────
// https://res.cloudinary.com/douyghp5d/image/upload/v123/lunave/products/bottle-123.jpg
//  → lunave/products/bottle-123
const getPublicId = (url) => {
  if (!url) return null
  try {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)$/)
    if (!match) return null
    return match[1].replace(/\.[^/.]+$/, '')   // strip extension
  } catch { return null }
}

const destroyAsset = async (url, resourceType = 'image') => {
  const pid = getPublicId(url)
  if (!pid) return
  try {
    await cloudinary.uploader.destroy(pid, { resource_type: resourceType })
  } catch (e) {
    console.error(`Cloudinary delete failed [${pid}]:`, e.message)
  }
}

// ─────────────────────────────────────────────────────────
//  PUBLIC
// ─────────────────────────────────────────────────────────

const getAllProducts = async (req, res, next) => {
  try {
    const {
      category, gender, scentFamily, occasion,
      isFeatured, isBestSeller, isNewArrival,
      minPrice, maxPrice, search,
      sort  = '-createdAt',
      page  = 1,
      limit = 12,
    } = req.query

    const filter = { isActive: true }
    if (category)     filter.category    = category
    if (gender)       filter.gender      = gender
    if (scentFamily)  filter.scentFamily = scentFamily
    if (occasion)     filter.occasion    = { $in: [occasion] }
    if (isFeatured)   filter.isFeatured   = true
    if (isBestSeller) filter.isBestSeller = true
    if (isNewArrival) filter.isNewArrival = true

    if (minPrice || maxPrice) {
      filter.basePrice = {}
      if (minPrice) filter.basePrice.$gte = Number(minPrice)
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice)
    }

    if (search) {
      filter.$or = [
        { name:             { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { category:         { $regex: search, $options: 'i' } },
      ]
    }

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await Product.countDocuments(filter)
    const products = await Product.find(filter)
      .select('-reviews')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), count: products.length, products })
  } catch (err) { next(err) }
}

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      $or: [
        { _id: req.params.id.match(/^[a-f\d]{24}$/i) ? req.params.id : null },
        { slug: req.params.id },
      ],
      isActive: true,
    }).populate('reviews.user', 'name avatar')

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })
    res.json({ success: true, product })
  } catch (err) { next(err) }
}

const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .select('-reviews').limit(8).sort('-createdAt')
    res.json({ success: true, products })
  } catch (err) { next(err) }
}

const getBestSellers = async (req, res, next) => {
  try {
    const products = await Product.find({ isBestSeller: true, isActive: true })
      .select('-reviews').limit(8).sort('-avgRating')
    res.json({ success: true, products })
  } catch (err) { next(err) }
}

// ─────────────────────────────────────────────────────────
//  ADMIN — CREATE
// ─────────────────────────────────────────────────────────
const createProduct = async (req, res, next) => {
  try {
    const body = req.body

    // req.files from multer-storage-cloudinary have:
    //   file.path      = full Cloudinary URL  e.g. https://res.cloudinary.com/...
    //   file.filename  = public_id            e.g. lunave/products/bottle-123
    const images = (req.files || []).map((file, idx) => ({
      url:       file.path,        // ← full Cloudinary HTTPS URL
      publicId:  file.filename,    // ← public_id for later deletion
      isPrimary: idx === 0,
    }))

    let scentNotes    = body.scentNotes
    let volumeOptions = body.volumeOptions
    let occasion      = body.occasion

    if (typeof scentNotes    === 'string') scentNotes    = JSON.parse(scentNotes)
    if (typeof volumeOptions === 'string') volumeOptions = JSON.parse(volumeOptions)
    if (typeof occasion      === 'string') occasion      = JSON.parse(occasion)

    const product = await Product.create({
      ...body,
      images,
      scentNotes,
      volumeOptions,
      occasion,
    })

    res.status(201).json({ success: true, product })
  } catch (err) { next(err) }
}

// ─────────────────────────────────────────────────────────
//  ADMIN — UPDATE
// ─────────────────────────────────────────────────────────
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })

    const body = req.body

    // Append newly uploaded images (Cloudinary URLs)
    if (req.files?.length) {
      const newImages = req.files.map((file, idx) => ({
        url:       file.path,
        publicId:  file.filename,
        isPrimary: product.images.length === 0 && idx === 0,
      }))
      product.images.push(...newImages)
    }

    if (typeof body.scentNotes    === 'string') body.scentNotes    = JSON.parse(body.scentNotes)
    if (typeof body.volumeOptions === 'string') body.volumeOptions = JSON.parse(body.volumeOptions)
    if (typeof body.occasion      === 'string') body.occasion      = JSON.parse(body.occasion)

    Object.assign(product, body)
    await product.save()

    res.json({ success: true, product })
  } catch (err) { next(err) }
}

// ─────────────────────────────────────────────────────────
//  ADMIN — DELETE PRODUCT
// ─────────────────────────────────────────────────────────
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })

    // Delete every image from Cloudinary
    await Promise.all(
      product.images.map((img) => {
        const isVideo = img.url?.includes('/video/')
        return destroyAsset(img.url, isVideo ? 'video' : 'image')
      })
    )

    await product.deleteOne()
    res.json({ success: true, message: 'Product deleted successfully' })
  } catch (err) { next(err) }
}

// ─────────────────────────────────────────────────────────
//  ADMIN — DELETE SINGLE IMAGE
// ─────────────────────────────────────────────────────────
const deleteProductImage = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })

    // publicId is passed as a URL-encoded param
    const publicId  = decodeURIComponent(req.params.publicId)
    const imageToRemove = product.images.find(img => img.publicId === publicId || img.url === publicId)

    if (!imageToRemove) return res.status(404).json({ success: false, message: 'Image not found on this product' })

    // Remove from Cloudinary
    const isVideo = imageToRemove.url?.includes('/video/')
    await destroyAsset(imageToRemove.url, isVideo ? 'video' : 'image')

    // Remove from product
    product.images = product.images.filter(img => img.publicId !== publicId && img.url !== publicId)
    if (product.images.length) product.images[0].isPrimary = true

    await product.save()
    res.json({ success: true, message: 'Image removed', images: product.images })
  } catch (err) { next(err) }
}

// ─────────────────────────────────────────────────────────
//  REVIEWS
// ─────────────────────────────────────────────────────────
const addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'You have already reviewed this product' })

    product.reviews.push({ user: req.user._id, name: req.user.name, avatar: req.user.avatar, rating: Number(rating), comment })
    product.calcAvgRating()
    await product.save()

    res.status(201).json({ success: true, message: 'Review added' })
  } catch (err) { next(err) }
}

const deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' })

    const review = product.reviews.id(req.params.reviewId)
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' })

    if (req.user.role !== 'admin' && review.user.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorised' })

    review.deleteOne()
    product.calcAvgRating()
    await product.save()

    res.json({ success: true, message: 'Review deleted' })
  } catch (err) { next(err) }
}

const adminGetAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).select('-reviews').sort('-createdAt')
    res.json({ success: true, count: products.length, products })
  } catch (err) { next(err) }
}

module.exports = {
  getAllProducts, getProductById, getFeaturedProducts, getBestSellers,
  createProduct, updateProduct, deleteProduct, deleteProductImage,
  addReview, deleteReview, adminGetAllProducts,
}
