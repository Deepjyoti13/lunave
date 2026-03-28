// server/seed.js
require('dotenv').config()
const mongoose = require('mongoose')
const Category = require('./models/Category')
const Product  = require('./models/Product')

const categories = [
  {
    name: 'Essentials',
    slug: 'essentials',
    description: 'Timeless everyday fragrances for the modern soul.',
    coverImage: { url: '', publicId: '' },
  },
  {
    name: 'Delights',
    slug: 'delights',
    description: 'Rich, indulgent scents that captivate the senses.',
    coverImage: { url: '', publicId: '' },
  },
  {
    name: 'Ethnics',
    slug: 'ethnics',
    description: 'Heritage-inspired fragrances rooted in tradition.',
    coverImage: { url: '', publicId: '' },
  },
]

const products = [
  {
    name: 'Choco Drip',
    category: 'Delights',
    basePrice: 999,
    shortDescription: 'A warm, gourmand blend of rich cocoa and sweet caramel.',
    concentration: 'Eau de Parfum',
    gender: 'Unisex',
    isActive: true,
    images: [],
    volumeOptions: [{ size: 50, price: 999, stock: 100 }],
  },
  {
    name: 'Butter Silk',
    category: 'Delights',
    basePrice: 899,
    shortDescription: 'Soft, creamy vanilla wrapped in silken musk.',
    concentration: 'Eau de Parfum',
    gender: 'Unisex',
    isActive: true,
    images: [],
    volumeOptions: [{ size: 50, price: 899, stock: 100 }],
  },
  {
    name: 'Ethnic Hadiya',
    category: 'Ethnics',
    basePrice: 1199,
    shortDescription: 'A cultural ode — spiced florals meet warm amber resins.',
    concentration: 'Eau de Parfum',
    gender: 'Unisex',
    isActive: true,
    images: [],
    volumeOptions: [{ size: 50, price: 1199, stock: 100 }],
  },
  {
    name: 'Oud Breeze',
    category: 'Ethnics',
    basePrice: 1499,
    shortDescription: 'Smoky oud meets a whisper of cool citrus breeze.',
    concentration: 'Eau de Parfum',
    gender: 'Unisex',
    isActive: true,
    images: [],
    volumeOptions: [{ size: 50, price: 1499, stock: 100 }],
  },
  {
    name: 'First Bloom',
    category: 'Essentials',
    basePrice: 799,
    shortDescription: 'Fresh florals for a crisp, everyday signature.',
    concentration: 'Eau de Parfum',
    gender: 'Women',
    isActive: true,
    images: [],
    volumeOptions: [{ size: 50, price: 799, stock: 100 }],
  },
  {
    name: 'The Rebel',
    category: 'Essentials',
    basePrice: 849,
    shortDescription: 'Bold woods and leather for those who define their own rules.',
    concentration: 'Eau de Parfum',
    gender: 'Men',
    isActive: true,
    images: [],
    volumeOptions: [{ size: 50, price: 849, stock: 100 }],
  },
]

async function seed() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('Connected to MongoDB')

  for (const cat of categories) {
    const exists = await Category.findOne({ slug: cat.slug })
    if (!exists) {
      await Category.create(cat)
      console.log(`✓ Created category: ${cat.name}`)
    } else {
      console.log(`— Skipped (exists): ${cat.name}`)
    }
  }

  for (const prod of products) {
    const exists = await Product.findOne({ name: prod.name })
    if (!exists) {
      await Product.create(prod)
      console.log(`✓ Created product: ${prod.name}`)
    } else {
      console.log(`— Skipped (exists): ${prod.name}`)
    }
  }

  await mongoose.disconnect()
  console.log('\nDone.')
}

seed().catch(err => { console.error(err); process.exit(1) })
