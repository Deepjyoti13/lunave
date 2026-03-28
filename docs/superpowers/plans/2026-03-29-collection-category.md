# Collection Category Feature — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 3 category cards (Essentials, Delights, Ethnics) to the homepage collection section, each linking to a cinematic perfume list page that fetches products from the backend by category.

**Architecture:** A new `Category` MongoDB model stores name, slug, description, and Cloudinary cover image. A new `/api/categories` endpoint serves category data. The frontend `CollectionsSection` fetches categories and renders image cards; clicking one navigates to a new `CollectionPage` that fetches and displays the matching products.

**Tech Stack:** Node.js + Express + Mongoose (backend), React + React Router + Lucide Icons (frontend), Cloudinary (images), MongoDB Atlas

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `server/models/Category.js` | Category mongoose schema |
| Modify | `server/models/Product.js` | Add Essentials/Delights/Ethnics to enum |
| Create | `server/controllers/categoryController.js` | getAllCategories, getCategoryBySlug |
| Create | `server/routes/categoryRoutes.js` | GET /api/categories, GET /api/categories/:slug |
| Modify | `server/server.js` | Mount /api/categories |
| Create | `server/seed.js` | Seed 3 categories + 6 products |
| Modify | `client/src/index.css` | Add --gold-champagne, remove old collection styles |
| Rewrite | `client/src/components/CollectionsSection.jsx` | Fetch categories, render 3 image cards with links |
| Create | `client/src/components/CollectionsSection.css` | All styles for the 3 category cards |
| Create | `client/src/pages/CollectionPage.jsx` | Cinematic header + product grid page |
| Create | `client/src/pages/CollectionPage.css` | All styles for the collection page |
| Modify | `client/src/App.jsx` | Add /collections/:category route |

---

## Task 1: Add `--gold-champagne` CSS variable

**Files:**
- Modify: `client/src/index.css`

- [ ] **Step 1: Add the variable to `:root`**

Open `client/src/index.css`. Find the `:root` block (line 6). Add one line after `--gold-dark: #a07040;`:

```css
--gold-champagne: #ecd798;   /* Pantone 7420C — headings, card titles */
```

- [ ] **Step 2: Commit**

```bash
git add client/src/index.css
git commit -m "style: add --gold-champagne (#ecd798) CSS variable"
```

---

## Task 2: Create Category model

**Files:**
- Create: `server/models/Category.js`

- [ ] **Step 1: Create the file**

```js
// server/models/Category.js
const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, default: '' },
    coverImage: {
      url:      { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
  next()
})

module.exports = mongoose.model('Category', categorySchema)
```

- [ ] **Step 2: Verify the server starts without errors**

```bash
cd server && node -e "require('./models/Category'); console.log('OK')"
```

Expected output: `OK`

- [ ] **Step 3: Commit**

```bash
git add server/models/Category.js
git commit -m "feat: add Category mongoose model"
```

---

## Task 3: Update Product model category enum

**Files:**
- Modify: `server/models/Product.js`

- [ ] **Step 1: Add the 3 new category values to the enum**

Open `server/models/Product.js`. Find the `category` field (around line 59):

```js
category: {
  type: String,
  enum: ['Designer Delights','Travel Essentials','Special Occasions','Seasonal Sensations','Oud','Other'],
  required: [true, 'Category is required'],
},
```

Replace it with:

```js
category: {
  type: String,
  enum: ['Designer Delights','Travel Essentials','Special Occasions','Seasonal Sensations','Oud','Other','Essentials','Delights','Ethnics'],
  required: [true, 'Category is required'],
},
```

- [ ] **Step 2: Verify no syntax errors**

```bash
cd server && node -e "require('./models/Product'); console.log('OK')"
```

Expected output: `OK`

- [ ] **Step 3: Commit**

```bash
git add server/models/Product.js
git commit -m "feat: extend Product category enum with Essentials, Delights, Ethnics"
```

---

## Task 4: Create category controller

