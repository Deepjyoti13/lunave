# Wishlist Feature — Design Spec

**Date:** 2026-03-27
**Status:** Approved
**Scope:** Wishlist context (backend-persisted), wishlist drawer, navbar wiring, product card heart button

---

## Overview

Add a wishlist feature to Lunave. Users can heart-toggle any product card; wishlisted items are persisted to their account via a new MongoDB model and REST API. A slide-in drawer (mirroring the existing CartDrawer pattern) opens when the navbar heart icon is clicked.

---

## Brand Tokens

| Token | Value | Usage |
|---|---|---|
| Accent | `#ecd798` (Pantone 7420C champagne gold) | Heart fill, prices, CTA button, badge, borders |
| Accent dim | `rgba(236,215,152,0.45)` | Labels, nav icon active state |
| Accent faint | `rgba(236,215,152,0.1)` | Hover backgrounds, count badge bg |
| Accent border | `rgba(236,215,152,0.2)` | Drawer border, item border, thumb border |
| Panel bg | `#0d0d0d` | Drawer background |
| Item hover | `rgba(236,215,152,0.04)` | Wishlist item hover |
| Fonts | `Cormorant Garamond` (prices, title, empty state) · `Montserrat` (names, labels, buttons) | Existing brand fonts |

---

## Architecture

### Backend (Node/Express/Mongoose)

**New files:**
- `server/models/Wishlist.js` — Mongoose model (one wishlist per user, array of product refs with cached name/image/price)
- `server/controllers/wishlistController.js` — `getWishlist`, `addToWishlist`, `removeFromWishlist`, `clearWishlist`
- `server/routes/wishlistRoutes.js` — protected routes, registered at `/api/wishlist`
- `server/server.js` — add `app.use('/api/wishlist', wishlistRoutes)`

**API endpoints (all require `Authorization: Bearer <token>`):**

| Method | Path | Action |
|---|---|---|
| `GET` | `/api/wishlist` | Fetch user's wishlist |
| `POST` | `/api/wishlist` | Add a product (`{ productId }`) |
| `DELETE` | `/api/wishlist/:productId` | Remove one product |
| `DELETE` | `/api/wishlist` | Clear entire wishlist |

**Response shape** (consistent with cart API):
```json
{ "success": true, "wishlist": { "items": [...] } }
```

Each item:
```json
{
  "_id": "...",
  "product": "<ObjectId>",
  "name": "Oud Noir",
  "image": "https://cdn...",
  "price": 129.00
}
```

### Frontend (React)

**New files:**
- `client/src/context/WishlistContext.jsx` — provides `items`, `totalCount`, `open/setOpen`, `addItem(product)`, `removeItem(productId)`, `clearWishlist`, `isWished(productId)`
- `client/src/components/WishlistDrawer.jsx` — slide-in drawer with inline styles (same pattern as `CartDrawer.jsx`)

**Modified files:**
- `client/src/App.jsx` — wrap tree with `<WishlistProvider>`, mount `<WishlistDrawer />`
- `client/src/components/Navbar.jsx` — wire heart button to `openWishlist(true)`, show badge count
- `client/src/components/BestSellers.jsx` — connect `ProductCard` heart button to `WishlistContext`

---

## WishlistContext

Mirrors `CartContext` pattern:

```
{ items, totalCount, open, setOpen, loading, addItem, removeItem, clearWishlist, isWished }
```

- `isWished(productId)` — returns `true` if product is in `items`
- `addItem(product)` — POST to `/api/wishlist`, updates state, shows toast "Added to wishlist ♡"
- `removeItem(productId)` — DELETE to `/api/wishlist/:productId`, shows toast "Removed from wishlist"
- `clearWishlist()` — DELETE to `/api/wishlist`
- If no token: `addItem` shows "Please login to continue" toast (same as cart)
- Auto-fetches on mount when token is available

---

## WishlistDrawer

Slide-in panel from the right. Identical DOM/animation pattern to `CartDrawer.jsx` — overlay + panel, ESC key closes, body scroll locked while open.

**Header:** "Wishlist" title (Cormorant Garamond 22px) + item count badge + close button (circular, accent border)

**Item row:**
- 76×92px product thumbnail (accent border, dark bg)
- Name (Montserrat 11px uppercase), volume/size (accent dim)
- Remove (✕) button top-right — red tint on hover
- Price in Cormorant Garamond 19px accent
- "Add to Cart" button — calls `CartContext.addItem(product)` — accent bg, dark text

**Empty state:** Circular ring icon, italic "Nothing saved yet" (Cormorant Garamond), "Add pieces you love to your wishlist" (Montserrat uppercase tiny)

**Footer (when items > 0):**
- "{n} Items saved" label + total value (accent gold)
- "Move All to Cart" primary button — adds all items to cart then clears wishlist
- "Clear wishlist" ghost text link

**Responsive:**
- Desktop: `width: min(420px, 100vw)`
- Mobile (≤ 480px): `width: 100vw`, reduced padding (20px sides)
- Item rows use `flex-wrap` so long names don't overflow on narrow screens

---

## Navbar Changes

- Heart `<button>` gets `onClick={() => openWishlist(true)}`
- When `totalCount > 0`: show `.cart-badge` span (reuse existing CSS class) showing wishlist count
- When any item is wishlisted: heart icon gets accent fill color (`#ecd798`) via inline style

---

## BestSellers / ProductCard Changes

- Import `useWishlist` from `WishlistContext`
- Replace local `wished` state with `isWished(product._id)`
- Heart button `onClick` calls `isWished ? removeItem(product._id) : addItem(product)`
- Heart icon: `fill={isWished(product._id) ? '#ecd798' : 'none'}`, `color` set to `#ecd798` when wished

---

## Wishlist Model (Mongoose)

```js
wishlistItemSchema: {
  product: ObjectId (ref: 'Product', required),
  name:    String (required),
  image:   String,
  price:   Number (required),
}

wishlistSchema: {
  user:  ObjectId (ref: 'User', required, unique),
  items: [wishlistItemSchema],
  timestamps: true
}
```

`unique: true` on `user` ensures one wishlist per user (same as Cart model).

---

## Data Flow

```
User clicks ♡ on product card
  → useWishlist().addItem(product)
    → POST /api/wishlist { productId }
      → server upserts Wishlist doc, returns updated items
    → setItems(data.wishlist.items)
    → toast "Added to wishlist ♡"
  → isWished(product._id) returns true
  → Heart icon fills #ecd798

User clicks navbar ♡
  → setOpen(true) → WishlistDrawer slides in

User clicks "Add to Cart" on wish item
  → CartContext.addItem(product)
  → Cart drawer opens (existing behavior)

User clicks "Move All to Cart"
  → addItem() for each wishlist item sequentially
  → clearWishlist()
```

---

## Files to Create / Modify

| Action | File |
|---|---|
| Create | `server/models/Wishlist.js` |
| Create | `server/controllers/wishlistController.js` |
| Create | `server/routes/wishlistRoutes.js` |
| Modify | `server/server.js` — register `/api/wishlist` route |
| Create | `client/src/context/WishlistContext.jsx` |
| Create | `client/src/components/WishlistDrawer.jsx` |
| Modify | `client/src/App.jsx` — add provider + drawer |
| Modify | `client/src/components/Navbar.jsx` — wire heart button |
| Modify | `client/src/components/BestSellers.jsx` — wire heart button |

---

## Out of Scope

- No wishlist dedicated page (drawer only)
- No sharing wishlist publicly
- No "notify when back in stock"
- No sorting/filtering within the drawer
