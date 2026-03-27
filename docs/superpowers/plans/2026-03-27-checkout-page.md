# Checkout Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/checkout` page for the Lunave luxury perfume brand — two-column split layout on desktop (forms left, sticky order summary right), collapsing to single-column with a collapsible gold accordion on mobile.

**Architecture:** Two new files (`Checkout.jsx` + `Checkout.css`) in `client/src/pages/`, one route addition in `App.jsx`. The page reads cart data from the existing `CartContext` — no new context, no API calls, no form submission logic.

**Tech Stack:** React 18, React Router DOM v6, Lucide React (icons), existing `useCart()` context, CSS custom properties from `index.css`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `client/src/pages/Checkout.css` | All checkout page styles |
| Create | `client/src/pages/Checkout.jsx` | Page component — JSX + local state only |
| Modify | `client/src/App.jsx` | Add `/checkout` route |

---

## Task 1: Create `Checkout.css` — Layout, Navbar, Breadcrumb, Section Cards

**Files:**
- Create: `client/src/pages/Checkout.css`

- [ ] **Step 1: Create the file with layout foundation and nav styles**

Create `client/src/pages/Checkout.css` with the following content:

```css
/* ============================================================
   CHECKOUT PAGE — Lunave
   Layout: two-col desktop, single-col mobile
   ============================================================ */

/* ── Navbar strip ── */
.co-nav {
  height: 64px;
  background: rgba(10, 10, 10, 0.97);
  border-bottom: 1px solid rgba(201, 151, 90, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 5vw, 60px);
  position: sticky;
  top: 0;
  z-index: 100;
}
.co-nav-brand {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: #e8b97a;
  text-decoration: none;
}
.co-nav-secure {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(201, 151, 90, 0.5);
}
.co-nav-secure svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
}

/* ── Step breadcrumb ── */
.co-breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px 0 0;
}
.co-step {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.co-step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.3s;
}
.co-step.active .co-step-num  { background: #c9975a; color: #0a0a0a; }
.co-step.done .co-step-num    { background: rgba(201,151,90,0.15); border: 1px solid rgba(201,151,90,0.4); color: #c9975a; }
.co-step.inactive .co-step-num { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.25); }
.co-step.active .co-step-label  { color: #c9975a; }
.co-step.done .co-step-label    { color: rgba(201,151,90,0.55); }
.co-step.inactive .co-step-label { color: rgba(255,255,255,0.2); }
.co-step-line {
  width: 48px;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 4px;
}

/* ── Page wrapper ── */
.co-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px clamp(16px, 4vw, 48px) 100px;
}
.co-page-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(28px, 4vw, 42px);
  font-weight: 300;
  font-style: italic;
  letter-spacing: 0.04em;
  color: #f5f0eb;
  margin-bottom: 6px;
}
.co-page-sub {
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(201, 151, 90, 0.5);
  margin-bottom: 28px;
}

/* ── Two-column grid ── */
.co-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 32px;
  align-items: start;
}

/* ── Section cards ── */
.co-section {
  background: #161616;
  border: 1px solid #222222;
  border-radius: 3px;
  margin-bottom: 16px;
  overflow: hidden;
  transition: border-color 0.3s;
}
.co-section:focus-within {
  border-color: rgba(201, 151, 90, 0.3);
}
.co-section-head {
  padding: 18px 24px 14px;
  border-bottom: 1px solid #222222;
  display: flex;
  align-items: center;
  gap: 12px;
}
.co-section-num {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(201, 151, 90, 0.1);
  border: 1px solid rgba(201, 151, 90, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: #c9975a;
  flex-shrink: 0;
}
.co-section-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: #f5f0eb;
  margin: 0;
}
.co-section-body {
  padding: 20px 24px;
}
```

- [ ] **Step 2: Verify file exists**

```bash
ls client/src/pages/Checkout.css
```
Expected: file path printed, no error.

---

## Task 2: Extend `Checkout.css` — Form Fields, Shipping Options, Payment Logos

**Files:**
- Modify: `client/src/pages/Checkout.css` (append)

- [ ] **Step 1: Append form field styles**

Open `client/src/pages/Checkout.css` and append:

