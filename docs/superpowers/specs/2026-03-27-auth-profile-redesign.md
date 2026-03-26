# Auth & Profile Pages Redesign — Lunave

**Date:** 2026-03-27
**Status:** Approved
**Scope:** Login, Register, and Profile/Account pages

---

## Overview

Redesign the three bare-bones auth/profile pages to match Lunave's luxury dark perfume brand — using the existing CSS variables, fonts, and design language from `index.css`. The redesign is mobile-first given that most Lunave users are expected to browse on mobile.

---

## Brand Reference

From `client/src/index.css`:

| Token | Value |
|---|---|
| `--black` | `#0a0a0a` |
| `--dark` | `#111111` |
| `--dark-card` | `#161616` |
| `--dark-border` | `#222222` |
| `--gold` | `#c9975a` |
| `--gold-light` | `#e8b97a` |
| `--gold-glow` | `rgba(201,151,90,0.3)` |
| `--white` | `#f5f0eb` |
| `--white-dim` | `rgba(245,240,235,0.7)` |
| `--font-display` | `Cormorant Garamond, serif` |
| `--font-body` | `Montserrat, sans-serif` |

---

## Pages

### 1. Login Page

**Layout:** Split screen on desktop, stacked on mobile.

**Desktop:**
- Left panel (42% width): warm dark gradient background (`#100e0a → #1a1510`), radial gold glow decorations, Lunave italic logo in gold (42px Cormorant Garamond), tagline "Luxury Perfumery" in small uppercase Montserrat, gold ornament (lines + diamond), and an italic brand quote.
- Right panel (flex 1): black background, form centered max-width 320px.

**Form:**
- Title: "Welcome Back" in Cormorant Garamond 30px light
- Subtitle: "Sign in to your account" in Montserrat 12px dim
- Fields: Email, Password — underline-only style (no box border), uppercase 10px label above each, gold focus state on underline
- Submit button: full-width gold (`--gold`), uppercase Montserrat, "Sign In →"
- Switch link: "Don't have an account? **Create one here**" — gold underlined link navigates to `/register`

**Mobile (≤768px):**
- Left panel collapses into a compact brand header at the top (logo + gold ornament divider)
- Form stacks below with same field styles
- No horizontal split — single column full-screen

---

### 2. Register Page

Same layout and structure as Login. Differences:

- Title: "Create Account"
- Subtitle: "Join the House of Lunave"
- Fields: Full Name, Email, Password
- Submit button: "Create Account →"
- Switch link: "Already have an account? **Login here**" — navigates to `/login`

---

### 3. Profile / Account Page

**Layout:** Editorial Stacked (C). Mobile-first vertical flow.

**Sections (top to bottom):**

#### Hero Section
- Warm dark gradient background (`#0f0d0a → #141108 → #0a0a0a`) with subtle radial gold glow top-right
- Large avatar circle (64px): gold border, gold initial letter in Cormorant Garamond
- User name in Cormorant Garamond 26px light
- Email in Montserrat 12px dim
- "Lunave Member" gold badge (gold dot + text, gold border, subtle gold bg)
- "Sign Out" ghost button aligned right — triggers logout and redirects to `/`

#### Stats Bar
Three equal columns separated by `--dark-border`:
- **Orders** — count of user's orders
- **Total Spent** — sum of all order totals formatted as `₹X,XXX`
- **Member Since** — formatted as `Mon 'YY` (e.g. "Mar '26")
- Values in Cormorant Garamond 24px gold; labels in Montserrat 9px uppercase dim

Stats are computed from the existing `orders` array fetched from `/api/orders/my`.

#### Order History Section
- Section heading: "Order History" in gold uppercase Montserrat, with a gold line extending to the right
- Loading state: "Loading orders…" text
- Empty state: italic Cormorant Garamond "No orders placed yet." centered
- Each order as a card:
  - Left gold accent border (2px)
  - Order ID: last 6 chars of `_id` uppercased, in gold Montserrat
  - Date: `toLocaleDateString()`
  - Total: `₹X,XXX.XX` in Cormorant Garamond serif
  - Status badge: green tint for "Delivered", gold tint for anything else

**Mobile:**
- All sections already stack vertically — no layout changes needed
- Stats bar shrinks font slightly; order cards remain full width

---

## Implementation Notes

- All styles go inline (JSX `style` props or a new `Auth.css` / `Profile.css`) — do NOT pollute `index.css` with page-specific rules unless they reuse existing class patterns
- Reuse existing CSS variables (`var(--gold)`, `var(--font-display)`, etc.) — no hardcoded colors
- Keep all existing JS logic (form submit handlers, `useAuth`, `useNavigate`, order fetch) unchanged — this is purely a visual redesign
- The `<Link>` from `react-router-dom` should be used for the login ↔ register switch links
- Add `padding-top: var(--nav-height)` to auth pages so content clears the fixed navbar
- Profile page already has `padding-top` via `.profile-page` class in `index.css` — update that class or override inline

---

## Files to Change

| File | Change |
|---|---|
| `client/src/pages/Login.jsx` | Full redesign — new JSX structure + inline styles |
| `client/src/pages/Register.jsx` | Full redesign — new JSX structure + inline styles |
| `client/src/pages/Profile.jsx` | Full redesign — new JSX structure + inline styles; compute stats from orders array |
| `client/src/index.css` | Update `.profile-page`, `.profile-avatar`, `.btn-logout`, `.orders-table` classes to match new design, or remove and replace with inline styles |

---

## Out of Scope

- No new routes or API endpoints
- No edit profile functionality
- No password change
- No pagination for orders
