const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:    { type: String, required: true },
    avatar:  { type: String },
    rating:  { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
)

const scentNoteSchema = new mongoose.Schema({
  top:   { type: String },
  heart: { type: String },
  base:  { type: String },
})

const volumeOptionSchema = new mongoose.Schema({
  size:  { type: Number, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
})

const productSchema = new mongoose.Schema(
  {
    name:  { type: String, required: [true, 'Product name is required'], trim: true },
    slug:  { type: String, unique: true, lowercase: true },
    brand: { type: String, default: 'LUNAVE' },

    // ── Images — now stored as full Cloudinary URLs ──────
    images: [
      {
        url:       { type: String, required: true },  // full https://res.cloudinary.com/... URL
        publicId:  { type: String },                  // Cloudinary public_id for deletion
        isPrimary: { type: Boolean, default: false },
      },
    ],

    basePrice:    { type: Number, required: [true, 'Price is required'], min: 0 },
    comparePrice: { type: Number, default: null },
    stock:        { type: Number, default: 0 },
    volumeOptions: [volumeOptionSchema],

    shortDescription: { type: String, maxlength: 300 },
    description:      { type: String },
    storyTitle:       { type: String },
    storyContent:     { type: String },
    heartTitle:       { type: String },
    heartContent:     { type: String },

    scentNotes:    scentNoteSchema,
    scentFamily: {
      type: String,
      enum: ['Floral','Oriental','Woody','Fresh','Citrus','Gourmand','Aquatic','Fougere','Other'],
    },

    category: {
      type: String,
      enum: ['Designer Delights','Travel Essentials','Special Occasions','Seasonal Sensations','Oud','Other'],
      required: [true, 'Category is required'],
    },
    gender:        { type: String, enum: ['Men','Women','Unisex'], default: 'Unisex' },
    occasion:      { type: [String], default: [] },
    concentration: {
      type: String,
      enum: ['Parfum','Eau de Parfum','Eau de Toilette','Eau de Cologne','Body Mist'],
      default: 'Eau de Parfum',
    },

    isFeatured:   { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive:     { type: Boolean, default: true },

    reviews:    [reviewSchema],
    numReviews: { type: Number, default: 0 },
    avgRating:  { type: Number, default: 0 },
  },
  { timestamps: true }
)

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
  next()
})

productSchema.methods.calcAvgRating = function () {
  if (!this.reviews.length) {
    this.avgRating = 0; this.numReviews = 0
  } else {
    this.numReviews = this.reviews.length
    this.avgRating  = +(this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length).toFixed(1)
  }
}

module.exports = mongoose.model('Product', productSchema)