```css
/* ── Form field rows ── */
.co-field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}
.co-field-row.single  { grid-template-columns: 1fr; }
.co-field-row.triple  { grid-template-columns: 1fr 1fr 1fr; }
.co-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.co-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(245, 240, 235, 0.45);
}
.co-label-opt {
  opacity: 0.4;
  font-weight: 300;
}
.co-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  padding: 12px 14px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #f5f0eb;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  width: 100%;
}
.co-input::placeholder { color: rgba(245, 240, 235, 0.2); }
.co-input:focus {
  border-color: rgba(201, 151, 90, 0.5);
  box-shadow: 0 0 0 3px rgba(201, 151, 90, 0.07);
  background: rgba(201, 151, 90, 0.025);
}
.co-select {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  padding: 12px 14px;
  font-family: 'Montserrat', sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: #f5f0eb;
  outline: none;
  width: 100%;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(201,151,90,0.5)' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
}
.co-select option { background: #161616; color: #f5f0eb; }
.co-select:focus {
  border-color: rgba(201, 151, 90, 0.5);
  box-shadow: 0 0 0 3px rgba(201, 151, 90, 0.07);
}

/* ── Checkbox row ── */
.co-check-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  cursor: pointer;
}
.co-checkbox {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border: 1px solid rgba(201, 151, 90, 0.3);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.co-checkbox.checked {
  background: rgba(201, 151, 90, 0.15);
  border-color: rgba(201, 151, 90, 0.6);
}
.co-check-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  letter-spacing: 0.05em;
  color: rgba(245, 240, 235, 0.4);
  user-select: none;
}

/* ── Shipping options ── */
.co-ship-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.co-ship-opt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}
.co-ship-opt.selected {
  border-color: rgba(201, 151, 90, 0.45);
  background: rgba(201, 151, 90, 0.04);
}
.co-ship-opt:hover { border-color: rgba(201, 151, 90, 0.25); }
.co-ship-opt-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.co-radio {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(201, 151, 90, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.co-ship-opt.selected .co-radio::after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c9975a;
  display: block;
}
.co-ship-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(245, 240, 235, 0.75);
}
.co-ship-days {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  color: rgba(245, 240, 235, 0.3);
  letter-spacing: 0.04em;
  margin-top: 2px;
}
.co-ship-price {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 16px;
  color: #c9975a;
}
.co-ship-price.free {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: rgba(201, 151, 90, 0.65);
}

/* ── Payment logos ── */
.co-pay-logos {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}
.co-pay-logo {
  height: 30px;
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: rgba(245, 240, 235, 0.45);
  min-width: 44px;
}
.co-pay-logo.visa  { color: #4a90d9; font-size: 13px; font-style: italic; letter-spacing: 0.01em; }
.co-pay-logo.amex  { color: #5a9fd4; font-size: 9px; font-weight: 800; letter-spacing: 0.06em; }
.co-pay-logo.mc    { position: relative; overflow: visible; min-width: 44px; }
.co-pay-logo.mc .mc-left  { width: 16px; height: 16px; border-radius: 50%; background: #c0392b; display: inline-block; }
.co-pay-logo.mc .mc-right { width: 16px; height: 16px; border-radius: 50%; background: #e67e22; display: inline-block; margin-left: -8px; opacity: 0.9; }
.co-pay-logo.paypal .pp-blue { color: #1a5fa8; }
.co-pay-logo.paypal .pp-cyan { color: #179bd7; }
.co-pay-logo.apple { color: #f5f0eb; font-size: 12px; }
.co-pay-logo.gpay  { font-size: 10px; font-weight: 700; letter-spacing: 0; }
.co-pay-logo.gpay .g  { color: #4285F4; }
.co-pay-logo.gpay .o1 { color: #34A853; }
.co-pay-logo.gpay .o2 { color: #FBBC05; }
.co-pay-logo.gpay .g2 { color: #EA4335; }
.co-pay-logo.gpay .le { color: #4285F4; }

/* ── Card input with icon ── */
.co-card-input-wrap { position: relative; }
.co-card-input-wrap .co-input { padding-right: 54px; }
.co-card-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: rgba(201, 151, 90, 0.35);
  letter-spacing: 0.05em;
  pointer-events: none;
}

/* ── Divider ── */
.co-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 18px 0 16px;
}
.co-divider-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
}
.co-divider-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 8px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245, 240, 235, 0.2);
}

/* ── Place Order button ── */
.co-place-btn {
  width: 100%;
  background: linear-gradient(135deg, rgba(201, 151, 90, 0.95), rgba(176, 122, 56, 0.9));
  border: 1px solid rgba(201, 151, 90, 0.5);
  color: #0a0a0a;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  padding: 18px 24px;
  border-radius: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: box-shadow 0.25s, transform 0.15s;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
}
.co-place-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.25s;
}
.co-place-btn:hover {
  box-shadow: 0 10px 36px rgba(201, 151, 90, 0.3);
  transform: translateY(-1px);
}
.co-place-btn:hover::before { opacity: 1; }
.co-place-btn:active { transform: translateY(0); }
.co-place-note {
  text-align: center;
  margin-top: 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(245, 240, 235, 0.2);
}
```

