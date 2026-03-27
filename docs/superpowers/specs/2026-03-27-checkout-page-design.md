# Checkout Page Design — Lunave

**Date:** 2026-03-27
**Status:** Approved

---

## Overview

A full `/checkout` page for the Lunave luxury dark perfume brand. Split two-column layout on desktop (form left, sticky order summary right), collapsing to a single-column with a gold accordion order summary on mobile.

---

## Layout

### Desktop (≥ 768px)
- Two-column CSS grid: `1fr 380px`
- **Left column:** stacked form sections, page title at top
- **Right column:** sticky `top: 84px` order summary card — stays in view as the user scrolls through the form
- Max-width `1100px`, centered, padded with `clamp(16px, 4vw, 48px)`

### Mobile (< 768px)
- Single column, sidebar hidden via `display: none`
- Gold collapsible accordion appears at top of page above the forms
- Accordion shows total price in header, expands to reveal full item list and totals
- On `≤ 480px`: field rows collapse from 2-col to 1-col, padding reduced

---

## Page Sections

### Navbar Strip
- Reuses the existing Lunave nav height/brand style
- Shows `LUNAVE` wordmark (Cormorant Garamond) on the left
- Shows a lock icon + "Secure Checkout" label on the right in gold-dimmed text
- `position: sticky; top: 0` so it stays visible

### Step Breadcrumb
- Three steps: **Information → Shipping → Payment** (visual only, non-functional in this implementation)
- Active step highlighted in solid gold; completed steps in dim gold ring; inactive in grey
- On mobile, step labels hide — only numbered circles + connector lines shown

### Form Sections (Left Column)

All sections share a `co-section` card style: `#161616` background, `1px #222` border, border highlights gold on `:focus-within`.

**01 — Contact Information**
- First name, Last name (2-col row)
- Email address (full width)
- Phone number (full width)
- Checkbox: "Email me with news and exclusive offers" (pre-checked)

**02 — Shipping Address**
- Address Line 1 (full width)
- Address Line 2 optional (full width)
- City + State/Province (2-col)
- ZIP/Postal Code + Country dropdown (2-col)
- Checkbox: "Save this address for future orders"

**03 — Shipping Method**
- Three radio-style option cards:
  - Standard Delivery — Free — 5–8 business days (pre-selected)
  - Express Delivery — $18 — 2–3 business days
  - Overnight — $38 — next business day
- Clicking any card selects it (gold border + subtle gold background tint)

**04 — Payment**
- Static payment logo row: Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay — display only, no gateway
- Divider line labeled "Card Details"
- Name on Card (full width)
- Card Number (full width, with •••• icon on right)
- Expiry Month + Expiry Year + CVV (3-col row, collapses to 1-col on small mobile)
- Checkbox: "Save card for future purchases"

**Place Order Button**
- Full-width gold gradient CTA button with lock icon + arrow
- Hover: lifts with gold glow shadow
- Sub-label: "Your personal data will be used to process your order"

### Order Summary (Right Column — Sticky)

- Header: "Your Order" (Cormorant Garamond) + item count
- Item list: reads from `CartContext` — thumbnail, name, volume, quantity badge, price
- Promo Code: text input + "Apply" button (UI only in this implementation)
- Totals: Subtotal, Shipping (Free if ≥ $500), Tax (label only), Grand Total in large gold Cormorant Garamond
- Security badges row: SSL Secured · 256-bit Encryption · PCI Compliant (decorative icons)

### Mobile Accordion
- Triggered by button at top of page (above forms)
- Button shows "Order Summary" label + total price + chevron arrow
- Panel slides open (max-height transition) to reveal same item list + totals
- Arrow rotates 180° when open

---

## Brand Tokens Used

| Token | Value |
|---|---|
| Background | `#0a0a0a` |
| Card bg | `#161616` |
| Summary bg | `#0d0d0d` |
| Border | `#222222` |
| Gold | `#c9975a` |
| Gold light | `#e8b97a` |
| White | `#f5f0eb` |
| Display font | Cormorant Garamond (prices, titles, italic headings) |
| Heading font | Playfair Display |
| Body font | Montserrat (labels, inputs, buttons) |

---

## Input Field Style

- `background: rgba(255,255,255,0.03)` — near-invisible fill
- `border: 1px solid rgba(255,255,255,0.1)` — subtle white border
- On `:focus`: border shifts to `rgba(201,151,90,0.5)` + `box-shadow: 0 0 0 3px rgba(201,151,90,0.07)` gold glow ring
- Placeholder text: `rgba(245,240,235,0.2)`

---

## Files

| File | Purpose |
|---|---|
| `client/src/pages/Checkout.jsx` | Page component — JSX structure + logic |
| `client/src/pages/Checkout.css` | All styles for the checkout page |

The existing `App.jsx` gets a new route: `<Route path="/checkout" element={<Checkout />} />`.

The `CartDrawer.jsx` already navigates to `/checkout` on "Proceed to Checkout" — no changes needed there.

---

## Data

- Cart items, totals, and item count are read from `useCart()` (existing `CartContext`)
- No new API calls needed for the page itself
- Shipping method selection is local UI state (`useState`)
- Promo code input is local UI state (no backend in this implementation)
- Form fields are local `useState` — no submission logic (payment gateway is out of scope)

---

## What's Out of Scope

- Real payment processing (no gateway integration)
- Form validation / error states
- Address autocomplete
- Backend order submission
- Order confirmation page