**Files:**
- Create: `server/controllers/categoryController.js`

- [ ] **Step 1: Create the file**

```js
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
```

- [ ] **Step 2: Verify no syntax errors**

```bash
cd server && node -e "require('./controllers/categoryController'); console.log('OK')"
```

Expected output: `OK`

- [ ] **Step 3: Commit**

```bash
git add server/controllers/categoryController.js
git commit -m "feat: add categoryController with getAllCategories and getCategoryBySlug"
```

---

## Task 5: Create category routes and mount them

**Files:**
- Create: `server/routes/categoryRoutes.js`
- Modify: `server/server.js`

- [ ] **Step 1: Create routes file**

```js
// server/routes/categoryRoutes.js
const express    = require('express')
const router     = express.Router()
const { getAllCategories, getCategoryBySlug } = require('../controllers/categoryController')

router.get('/',      getAllCategories)
router.get('/:slug', getCategoryBySlug)

module.exports = router
```

- [ ] **Step 2: Mount in server.js**

Open `server/server.js`. After the existing route imports (around line 80), add:

```js
const categoryRoutes = require('./routes/categoryRoutes')
```

Then after `app.use('/api/wishlist', wishlistRoutes)` (around line 108), add:

```js
app.use('/api/categories', categoryRoutes)
```

- [ ] **Step 3: Start the server and test both endpoints**

```bash
cd server && node server.js &
sleep 2
curl http://localhost:5001/api/categories
```

Expected: `{"success":true,"categories":[]}`  (empty until seed runs)

```bash
curl http://localhost:5001/api/categories/essentials
```

Expected: `{"success":false,"message":"Category not found"}`

Stop the background server: `kill %1`

- [ ] **Step 4: Commit**

```bash
git add server/routes/categoryRoutes.js server/server.js
git commit -m "feat: add /api/categories route (GET / and GET /:slug)"
```

---

## Task 6: Create seed script and run it

**Files:**
- Create: `server/seed.js`

- [ ] **Step 1: Create the seed script**

```js
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
```

- [ ] **Step 2: Run the seed script**

```bash
cd server && node seed.js
```

Expected output:
```
Connected to MongoDB
✓ Created category: Essentials
✓ Created category: Delights
✓ Created category: Ethnics
✓ Created product: Choco Drip
✓ Created product: Butter Silk
✓ Created product: Ethnic Hadiya
✓ Created product: Oud Breeze
✓ Created product: First Bloom
✓ Created product: The Rebel

Done.
```

- [ ] **Step 3: Verify categories API now returns data**

```bash
cd server && node server.js &
sleep 2
curl http://localhost:5001/api/categories | node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const r=JSON.parse(d);console.log('Count:',r.categories.length)})"
```

Expected: `Count: 3`

```bash
curl http://localhost:5001/api/categories/delights | node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const r=JSON.parse(d);console.log('Name:',r.category.name)})"
```

Expected: `Name: Delights`

Stop the background server: `kill %1`

- [ ] **Step 4: Commit**

```bash
git add server/seed.js
git commit -m "feat: add seed script for 3 categories and 6 products"
```

---

## Task 7: Rewrite CollectionsSection + create its CSS file

**Files:**
- Rewrite: `client/src/components/CollectionsSection.jsx`
- Create: `client/src/components/CollectionsSection.css`
- Modify: `client/src/index.css` (remove old collection styles)

- [ ] **Step 1: Remove old collection styles from `index.css`**

Open `client/src/index.css`. Find and delete the entire block from:
```css
/* ============================================
   SECTION: COLLECTIONS GRID
   ============================================ */
.collections-section {
```
...through to the end of `.collection-card:hover .collection-cta::after { transform: translateX(4px); }` (approximately lines 377–477).

- [ ] **Step 2: Create `CollectionsSection.css`**