---

## Task 3: Extend `Checkout.css` — Order Summary, Mobile Accordion, Responsive

**Files:**
- Modify: `client/src/pages/Checkout.css` (append)

- [ ] **Step 1: Append order summary sidebar + mobile styles**

Append to `client/src/pages/Checkout.css`:

```css
/* ── Order summary sidebar ── */
.co-summary {
  position: sticky;
  top: 84px;
  background: #0d0d0d;
  border: 1px solid rgba(201, 151, 90, 0.12);
  border-radius: 3px;
  overflow: hidden;
}
.co-summary-head {
  padding: 18px 22px 16px;
  border-bottom: 1px solid rgba(201, 151, 90, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.co-summary-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: #f5f0eb;
}
.co-summary-count {
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(201, 151, 90, 0.5);
}
.co-summary-items { padding: 8px 0; }
.co-sum-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 22px;
  transition: background 0.2s;
}
.co-sum-item:hover { background: rgba(201, 151, 90, 0.02); }
.co-sum-thumb {
  width: 52px;
  height: 62px;
  flex-shrink: 0;
  border-radius: 2px;
  overflow: hidden;
  background: #161616;
  border: 1px solid rgba(201, 151, 90, 0.1);
  position: relative;
}
.co-sum-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.co-sum-qty-badge {
  position: absolute;
  top: -7px;
  right: -7px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #c9975a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 700;
  color: #0a0a0a;
}
.co-sum-info { flex: 1; min-width: 0; }
.co-sum-name {
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(245, 240, 235, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.co-sum-vol {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  color: rgba(201, 151, 90, 0.45);
  letter-spacing: 0.04em;
  margin-top: 3px;
}
.co-sum-price {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 17px;
  color: #c9975a;
  white-space: nowrap;
}

/* promo code */
.co-summary-promo { padding: 4px 22px 16px; }
.co-promo-row { display: flex; gap: 8px; margin-top: 6px; }
.co-promo-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  padding: 10px 14px;
  font-family: 'Montserrat', sans-serif;
  font-size: 11px;
  font-weight: 300;
  color: #f5f0eb;
  outline: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: border-color 0.2s;
}
.co-promo-input::placeholder { color: rgba(245, 240, 235, 0.2); text-transform: none; }
.co-promo-input:focus { border-color: rgba(201, 151, 90, 0.4); }
.co-promo-btn {
  background: transparent;
  border: 1px solid rgba(201, 151, 90, 0.3);
  color: rgba(201, 151, 90, 0.8);
  padding: 10px 16px;
  font-family: 'Montserrat', sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.co-promo-btn:hover {
  background: rgba(201, 151, 90, 0.08);
  border-color: rgba(201, 151, 90, 0.6);
  color: #c9975a;
}

/* totals */
.co-summary-totals {
  padding: 14px 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
.co-tot-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
}
.co-tot-row span:last-child { color: rgba(255, 255, 255, 0.5); font-size: 11px; }
.co-tot-row.free span:last-child { color: rgba(201, 151, 90, 0.7); }
.co-grand-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 14px;
  margin-top: 8px;
  border-top: 1px solid rgba(201, 151, 90, 0.1);
}
.co-grand-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}
.co-grand-amount {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 30px;
  font-weight: 500;
  color: #c9975a;
}

/* security badges */
.co-security {
  padding: 14px 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
}
.co-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: 'Montserrat', sans-serif;
  font-size: 8px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(245, 240, 235, 0.22);
}
.co-badge svg { color: rgba(201, 151, 90, 0.3); }

/* ── Mobile accordion ── */
.co-mobile-summary { display: none; }
.co-accord-btn {
  width: 100%;
  background: #0d0d0d;
  border: 1px solid rgba(201, 151, 90, 0.2);
  border-radius: 3px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c9975a;
  transition: background 0.2s;
  margin-bottom: 20px;
}
.co-accord-btn:hover { background: rgba(201, 151, 90, 0.04); }
.co-accord-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.co-accord-total {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 20px;
  color: #c9975a;
}
.co-accord-arrow {
  width: 18px;
  height: 18px;
  border: 1px solid rgba(201, 151, 90, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.co-accord-btn.open .co-accord-arrow { transform: rotate(180deg); }
.co-accord-panel {
  background: #0d0d0d;
  border: 1px solid rgba(201, 151, 90, 0.12);
  border-radius: 3px;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 24px;
}
.co-accord-panel.open { max-height: 600px; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .co-grid { grid-template-columns: 1fr; }
  .co-sidebar { display: none; }
  .co-mobile-summary { display: block; }
  .co-step-line { width: 28px; }
  .co-step-label { display: none; }
}

@media (max-width: 480px) {
  .co-section-head  { padding: 14px 16px 12px; }
  .co-section-body  { padding: 16px; }
  .co-field-row     { grid-template-columns: 1fr; }
  .co-field-row.triple { grid-template-columns: 1fr; }
  .co-sum-item      { padding: 10px 16px; }
  .co-summary-promo { padding: 4px 16px 14px; }
  .co-summary-totals { padding: 14px 16px; }
  .co-security      { padding: 12px 16px; gap: 12px; }
}
```

