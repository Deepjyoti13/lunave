/**
 * Seed Script — run once to bootstrap your DB
 * Usage: node seed.js
 * To clear DB first: node seed.js --destroy
 */
require('dotenv').config()
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const User    = require('./models/User')
const Product = require('./models/Product')

const adminUser = {
  name:     'Lunave Admin',
  email:    'admin@lunave.com',
  password: 'Admin@1234',   // ← change after first login
  role:     'admin',
}

const sampleProducts = [
  {
    name:             'Luxurious Elixir Rough',
    shortDescription: 'A bold, woody fragrance with deep amber undertones.',
    description:      'Step into a world of unparalleled opulence with Luxurious Elixir Rough.',
    storyTitle:       'The Golden Overture',
    storyContent:     'Opens with a grand flourish of radiant citrus and sun-kissed fruits.',
    heartTitle:       'The Heart of Elegance',
    heartContent:     'The embodiment of glamour and prestige at every spritz.',
    basePrice:        220,
    stock:            50,
    category:         'Designer Delights',
    gender:           'Men',
    scentFamily:      'Woody',
    concentration:    'Eau de Parfum',
    occasion:         ['Evening', 'Office'],
    scentNotes: {
      top:   'Citrus Accord, Sun-kissed Fruits',
      heart: 'Golden Roses, Rare Blooms',
      base:  'Amber, Vanilla, Sandalwood',
    },
    volumeOptions: [
      { size: 100, price: 220, stock: 30 },
      { size: 150, price: 290, stock: 20 },
    ],
    isBestSeller: true,
    isFeatured:   true,
    images: [],  // add real images via API
  },
  {
    name:             'The Golden Legacy',
    shortDescription: 'Timeless oriental fragrance — liquid gold in a bottle.',
    description:      'A celebration of sophistication crafted with the finest essences.',
    basePrice:        285,
    stock:            35,
    category:         'Special Occasions',
    gender:           'Unisex',
    scentFamily:      'Oriental',
    concentration:    'Parfum',
    occasion:         ['Evening', 'Wedding'],
    scentNotes: {
      top:   'Bergamot, Cardamom',
      heart: 'Oud, Rose',
      base:  'Musk, Amber, Patchouli',
    },
    volumeOptions: [
      { size: 100, price: 285, stock: 20 },
      { size: 150, price: 360, stock: 15 },
    ],
    isBestSeller: true,
    isFeatured:   true,
    images: [],
  },
  {
    name:             'Luxurious Elixir',
    shortDescription: 'Enchanting floral with precious golden hues.',
    basePrice:        195,
    stock:            60,
    category:         'Designer Delights',
    gender:           'Women',
    scentFamily:      'Floral',
    concentration:    'Eau de Parfum',
    occasion:         ['Casual', 'Office'],
    scentNotes: {
      top:   'Peach, Bergamot',
      heart: 'Jasmine, Tuberose',
      base:  'White Musk, Cedarwood',
    },
    isBestSeller: true,
    isNewArrival: true,
    images: [],
  },
  {
    name:             'Luxurious Essence',
    shortDescription: 'Pure refinement distilled into every drop.',
    basePrice:        260,
    stock:            40,
    category:         'Designer Delights',
    gender:           'Women',
    scentFamily:      'Floral',
    concentration:    'Eau de Parfum',
    occasion:         ['Evening'],
    scentNotes: {
      top:   'Lychee, Raspberry',
      heart: 'Magnolia, Iris',
      base:  'Vetiver, Sandalwood',
    },
    isBestSeller: true,
    images: [],
  },
]

const seedDB = async () => {
  await connectDB()

  if (process.argv.includes('--destroy')) {
    console.log('🗑️  Destroying all data...')
    await User.deleteMany()
    await Product.deleteMany()
    console.log('✅ Database cleared')
    process.exit(0)
  }

  try {
    // Create admin
    const existing = await User.findOne({ email: adminUser.email })
    if (!existing) {
      await User.create(adminUser)
      console.log('👤 Admin user created:')
      console.log(`   Email:    ${adminUser.email}`)
      console.log(`   Password: ${adminUser.password}`)
    } else {
      console.log('👤 Admin user already exists — skipping')
    }

    // Create products
    // Use Product.create() one-by-one — NOT insertMany — so the
    // pre-save hook that auto-generates slugs fires for each document.
    const count = await Product.countDocuments()
    if (count === 0) {
      for (const data of sampleProducts) {
        await Product.create(data)
      }
      console.log(`🛍️  ${sampleProducts.length} sample products created`)
    } else {
      console.log(`🛍️  Products already exist (${count}) — skipping`)
    }

    console.log('\n✅ Seed complete! Start the server with: npm run dev\n')
    process.exit(0)
  } catch (err) {
    console.error('❌ Seed error:', err.message)
    process.exit(1)
  }
}

seedDB()