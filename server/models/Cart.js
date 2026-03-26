const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name:       { type: String, required: true },
  image:      { type: String },          // cached image URL
  price:      { type: Number, required: true },
  volume:     { type: Number },          // ml selected (100 / 150)
  quantity:   { type: Number, default: 1, min: 1, max: 20 },
})

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // one cart per user
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
    // Virtual: calculate totals without storing them
    toJSON:   { virtuals: true },
    toObject: { virtuals: true },
  }
)

// Virtual: total item count
cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, i) => sum + i.quantity, 0)
})

// Virtual: subtotal
cartSchema.virtual('subtotal').get(function () {
  return +this.items
    .reduce((sum, i) => sum + i.price * i.quantity, 0)
    .toFixed(2)
})

module.exports = mongoose.model('Cart', cartSchema)