---

## Task 4: Create `Checkout.jsx` — Scaffold, Navbar, Breadcrumb, Grid Structure

**Files:**
- Create: `client/src/pages/Checkout.jsx`

- [ ] **Step 1: Create the file with scaffold, imports and local state**

Create `client/src/pages/Checkout.jsx`:

```jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Lock, ArrowRight, Shield, ChevronDown } from 'lucide-react'
import { useCart } from '../context/Cartcontext'
import './Checkout.css'

const API_URL = 'http://localhost:5001'

function resolveUrl(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}

export default function Checkout() {
  const { items, totalPrice, totalCount } = useCart()

  const [shippingMethod, setShippingMethod] = useState('standard')
  const [accordionOpen, setAccordionOpen]   = useState(false)
  const [emailOffers, setEmailOffers]       = useState(true)
  const [saveAddress, setSaveAddress]       = useState(false)
  const [saveCard, setSaveCard]             = useState(false)
  const [promoCode, setPromoCode]           = useState('')

  const shippingCost = shippingMethod === 'express' ? 18 : shippingMethod === 'overnight' ? 38 : 0
  const grandTotal   = totalPrice + shippingCost
  const isFreeShip   = totalPrice >= 500

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="co-nav">
        <Link to="/" className="co-nav-brand">LUNAVE</Link>
        <div className="co-nav-secure">
          <Lock size={12} />
          Secure Checkout
        </div>
      </nav>

      {/* ── Step breadcrumb ── */}
      <div className="co-breadcrumb">
        <div className="co-step active">
          <div className="co-step-num">1</div>
          <span className="co-step-label">Information</span>
        </div>
        <div className="co-step-line" />
        <div className="co-step inactive">
          <div className="co-step-num">2</div>
          <span className="co-step-label">Shipping</span>
        </div>
        <div className="co-step-line" />
        <div className="co-step inactive">
          <div className="co-step-num">3</div>
          <span className="co-step-label">Payment</span>
        </div>
      </div>

      <div className="co-page">

        {/* ── Mobile accordion (hidden on desktop) ── */}
        <MobileAccordion
          items={items}
          totalPrice={totalPrice}
          grandTotal={grandTotal}
          shippingCost={shippingCost}
          isFreeShip={isFreeShip}
          open={accordionOpen}
          setOpen={setAccordionOpen}
        />

        <div className="co-grid">

          {/* ── Left: forms ── */}
          <div className="co-forms">
            <h1 className="co-page-title">Checkout</h1>
            <p className="co-page-sub">Complete your order</p>

            <ContactSection
              emailOffers={emailOffers}
              setEmailOffers={setEmailOffers}
            />

            <ShippingAddressSection
              saveAddress={saveAddress}
              setSaveAddress={setSaveAddress}
            />

            <ShippingMethodSection
              selected={shippingMethod}
              setSelected={setShippingMethod}
              isFreeShip={isFreeShip}
            />

            <PaymentSection
              saveCard={saveCard}
              setSaveCard={setSaveCard}
            />

            <button className="co-place-btn">
              <Lock size={14} />
              Place Order
              <ArrowRight size={14} />
            </button>
            <p className="co-place-note">
              Your personal data will be used to process your order
            </p>
          </div>

          {/* ── Right: sticky sidebar ── */}
          <div className="co-sidebar">
            <OrderSummary
              items={items}
              totalCount={totalCount}
              totalPrice={totalPrice}
              grandTotal={grandTotal}
              shippingCost={shippingCost}
              isFreeShip={isFreeShip}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
            />
          </div>

        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Verify the file exists**

```bash
ls client/src/pages/Checkout.jsx
```

---

## Task 5: Add `ContactSection` and `ShippingAddressSection` to `Checkout.jsx`

**Files:**
- Modify: `client/src/pages/Checkout.jsx` (append sub-components before `export default`)

- [ ] **Step 1: Add the two form section components**

Append these before the `export default Checkout` line in `client/src/pages/Checkout.jsx`:

```jsx
function ContactSection({ emailOffers, setEmailOffers }) {
  return (
    <div className="co-section">
      <div className="co-section-head">
        <div className="co-section-num">01</div>
        <h2 className="co-section-title">Contact Information</h2>
      </div>
      <div className="co-section-body">
        <div className="co-field-row">
          <div className="co-field">
            <label className="co-label">First Name</label>
            <input className="co-input" type="text" placeholder="Elena" autoComplete="given-name" />
          </div>
          <div className="co-field">
            <label className="co-label">Last Name</label>
            <input className="co-input" type="text" placeholder="Moreau" autoComplete="family-name" />
          </div>
        </div>
        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">Email Address</label>
            <input className="co-input" type="email" placeholder="elena@example.com" autoComplete="email" />
          </div>
        </div>
        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">Phone Number</label>
            <input className="co-input" type="tel" placeholder="+1 (000) 000-0000" autoComplete="tel" />
          </div>
        </div>
        <div className="co-check-row" onClick={() => setEmailOffers(v => !v)}>
          <Checkbox checked={emailOffers} />
          <span className="co-check-label">Email me with news and exclusive offers</span>
        </div>
      </div>
    </div>
  )
}