```css
/* client/src/components/CollectionsSection.css */

.collections-section {
  padding: var(--section-pad) clamp(20px, 5vw, 60px);
}

.collections-header {
  text-align: center;
  margin-bottom: clamp(40px, 5vw, 70px);
}

/* ── 3-column grid on desktop ── */
.collections-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.collection-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: var(--dark-card);
  aspect-ratio: 3/4;
  display: block;
  text-decoration: none;
}

.collection-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.collection-card:hover .collection-img {
  transform: scale(1.08);
}

.collection-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1510 0%, #2a1f14 50%, #1a1510 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.collection-placeholder span {
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(201, 151, 90, 0.3);
}

.collection-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(0, 0, 0, 0.85) 100%);
  transition: background 0.4s;
}

.collection-card:hover .collection-overlay {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%);
}

.collection-label {
  position: absolute;
  bottom: 24px;
  left: 24px;
  right: 24px;
  z-index: 2;
}

.collection-label h3 {
  font-family: var(--font-display);
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 400;
  font-style: italic;
  color: var(--gold-champagne);
  margin-bottom: 8px;
  transform: translateY(6px);
  transition: transform 0.4s;
}

.collection-card:hover .collection-label h3 {
  transform: translateY(0);
}

.collection-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s, transform 0.4s;
}

.collection-cta::after {
  content: '→';
  transition: transform 0.3s;
}

.collection-card:hover .collection-cta {
  opacity: 1;
  transform: translateY(0);
}

.collection-card:hover .collection-cta::after {
  transform: translateX(4px);
}

/* ── Tablet: 2-col, 3rd card spans full width ── */
@media (min-width: 769px) and (max-width: 1023px) {
  .collections-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .collection-card:nth-child(3) {
    grid-column: 1 / -1;
    aspect-ratio: 16 / 6;
  }
}

/* ── Mobile: 1-col stacked ── */
@media (max-width: 768px) {
  .collections-grid {
    grid-template-columns: 1fr;
  }
  .collection-card {
    aspect-ratio: 16 / 9;
  }
}
```

- [ ] **Step 3: Rewrite `CollectionsSection.jsx`**

