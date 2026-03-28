# Collection Category Feature — Design Spec
**Date:** 2026-03-29
**Status:** Approved

---

## Overview

Restructure the existing `CollectionsSection` on the homepage to show 3 fixed category cards (Essentials, Delights, Ethnics). Clicking a card navigates to a new `CollectionPage` that lists all perfumes in that category, fetched from the backend.

---

## Categories & Products

| Category | Perfumes |
|---|---|
| Delights | Choco Drip, Butter Silk |
| Ethnics | Ethnic Hadiya, Oud Breeze |
| Essentials | First Bloom, The Rebel |

---

## Data Layer

### New: `server/models/Category.js`
```
name        String   required — "Essentials" / "Delights" / "Ethnics"
slug        String   unique, auto-generated lowercase — "essentials" / "delights" / "ethnics"
description String   — short tagline displayed on the collection page header
coverImage  { url: String, publicId: String }  — Cloudinary image for the homepage card
isActive    Boolean  default: true
```

### Updated: `server/models/Product.js`
- Extend `category` enum to include `'Essentials'`, `'Delights'`, `'Ethnics'` alongside existing values.
- No existing data is broken — old enum values remain valid.

### New: `server/seed.js`
- Creates 3 `Category` documents (Essentials, Delights, Ethnics) with placeholder coverImage fields.
- Creates 6 `Product` documents (2 per category) with placeholder Cloudinary image fields.
- Real images are uploaded later via the admin panel.
- Script is idempotent — skips creation if slug/name already exists.

---

## API Layer

### New: `server/controllers/categoryController.js`
- `getAllCategories` — returns all active categories with coverImage. Used by `CollectionsSection`.
- `getCategoryBySlug` — returns a single category by slug. Used by `CollectionPage` header.

### New: `server/routes/categoryRoutes.js`
```
GET /api/categories        → getAllCategories
GET /api/categories/:slug  → getCategoryBySlug
```

### Updated: `server/server.js`
- Mounts `/api/categories` route.

### Existing (unchanged): `server/controllers/productController.js`
- `getAllProducts` already supports `?category=` query param filtering. No changes needed.

---

## Frontend

### Updated: `client/src/components/CollectionsSection.jsx`
- Fetches from `GET /api/categories` instead of `GET /api/products`.
- Renders exactly 3 cards in a CSS grid.
- **Card design (Option A — Full-bleed image):**
  - Category `coverImage` fills the card.
  - Dark gradient overlay from bottom.
  - Category name (Cormorant Garamond italic, `--gold-champagne`) at bottom-left.
  - "Explore" CTA in gold that reveals on hover with arrow animation.
  - Entire card is a `<Link>` to `/collections/:slug`.
- Placeholder shown if `coverImage` is not yet set.
- Scroll-reveal animation (`.reveal` class) preserved from current implementation.

### New: `client/src/components/CollectionsSection.css`
- Styles extracted/rewritten for the 3 category cards.
- Grid: 3 equal columns on desktop, 1 column stacked on mobile.
- Card hover: image scale + overlay darkens.

### New: `client/src/pages/CollectionPage.jsx`
- Route param `:category` (slug) read via `useParams`.
- On mount: fetches `GET /api/categories/:slug` (header data) and `GET /api/products?category=<name>` (product list) in parallel.
- **Layout B — Cinematic header + product grid:**
  - Full-width hero section: category `coverImage` as background, centered italic category name (`--gold-champagne`, Cormorant Garamond), gold horizontal rule, fragrance count subtitle.
  - Product grid below: 3-col on desktop (≥1024px), 2-col on tablet (≥480px), 1-col on mobile.
  - Each product card: Cloudinary image, name, short description, price, add-to-cart button, wishlist icon.
  - Back navigation: "← All Collections" link returns to homepage `#collections` anchor.
- Loading skeleton and empty state handled.
- Includes `<Navbar />` and `<Footer />`.

### New: `client/src/pages/CollectionPage.css`
- All styles scoped to the collection page.
- Hero section with parallax-style background image.
- Product card grid with responsive breakpoints.
- No styles written inline or in `index.css`.

### Updated: `client/src/App.jsx`
- Adds `import CollectionPage from './pages/CollectionPage.jsx'`
- Adds `<Route path="/collections/:category" element={<CollectionPage />} />`

### Updated: `client/src/index.css`
- Adds `--gold-champagne: #ecd798;` to `:root` — used for headings and card titles across the new feature.

---

## Brand Tokens Used

| Token | Value | Usage |
|---|---|---|
| `--gold-champagne` | `#ecd798` | Category names, page headings, product names |
| `--gold` | `#c9975a` | Prices, CTA buttons, divider lines, "Explore" text |
| `--gold-light` | `#e8b97a` | Button hover states |
| `--font-display` | Cormorant Garamond | All headings, category titles, product names |
| `--font-body` | Montserrat | Tags, labels, metadata, buttons |
| `--black` / `--dark-card` | `#0a0a0a` / `#161616` | Page background, card backgrounds |

---

## Responsive Breakpoints

| Breakpoint | Collection Cards | Product Grid |
|---|---|---|
| ≥1024px (desktop) | 3 columns | 3 columns |
| 768–1023px (tablet) | 2 columns | 2 columns |
| <768px (mobile) | 1 column stacked | 1 column |

---

## Image Strategy

- **Category cover images:** Uploaded to Cloudinary manually or via admin panel. Stored as `{ url, publicId }` in the `Category` document. Seed data uses a placeholder URL — replaced when real photos are ready.
- **Product images:** Uploaded via existing admin panel product form. Stored in `product.images[]` array. Seed data uses placeholder URLs.
- **Fallback:** If `coverImage.url` is absent, a dark gradient placeholder with the category name is shown (same pattern as current `CollectionsSection`).

---

## Out of Scope

- Admin UI for managing categories (categories managed via seed script + direct DB or future admin page).
- Filtering / sorting on the collection page.
- Pagination (≤6 products per category for now).