function ShippingAddressSection({ saveAddress, setSaveAddress }) {
  return (
    <div className="co-section">
      <div className="co-section-head">
        <div className="co-section-num">02</div>
        <h2 className="co-section-title">Shipping Address</h2>
      </div>
      <div className="co-section-body">
        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">Address Line 1</label>
            <input className="co-input" type="text" placeholder="Street address" autoComplete="address-line1" />
          </div>
        </div>
        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">
              Address Line 2 <span className="co-label-opt">(optional)</span>
            </label>
            <input className="co-input" type="text" placeholder="Apartment, suite, unit, etc." autoComplete="address-line2" />
          </div>
        </div>
        <div className="co-field-row">
          <div className="co-field">
            <label className="co-label">City</label>
            <input className="co-input" type="text" placeholder="Paris" autoComplete="address-level2" />
          </div>
          <div className="co-field">
            <label className="co-label">State / Province</label>
            <input className="co-input" type="text" placeholder="Île-de-France" autoComplete="address-level1" />
          </div>
        </div>
        <div className="co-field-row">
          <div className="co-field">
            <label className="co-label">ZIP / Postal Code</label>
            <input className="co-input" type="text" placeholder="75001" autoComplete="postal-code" />
          </div>
          <div className="co-field">
            <label className="co-label">Country</label>
            <select className="co-select" autoComplete="country-name">
              <option>France</option>
              <option>United States</option>
              <option>United Kingdom</option>
              <option>UAE</option>
              <option>India</option>
              <option>Germany</option>
              <option>Italy</option>
              <option>Japan</option>
            </select>
          </div>
        </div>
        <div className="co-check-row" onClick={() => setSaveAddress(v => !v)}>
          <Checkbox checked={saveAddress} />
          <span className="co-check-label">Save this address for future orders</span>
        </div>
      </div>
    </div>
  )
}
```

---

## Task 6: Add `ShippingMethodSection` and `PaymentSection` to `Checkout.jsx`

**Files:**
- Modify: `client/src/pages/Checkout.jsx` (append sub-components)

- [ ] **Step 1: Add the two components**

Append after `ShippingAddressSection` in `client/src/pages/Checkout.jsx`:

```jsx
const SHIPPING_OPTIONS = [
  { id: 'standard',  label: 'Standard Delivery', days: '5 – 8 business days', price: 0 },
  { id: 'express',   label: 'Express Delivery',  days: '2 – 3 business days', price: 18 },
  { id: 'overnight', label: 'Overnight',          days: 'Next business day',   price: 38 },
]