```jsx
// client/src/components/CollectionsSection.jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './CollectionsSection.css'

const API_URL = 'http://localhost:5001'

export default function CollectionsSection() {
  const sectionRef              = useRef(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${API_URL}/api/categories`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => { if (data.success) setCategories(data.categories) })
      .catch(err => { if (err.name !== 'AbortError') console.error('Categories fetch failed:', err) })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    sectionRef.current.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [categories])

  return (
    <section className="collections-section" id="collections" ref={sectionRef}>
      <div className="collections-header reveal">
        <p className="section-tag">Explore</p>
        <h2 className="section-title">Our Collections</h2>
      </div>

      <div className="collections-grid">
        {categories.map((cat, i) => (
          <Link
            to={`/collections/${cat.slug}`}
            className={`collection-card reveal reveal-delay-${i + 1}`}
            key={cat._id}
          >
            {cat.coverImage?.url ? (
              <img
                src={cat.coverImage.url}
                alt={cat.name}
                className="collection-img"
                loading="lazy"
                onError={e => { e.currentTarget.style.display = 'none' }}
              />
            ) : (
              <div className="collection-placeholder">
                <span>{cat.name}</span>
              </div>
            )}
            <div className="collection-overlay" />
            <div className="collection-label">
              <h3>{cat.name}</h3>
              <span className="collection-cta">Explore</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Start the dev server and verify the homepage collection section renders 3 cards**

```bash
cd client && npm run dev
```

Open http://localhost:5173 — the "Our Collections" section should show 3 gradient placeholder cards labelled Delights, Essentials, Ethnics. Each card is a link (clicking navigates to `/collections/delights` etc., which 404s until Task 8 is done — that's expected).

- [ ] **Step 5: Commit**

```bash
git add client/src/components/CollectionsSection.jsx client/src/components/CollectionsSection.css client/src/index.css
git commit -m "feat: rewrite CollectionsSection to fetch categories and render 3 linked image cards"
```

---

## Task 8: Create CollectionPage

**Files:**
- Create: `client/src/pages/CollectionPage.jsx`
- Create: `client/src/pages/CollectionPage.css`

- [ ] **Step 1: Create `CollectionPage.css`**

```css
/* client/src/pages/CollectionPage.css */

/* ── Hero ── */
.col-page-hero {
  position: relative;
  height: clamp(320px, 45vw, 520px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: var(--nav-height);
}

.col-page-hero-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.45);
}

.col-page-hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #1a1510 0%, #2a1f14 50%, #0d0b09 100%);
}

.col-page-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.6) 100%);
}

.col-page-hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 20px;
}

.col-page-tag {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.col-page-tag::before,
.col-page-tag::after {
  content: '';
  display: block;
  width: 32px;
  height: 1px;
  background: var(--gold);
}

.col-page-title {
  font-family: var(--font-display);
  font-size: clamp(42px, 7vw, 80px);
  font-weight: 300;
  font-style: italic;
  color: var(--gold-champagne);
  line-height: 1;
  margin-bottom: 20px;
}

.col-page-rule {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  margin: 0 auto 16px;
}

.col-page-count {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--white-dim);
}

/* ── Back link ── */
.col-page-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
  text-decoration: none;
  padding: clamp(20px, 3vw, 40px) clamp(20px, 5vw, 60px) 0;
  max-width: 1400px;
  margin: 0 auto;
  display: block;
  transition: gap 0.3s;
}

.col-page-back:hover { letter-spacing: 0.2em; }

/* ── Product grid section ── */
.col-page-products {
  padding: clamp(30px, 4vw, 60px) clamp(20px, 5vw, 60px) var(--section-pad);
}

.col-page-grid-wrap {
  max-width: 1400px;
  margin: 0 auto;
}

.col-page-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* ── Product card ── */
.col-product-card {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  position: relative;
  overflow: hidden;
  transition: border-color 0.4s, transform 0.4s, box-shadow 0.4s;
  cursor: pointer;
}

.col-product-card:hover {
  border-color: rgba(201, 151, 90, 0.35);
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 151, 90, 0.07);
}

.col-product-img-wrap {
  position: relative;
  background: linear-gradient(135deg, #141414 0%, #1c1a17 100%);
  padding: 30px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 280px;
  overflow: hidden;
}

.col-product-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 10px 30px rgba(201, 151, 90, 0.15));
}

.col-product-card:hover .col-product-img {
  transform: scale(1.08) translateY(-6px);
}

.col-product-no-img {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
}

.col-product-no-img span {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(201, 151, 90, 0.25);
}

/* ── Action buttons (wishlist / eye) ── */
.col-product-actions {
  position: absolute;
  top: 14px;
  right: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(10px);
  transition: opacity 0.3s, transform 0.3s;
}

.col-product-card:hover .col-product-actions {
  opacity: 1;
  transform: translateX(0);
}

.col-product-action-btn {
  width: 36px;
  height: 36px;
  background: rgba(10, 10, 10, 0.85);
  border: 1px solid var(--dark-border);
  color: var(--white-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  backdrop-filter: blur(8px);
}

.col-product-action-btn:hover,
.col-product-action-btn.wished {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--black);
  transform: scale(1.1);
}

.col-product-action-btn.wished {
  background: transparent;
  border-color: rgba(236, 215, 152, 0.5);
  color: var(--gold-champagne);
}

/* ── Product info ── */
.col-product-info {
  padding: 20px;
  border-top: 1px solid var(--dark-border);
}

.col-product-name {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 400;
  font-style: italic;
  color: var(--gold-champagne);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-product-desc {
  font-size: 12px;
  font-weight: 300;
  color: var(--white-dim);
  margin-bottom: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.col-product-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.col-product-price {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: var(--gold);
}

.col-add-cart-btn {
  background: none;
  border: 1px solid var(--dark-border);
  color: var(--white-dim);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 9px 16px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.col-add-cart-btn:hover {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--black);
}

/* ── Loading skeletons ── */
.col-skeleton {
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
}

.col-skeleton-img {
  height: 280px;
  background: linear-gradient(90deg, #161616 25%, #1e1e1e 50%, #161616 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.col-skeleton-info { padding: 20px; border-top: 1px solid var(--dark-border); }

.col-skeleton-line {
  height: 14px;
  background: #1e1e1e;
  border-radius: 2px;
  margin-bottom: 10px;
}

.col-skeleton-line.short { width: 50%; }

@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── Empty state ── */
.col-page-empty {
  text-align: center;
  padding: 80px 20px;
  color: var(--white-dim);
  font-size: 14px;
  letter-spacing: 0.08em;
}

/* ── Responsive ── */
@media (max-width: 1023px) {
  .col-page-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .col-page-grid { grid-template-columns: 1fr; }
  .col-product-img-wrap { height: 220px; }
}
```

- [ ] **Step 2: Create `CollectionPage.jsx`**

```jsx
// client/src/pages/CollectionPage.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Heart } from 'lucide-react'
import Navbar  from '../components/Navbar'
import Footer  from '../components/Footer'
import { useCart }     from '../context/Cartcontext'
import { useWishlist } from '../context/WishlistContext'
import './CollectionPage.css'

const API_URL = 'http://localhost:5001'

function ProductCard({ product }) {
  const [adding, setAdding] = useState(false)
  const { addItem }         = useCart()
  const { isWished, addItem: wishAdd, removeItem: wishRemove } = useWishlist()

  const imgUrl = (() => {
    const img = product.images?.find(i => i.isPrimary) || product.images?.[0]
    if (!img?.url) return null
    return img.url.startsWith('http') ? img.url : `${API_URL}${img.url}`
  })()

  const wished = isWished(product._id)

  const handleAdd = async () => {
    setAdding(true)
    await addItem(product)
    setTimeout(() => setAdding(false), 600)
  }

  const handleHeart = () => {
    wished ? wishRemove(product._id) : wishAdd(product)
  }

  return (
    <div className="col-product-card">
      <div className="col-product-img-wrap">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            className="col-product-img"
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="col-product-no-img">
            <svg width="54" height="90" viewBox="0 0 60 100" fill="none">
              <rect x="22" y="0" width="16" height="10" rx="2" fill="rgba(201,151,90,0.35)" />
              <rect x="26" y="10" width="8" height="8" rx="1" fill="rgba(201,151,90,0.25)" />
              <path d="M12 24 Q8 35 8 50 L8 78 Q8 92 30 92 Q52 92 52 78 L52 50 Q52 35 48 24 Z" fill="rgba(201,151,90,0.1)" stroke="rgba(201,151,90,0.35)" strokeWidth="1" />
            </svg>
            <span>No Image</span>
          </div>
        )}

        <div className="col-product-actions">
          <button
            className={`col-product-action-btn${wished ? ' wished' : ''}`}
            onClick={handleHeart}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={14} fill={wished ? 'var(--gold-champagne)' : 'none'} />
          </button>
        </div>
      </div>

      <div className="col-product-info">
        <p className="col-product-name">{product.name}</p>
        <p className="col-product-desc">{product.shortDescription}</p>
        <div className="col-product-footer">
          <span className="col-product-price">₹{product.basePrice?.toLocaleString('en-IN')}</span>
          <button
            className="col-add-cart-btn"
            onClick={handleAdd}
            disabled={adding}
          >
            <ShoppingBag size={12} />
            {adding ? '✓' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="col-skeleton">
      <div className="col-skeleton-img" />
      <div className="col-skeleton-info">
        <div className="col-skeleton-line" />
        <div className="col-skeleton-line short" />
      </div>
    </div>
  )
}

export default function CollectionPage() {
  const { category }                    = useParams()
  const [cat, setCat]                   = useState(null)
  const [products, setProducts]         = useState([])
  const [loading, setLoading]           = useState(true)

  useEffect(() => {
    setLoading(true)
    const controller = new AbortController()

    fetch(`${API_URL}/api/categories/${category}`, { signal: controller.signal })
      .then(r => r.json())
      .then(catData => {
        if (!catData.success) return Promise.reject(new Error('Category not found'))
        setCat(catData.category)
        return fetch(
          `${API_URL}/api/products?category=${encodeURIComponent(catData.category.name)}&limit=20`,
          { signal: controller.signal }
        )
      })
      .then(r => r.json())
      .then(prodData => {
        if (prodData.success) setProducts(prodData.products)
      })
      .catch(err => { if (err.name !== 'AbortError') console.error(err) })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [category])

  const heroContent = cat?.coverImage?.url ? (
    <img src={cat.coverImage.url} alt={cat.name} className="col-page-hero-img" />
  ) : (
    <div className="col-page-hero-gradient" />
  )

  return (
    <>
      <Navbar />

      <section className="col-page-hero">
        {heroContent}
        <div className="col-page-hero-overlay" />
        <div className="col-page-hero-content">
          <p className="col-page-tag">Lunave</p>
          <h1 className="col-page-title">{cat?.name ?? category}</h1>
          <div className="col-page-rule" />
          {!loading && (
            <p className="col-page-count">
              {products.length} {products.length === 1 ? 'Fragrance' : 'Fragrances'}
            </p>
          )}
        </div>
      </section>

      <Link to="/#collections" className="col-page-back">← All Collections</Link>

      <section className="col-page-products">
        <div className="col-page-grid-wrap">
          {loading ? (
            <div className="col-page-grid">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <p className="col-page-empty">No fragrances found in this collection yet.</p>
          ) : (
            <div className="col-page-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/CollectionPage.jsx client/src/pages/CollectionPage.css
git commit -m "feat: add CollectionPage with cinematic hero header and product grid"
```

---

## Task 9: Add route + end-to-end verification

**Files:**
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Add the route**

Open `client/src/App.jsx`. Add the import after the existing page imports:

```jsx
import CollectionPage from './pages/CollectionPage.jsx'
```

Add the route inside `<Routes>`, after the `/checkout` route:

```jsx
<Route path="/collections/:category" element={<CollectionPage />} />
```

- [ ] **Step 2: Start both servers**

```bash
# Terminal 1 — backend
cd server && node server.js

# Terminal 2 — frontend
cd client && npm run dev
```

- [ ] **Step 3: Verify end-to-end flow**

1. Open http://localhost:5173
2. Scroll to "Our Collections" — confirm 3 cards appear (Delights, Essentials, Ethnics)
3. Click the "Delights" card — confirm navigation to `/collections/delights`
4. Confirm the cinematic hero shows "Delights" in italic gold-champagne type
5. Confirm 2 products appear below: Choco Drip (₹999) and Butter Silk (₹899)
6. Click "Ethnics" card — confirm Ethnic Hadiya and Oud Breeze appear
7. Click "Essentials" card — confirm First Bloom and The Rebel appear
8. Click "← All Collections" — confirm returns to homepage with collections section visible
9. Resize browser to 375px width — confirm hero title is readable, products stack to 1-col

- [ ] **Step 4: Commit**

```bash
git add client/src/App.jsx
git commit -m "feat: add /collections/:category route to App"
```

---

## Post-implementation: Upload real images

Once the feature is live with placeholder gradients, upload real images:

**For category covers:**
Go to MongoDB Compass or Atlas → `categories` collection → update `coverImage.url` and `coverImage.publicId` with the Cloudinary URL after uploading via the Cloudinary dashboard or admin panel.

**For products:**
Use the existing admin panel (`/admin/products`) to edit each of the 6 seeded products and upload their perfume bottle photos. The existing upload flow stores images in Cloudinary automatically.
