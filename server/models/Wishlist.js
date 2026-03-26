const mongoose = require('mongoose')

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name:  { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
})

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one wishlist per user
    },
    items: [wishlistItemSchema],
  },
  {
    timestamps: true,
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
)

module.exports = mongoose.model('Wishlist', wishlistSchema)