function ShippingMethodSection({ selected, setSelected, isFreeShip }) {
  return (
    <div className="co-section">
      <div className="co-section-head">
        <div className="co-section-num">03</div>
        <h2 className="co-section-title">Shipping Method</h2>
      </div>
      <div className="co-section-body">
        <div className="co-ship-options">
          {SHIPPING_OPTIONS.map(opt => (
            <div
              key={opt.id}
              className={`co-ship-opt${selected === opt.id ? ' selected' : ''}`}
              onClick={() => setSelected(opt.id)}
            >
              <div className="co-ship-opt-left">
                <div className="co-radio" />
                <div>
                  <div className="co-ship-name">{opt.label}</div>
                  <div className="co-ship-days">{opt.days}</div>
                </div>
              </div>
              {opt.id === 'standard' && isFreeShip ? (
                <span className="co-ship-price free">Free</span>
              ) : opt.price === 0 ? (
                <span className="co-ship-price free">Free</span>
              ) : (
                <span className="co-ship-price">${opt.price}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PaymentSection({ saveCard, setSaveCard }) {
  return (
    <div className="co-section">
      <div className="co-section-head">
        <div className="co-section-num">04</div>
        <h2 className="co-section-title">Payment</h2>
      </div>
      <div className="co-section-body">

        {/* Static payment logos */}
        <div className="co-pay-logos">
          <div className="co-pay-logo visa">VISA</div>
          <div className="co-pay-logo mc">
            <span className="mc-left" />
            <span className="mc-right" />
          </div>
          <div className="co-pay-logo amex">AMEX</div>
          <div className="co-pay-logo paypal">
            <span className="pp-blue">Pay</span>
            <span className="pp-cyan">Pal</span>
          </div>
          <div className="co-pay-logo apple">&#63743; Pay</div>
          <div className="co-pay-logo gpay">
            <span className="g">G</span>
            <span className="o1">o</span>
            <span className="o2">o</span>
            <span className="g2">g</span>
            <span className="le">le</span>
            &nbsp;Pay
          </div>
        </div>

        {/* Divider */}
        <div className="co-divider">
          <div className="co-divider-line" />
          <span className="co-divider-text">Card Details</span>
          <div className="co-divider-line" />
        </div>

        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">Name on Card</label>
            <input className="co-input" type="text" placeholder="Elena Moreau" autoComplete="cc-name" />
          </div>
        </div>
        <div className="co-field-row single">
          <div className="co-field">
            <label className="co-label">Card Number</label>
            <div className="co-card-input-wrap">
              <input
                className="co-input"
                type="text"
                placeholder="0000  0000  0000  0000"
                maxLength={19}
                autoComplete="cc-number"
              />
              <span className="co-card-icon">••••</span>
            </div>
          </div>
        </div>
        <div className="co-field-row triple">
          <div className="co-field">
            <label className="co-label">Month</label>
            <select className="co-select" autoComplete="cc-exp-month">
              <option value="">MM</option>
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, '0')
                return <option key={m} value={m}>{m}</option>
              })}
            </select>
          </div>
          <div className="co-field">
            <label className="co-label">Year</label>
            <select className="co-select" autoComplete="cc-exp-year">
              <option value="">YYYY</option>
              {[2026,2027,2028,2029,2030,2031].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="co-field">
            <label className="co-label">CVV</label>
            <input
              className="co-input"
              type="text"
              placeholder="•••"
              maxLength={4}
              autoComplete="cc-csc"
            />
          </div>
        </div>

        <div className="co-check-row" onClick={() => setSaveCard(v => !v)}>
          <Checkbox checked={saveCard} />
          <span className="co-check-label">Save card for future purchases</span>
        </div>

      </div>
    </div>
  )
}
```

---

## Task 7: Add `OrderSummary`, `MobileAccordion`, and `Checkbox` to `Checkout.jsx`

**Files:**
- Modify: `client/src/pages/Checkout.jsx` (append sub-components)

- [ ] **Step 1: Add the remaining sub-components**

Append to `client/src/pages/Checkout.jsx`:

```jsx
function Checkbox({ checked }) {
  return (
    <div className={`co-checkbox${checked ? ' checked' : ''}`}>
      {checked && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#c9975a" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
  )
}

function SummaryItemList({ items }) {
  return (
    <div className="co-summary-items">
      {items.map(item => {
        const imgUrl = resolveUrl(item.image)
        return (
          <div key={item._id} className="co-sum-item">
            <div className="co-sum-thumb">
              {imgUrl
                ? <img src={imgUrl} alt={item.name} className="co-sum-thumb-img" onError={e => { e.currentTarget.style.display = 'none' }} />
                : null
              }
              <div className="co-sum-qty-badge">{item.quantity}</div>
            </div>
            <div className="co-sum-info">
              <div className="co-sum-name">{item.name}</div>
              {item.volume && <div className="co-sum-vol">{item.volume}ml · Eau de Parfum</div>}
            </div>
            <div className="co-sum-price">${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        )
      })}
    </div>
  )
}

function SummaryTotals({ totalPrice, grandTotal, shippingCost, isFreeShip }) {
  return (
    <div className="co-summary-totals">
      <div className="co-tot-row">
        <span>Subtotal</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
      <div className={`co-tot-row${isFreeShip || shippingCost === 0 ? ' free' : ''}`}>
        <span>Shipping</span>
        <span>{isFreeShip || shippingCost === 0 ? 'Free' : `$${shippingCost}`}</span>
      </div>
      <div className="co-tot-row">
        <span>Tax</span>
        <span>Calculated at next step</span>
      </div>
      <div className="co-grand-total">
        <span className="co-grand-label">Total</span>
        <span className="co-grand-amount">${grandTotal.toFixed(2)}</span>
      </div>
    </div>
  )
}

function OrderSummary({ items, totalCount, totalPrice, grandTotal, shippingCost, isFreeShip, promoCode, setPromoCode }) {
  return (
    <div className="co-summary">
      <div className="co-summary-head">
        <span className="co-summary-title">Your Order</span>
        <span className="co-summary-count">{totalCount} {totalCount === 1 ? 'Item' : 'Items'}</span>
      </div>

      <SummaryItemList items={items} />

      <div className="co-summary-promo">
        <label className="co-label">Promo Code</label>
        <div className="co-promo-row">
          <input
            className="co-promo-input"
            type="text"
            placeholder="Enter code"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
          />
          <button className="co-promo-btn">Apply</button>
        </div>
      </div>

      <SummaryTotals
        totalPrice={totalPrice}
        grandTotal={grandTotal}
        shippingCost={shippingCost}
        isFreeShip={isFreeShip}
      />

      <div className="co-security">
        <div className="co-badge">
          <Shield size={10} />
          SSL Secured
        </div>
        <div className="co-badge">
          <Lock size={10} />
          256-bit Encryption
        </div>
        <div className="co-badge">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          PCI Compliant
        </div>
      </div>
    </div>
  )
}

function MobileAccordion({ items, totalPrice, grandTotal, shippingCost, isFreeShip, open, setOpen }) {
  return (
    <div className="co-mobile-summary">
      <button
        className={`co-accord-btn${open ? ' open' : ''}`}
        onClick={() => setOpen(v => !v)}
      >
        <span>Order Summary</span>
        <div className="co-accord-right">
          <span className="co-accord-total">${grandTotal.toFixed(2)}</span>
          <div className="co-accord-arrow">
            <ChevronDown size={10} />
          </div>
        </div>
      </button>
      <div className={`co-accord-panel${open ? ' open' : ''}`}>
        <SummaryItemList items={items} />
        <SummaryTotals
          totalPrice={totalPrice}
          grandTotal={grandTotal}
          shippingCost={shippingCost}
          isFreeShip={isFreeShip}
        />
      </div>
    </div>
  )
}
```

---

## Task 8: Register Route in `App.jsx`

**Files:**
- Modify: `client/src/App.jsx`

- [ ] **Step 1: Add the Checkout import and route**

In `client/src/App.jsx`, add the import after the existing page imports:

```jsx
import Checkout from './pages/Checkout.jsx'
```

Then add the route inside `<Routes>`, after the existing routes:

```jsx
<Route path="/checkout" element={<Checkout />} />
```

The final `<Routes>` block should look like:

```jsx
<Routes>
  <Route path="/"         element={<HomePage />} />
  <Route path="/admin/*"  element={<AdminApp />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login"    element={<Login />} />
  <Route path="/profile"  element={<Profile />} />
  <Route path="/checkout" element={<Checkout />} />
</Routes>
```

- [ ] **Step 2: Verify the dev server starts without errors**

```bash
cd client && npm run dev
```

Expected: Vite starts, no import or compile errors in the terminal.

- [ ] **Step 3: Smoke test in the browser**

1. Open `http://localhost:5173/checkout`
2. Verify the page renders with navbar, breadcrumb, all 4 form sections, and the order summary sidebar
3. Click shipping options — confirm selection highlights change
4. Resize to mobile width (< 768px) — confirm sidebar hides and gold accordion appears
5. Click the accordion button — confirm it opens and closes with animation
6. Click "Proceed to Checkout" in the CartDrawer (from any page) — confirm it navigates to `/checkout`

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/Checkout.jsx client/src/pages/Checkout.css client/src/App.jsx
git commit -m "feat: add /checkout page with split layout, cart integration, mobile accordion"
```

---

## Self-Review

**Spec coverage:**
- ✅ Two-column split desktop layout (`co-grid`)
- ✅ Sticky order summary sidebar
- ✅ Mobile collapses to single column + gold accordion
- ✅ Navbar strip with brand + secure lock
- ✅ Step breadcrumb (visual only)
- ✅ Contact, Shipping Address, Shipping Method, Payment form sections
- ✅ Static payment logos (Visa, MC, Amex, PayPal, Apple Pay, Google Pay)
- ✅ Card fields (name, number, expiry month/year, CVV)
- ✅ Promo code input (UI only)
- ✅ Order summary reads from `useCart()` context
- ✅ Security badges
- ✅ Place Order gold CTA button
- ✅ Route added in `App.jsx`
- ✅ CSS in separate file (`Checkout.css`), JSX in `Checkout.jsx`
- ✅ Brand tokens: `#0a0a0a`, `#c9975a`, Cormorant Garamond, Montserrat

**Placeholder scan:** No TBD, no TODO, all code blocks complete. ✅

**Type/name consistency:**
- `resolveUrl` defined at top of `Checkout.jsx`, used in `SummaryItemList` ✅
- `SummaryTotals` defined before `OrderSummary` and `MobileAccordion` (both use it) ✅
- `Checkbox` defined before `ContactSection`, `ShippingAddressSection`, `PaymentSection` ✅
- Props passed to `MobileAccordion` and `OrderSummary` match their function signatures ✅
