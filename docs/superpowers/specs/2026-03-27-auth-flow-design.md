# Auth Flow Design

**Date:** 2026-03-27
**Status:** Approved

## Overview

Wire up a complete authentication flow: register → login → home, persistent auth state across refreshes, dynamic navbar avatar, and a profile page with order history.

## 1. AuthContext — Persistence

`AuthContext` currently holds `user` and `token` only in memory, so a page refresh logs the user out.

**Changes:**
- On `login(data)`: save `user` and `token` to `localStorage`
- On `logout()`: remove both keys from `localStorage`
- On mount (`useEffect`): read from `localStorage` and hydrate state if values exist

No backend changes required. Token expiry is not handled at this stage (out of scope).

## 2. Auth Flow — Register → Login → Home

**Register (`/register`):**
- On success: show toast "Account created", then redirect to `/login` via `useNavigate`
- Remove the current auto-login behaviour (`login(data)` call removed)

**Login (`/login`):**
- On success: call `login(data)`, show toast "Login successful", then redirect to `/` via `useNavigate`

## 3. Navbar

**Not logged in:**
- User icon links to `/login` (changed from current `/register`)

**Logged in:**
- Replace `<User>` icon with a circular avatar showing `user.name[0].toUpperCase()`
- Avatar is a `<Link to="/profile">`
- Styled as a small filled circle (e.g. 32px, brand colour background, white letter)

## 4. Profile Page (`/profile`)

New page registered at `/profile` in `App.jsx`.

**Guard:** If `user` is null (not logged in), redirect to `/login`.

**Content:**
- User's name and email
- Logout button — calls `logout()` then navigates to `/`
- Order history — fetched from `GET /api/orders/my` with `Authorization: Bearer <token>` header, displayed as a list showing: order ID (short), date, total price, status

**No separate profile-edit functionality** — display only at this stage.

## Files Affected

| File | Change |
|------|--------|
| `client/src/context/AuthContext.jsx` | Add localStorage hydration, persist on login/logout |
| `client/src/pages/Register.jsx` | Remove auto-login, redirect to `/login` on success |
| `client/src/pages/Login.jsx` | Redirect to `/` on success |
| `client/src/components/Navbar.jsx` | Conditional avatar vs User icon |
| `client/src/pages/Profile.jsx` | New file — profile + orders + logout |
| `client/src/App.jsx` | Add `/profile` route |

## Out of Scope

- Token refresh / expiry handling
- Profile editing (name, password)
- Wishlist page
- Order detail page
