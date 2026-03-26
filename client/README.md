# LUNAVE — Perfume E-Commerce Frontend

Luxury dark perfume brand built with React + Vite. MERN stack ready.

---

## 🚀 Quick Start

```bash
cd lunave
npm install
npm run dev
```
Open: http://localhost:5173

---

## 📁 Project Structure

```
lunave/
├── public/
│   └── favicon.ico          ← Add your logo.ico here
├── src/
│   ├── assets/
│   │   └── images/          ← 📸 DROP ALL YOUR IMAGES HERE
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── WelcomeSection.jsx
│   │   ├── CollectionsSection.jsx
│   │   ├── ValuesSection.jsx
│   │   ├── BestSellers.jsx
│   │   └── Footer.jsx
│   ├── hooks/
│   │   └── useReveal.js     ← Scroll animation hook
│   ├── pages/
│   │   └── HomePage.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## 📸 How to Add Your Images

### Step 1 — Copy all images from your Drive folder into:
```
src/assets/images/
```

### Step 2 — Hero Bottle (transparent PNG recommended)
In `src/components/Hero.jsx`, find the comment block and replace with:
```jsx
import heroBottle from '../assets/images/hero-bottle.png'

// Then in JSX, replace the placeholder div with:
<img src={heroBottle} alt="Lunave Signature Fragrance" className="hero-bottle-img" />
```

### Step 3 — Collection images
In `src/components/CollectionsSection.jsx`, update the collections array:
```jsx
import designerImg    from '../assets/images/collection-designer.jpg'
import travelImg      from '../assets/images/collection-travel.jpg'
import specialImg     from '../assets/images/collection-special.jpg'
import seasonalImg    from '../assets/images/collection-seasonal.jpg'

const collections = [
  { id: 1, name: 'Designer Delights Collection', src: designerImg },
  { id: 2, name: 'Travel Essentials Collection',  src: travelImg  },
  { id: 3, name: 'Special Occasions Collection',  src: specialImg },
  { id: 4, name: 'Seasonal Sensations Collection',src: seasonalImg},
]
```

### Step 4 — Product images (transparent PNGs work best)
In `src/components/BestSellers.jsx`, update the products array:
```jsx
import product1 from '../assets/images/product-luxurious-elixir-rough.png'
import product2 from '../assets/images/product-golden-legacy.png'
import product3 from '../assets/images/product-luxurious-elixir.png'
import product4 from '../assets/images/product-luxurious-essence.png'

const products = [
  { id: 1, name: 'Luxurious Elixir Rough', price: 220, volume: '100ml', imageSrc: product1 },
  { id: 2, name: 'The Golden Legacy',      price: 285, volume: '100ml', imageSrc: product2 },
  { id: 3, name: 'Luxurious Elixir',       price: 195, volume: '100ml', imageSrc: product3 },
  { id: 4, name: 'Luxurious Essence',      price: 260, volume: '100ml', imageSrc: product4 },
]
```

### Step 5 — Values section image
In `src/components/ValuesSection.jsx`:
```jsx
const VALUES_IMG = '/src/assets/images/values-perfume.jpg'
```

### Step 6 — Logo
Add your logo to `src/assets/images/logo.png` and update Navbar.jsx if you want an image logo instead of text.

---

## 🎨 Design Tokens (CSS Variables)

Edit `src/index.css` `:root` block to change brand colors:

```css
:root {
  --gold: #c9975a;        /* Main brand accent */
  --gold-light: #e8b97a;  /* Hover states */
  --gold-dark: #a07040;   /* Darker variant */
  --black: #0a0a0a;       /* Page background */
  --dark: #111111;        /* Section backgrounds */
  --dark-card: #161616;   /* Card backgrounds */
}
```

---

## 🔌 MERN Backend Integration

When your backend is ready, connect APIs like this:

### Products API
In `BestSellers.jsx`, replace the static array with:
```jsx
const [products, setProducts] = useState([])

useEffect(() => {
  fetch('http://localhost:5000/api/products?featured=true&limit=4')
    .then(r => r.json())
    .then(data => setProducts(data))
}, [])
```

### Newsletter API
In `Footer.jsx`, update the submit handler:
```jsx
const handleSubmit = async () => {
  await fetch('http://localhost:5000/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
}
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| > 1024px | Full 4-col products, 5-col footer |
| 768–1024px | 2-col products, 2-col footer |
| < 768px | Single column, hamburger menu |
| < 480px | Full mobile, stacked everything |

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| react + react-dom | Core |
| react-router-dom | Routing |
| framer-motion | (ready to use for animations) |
| lucide-react | Icons |
| vite | Dev server & bundler |

---

## ✨ Next Steps

1. Add your images (see above)
2. Connect MongoDB product API
3. Build `/shop` page with filters
4. Add cart context (React Context API)
5. Add framer-motion animations for page transitions
6. Build product detail page
7. Add auth (JWT) for user accounts
