const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     { type: String, required: true },
  image:    { type: String },
  price:    { type: Number, required: true },
  volume:   { type: Number },
  quantity: { type: Number, required: true, min: 1 },
})

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  line1:    { type: String, required: true },
  line2:    { type: String },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  country:  { type: String, required: true },
  pincode:  { type: String, required: true },
})

const orderSchema = new mongoose.Schema(
  {
    // ── Relations ─────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ── Order content ─────────────────────────────────────
    items:           [orderItemSchema],
    shippingAddress: { type: addressSchema, required: true },

    // ── Pricing ───────────────────────────────────────────
    itemsTotal:    { type: Number, required: true },
    shippingPrice: { type: Number, default: 0 },
    taxPrice:      { type: Number, default: 0 },
    totalPrice:    { type: Number, required: true },
    discount:      { type: Number, default: 0 },
    couponCode:    { type: String, default: null },

    // ── Payment ───────────────────────────────────────────
    paymentMethod: {
      type: String,
      enum: ['COD', 'Card', 'UPI', 'NetBanking', 'Wallet'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending',
    },
    paidAt: { type: Date },
    paymentResult: {
      // Filled by payment gateway
      id:     { type: String },
      status: { type: String },
      email:  { type: String },
    },

    // ── Order lifecycle ───────────────────────────────────
    orderStatus: {
      type: String,
      enum: ['Placed', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'],
      default: 'Placed',
    },
    statusHistory: [
      {
        status:    { type: String },
        changedAt: { type: Date, default: Date.now },
        note:      { type: String },
      },
    ],
    isDelivered:  { type: Boolean, default: false },
    deliveredAt:  { type: Date },
    trackingId:   { type: String },
    cancelReason: { type: String },
  },
  { timestamps: true }
)

// Auto-push status change to history
orderSchema.pre('save', function (next) {
  if (this.isModified('orderStatus')) {
    this.statusHistory.push({ status: this.orderStatus })
  }
  next()
})

module.exports = mongoose.model('Order', orderSchema)
