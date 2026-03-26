# Auth & Profile Pages Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Login, Register, and Profile pages to match Lunave's luxury dark perfume brand — split-screen auth on desktop, stacked on mobile, editorial stacked profile with stats bar and order cards.

**Architecture:** All styling via two new CSS files (`Auth.css`, `Profile.css`) that use the existing CSS variables from `index.css`. JSX structure is rewritten per page; all existing JS logic (API calls, `useAuth`, `useNavigate`) stays untouched. Old profile classes in `index.css` are removed.

**Tech Stack:** React 18, React Router DOM v6, CSS modules (plain CSS files imported per page), existing `lucide-react` icon library

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `client/src/styles/Auth.css` | All styles for Login & Register pages |
| Create | `client/src/styles/Profile.css` | All styles for Profile page |
| Modify | `client/src/pages/Login.jsx` | New JSX structure; same API logic |
| Modify | `client/src/pages/Register.jsx` | New JSX structure; same API logic |
| Modify | `client/src/pages/Profile.jsx` | New JSX + compute stats from orders array |
| Modify | `client/src/index.css` | Remove old profile classes (lines 1097–1156) |

---

## Task 1: Create Auth.css

**Files:**
- Create: `client/src/styles/Auth.css`

- [ ] **Step 1: Create the file with all auth styles**

```css
/* ============================================
   AUTH PAGES — Login & Register
   Uses CSS variables from index.css
   ============================================ */

.auth-page {
  min-height: 100vh;
  display: flex;
}

/* ── Left brand panel ── */
.auth-left {
  width: 42%;
  background: linear-gradient(160deg, #100e0a 0%, #1a1510 40%, #120f0c 100%);
  border-right: 1px solid #2a2210;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 36px;
  position: relative;
  overflow: hidden;
}

.auth-left::before {
  content: '';
  position: absolute;
  top: -100px; left: -100px;
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(201,151,90,0.06) 0%, transparent 65%);
  pointer-events: none;
}

.auth-left::after {
  content: '';
  position: absolute;
  bottom: -60px; right: -60px;
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(201,151,90,0.04) 0%, transparent 65%);
  pointer-events: none;
}

.auth-brand {
  position: relative;
  z-index: 2;
  text-align: center;
}

.auth-logo {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 48px;
  font-weight: 300;
  color: var(--gold);
  letter-spacing: 0.12em;
  margin-bottom: 10px;
  display: block;
  text-decoration: none;
}

.auth-tagline {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: rgba(201, 151, 90, 0.5);
  margin-bottom: 32px;
}

.auth-ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.auth-ornament-line {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,151,90,0.4));
}

.auth-ornament-line.right {
  background: linear-gradient(90deg, rgba(201,151,90,0.4), transparent);
}

.auth-ornament-diamond {
  width: 6px;
  height: 6px;
  background: var(--gold);
  transform: rotate(45deg);
  opacity: 0.6;
}

.auth-quote {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 15px;
  font-weight: 300;
  color: rgba(245, 240, 235, 0.35);
  line-height: 1.85;
  text-align: center;
  max-width: 240px;
}

/* ── Right form panel ── */
.auth-right {
  flex: 1;
  background: var(--black);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 44px;
}

.auth-form-inner {
  width: 100%;
  max-width: 340px;
}

.auth-form-title {
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 300;
  color: var(--white);
  margin-bottom: 6px;
}

.auth-form-sub {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--white-dim);
  margin-bottom: 36px;
}

.auth-field {
  margin-bottom: 24px;
}

.auth-label {
  display: block;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(245, 240, 235, 0.38);
  margin-bottom: 8px;
}

.auth-input {
  width: 100%;
  padding: 12px 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--dark-border);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 300;
  outline: none;
  transition: border-color 0.3s;
}

.auth-input:focus {
  border-bottom-color: var(--gold);
}

.auth-input::placeholder {
  color: rgba(245, 240, 235, 0.15);
}

.auth-submit {
  width: 100%;
  padding: 15px;
  background: var(--gold);
  color: var(--black);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  margin-top: 8px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.auth-submit::before {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
  transition: left 0.5s;
}

.auth-submit:hover::before { left: 100%; }
.auth-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px var(--gold-glow);
}

.auth-switch {
  text-align: center;
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--white-dim);
}

.auth-switch a {
  color: var(--gold);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ── Mobile: stack vertically ── */
@media (max-width: 768px) {
  .auth-page {
    flex-direction: column;
  }

  .auth-left {
    width: 100%;
    padding: 32px 24px 24px;
    border-right: none;
    border-bottom: 1px solid #2a2210;
  }

  .auth-left::before,
  .auth-left::after { display: none; }

  .auth-logo { font-size: 32px; margin-bottom: 8px; }
  .auth-tagline { margin-bottom: 16px; }
  .auth-ornament { margin-bottom: 0; }
  .auth-quote { display: none; }

  .auth-right {
    padding: 36px 24px 48px;
    align-items: flex-start;
  }
}
```

- [ ] **Step 2: Verify the file exists**

```bash
ls client/src/styles/
```
Expected: `Auth.css  Hero.css` (and any other existing files)

---

## Task 2: Redesign Login.jsx

**Files:**
- Modify: `client/src/pages/Login.jsx`

- [ ] **Step 1: Replace the file contents**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import '../styles/Auth.css'

const API_URL = 'http://localhost:5001'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        login(data)
        toast.success('Welcome back!')
        navigate('/')
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="auth-page">
      {/* Brand panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">Lunave</Link>
          <div className="auth-tagline">Luxury Perfumery</div>
          <div className="auth-ornament">
            <div className="auth-ornament-line"></div>
            <div className="auth-ornament-diamond"></div>
            <div className="auth-ornament-line right"></div>
          </div>
          <p className="auth-quote">
            "A fragrance is the invisible part of your personality."
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-right">
        <div className="auth-form-inner">
          <h1 className="auth-form-title">Welcome Back</h1>
          <p className="auth-form-sub">Sign in to your account</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="auth-submit" type="submit">
              Sign In →
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register">Create one here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Open browser and navigate to `/login`**

Verify:
- Split-screen layout on desktop (brand left, form right)
- Logo links back to homepage
- Underline inputs with gold focus state
- Gold submit button with shimmer hover
- "Create one here" link navigates to `/register`
- On mobile (devtools < 768px): collapses to stacked layout, quote hidden

- [ ] **Step 3: Commit**

```bash
git add client/src/styles/Auth.css client/src/pages/Login.jsx
git commit -m "feat: redesign login page with split-screen brand layout"
```

---

## Task 3: Redesign Register.jsx

**Files:**
- Modify: `client/src/pages/Register.jsx`

- [ ] **Step 1: Replace the file contents**

```jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import '../styles/Auth.css'

const API_URL = 'http://localhost:5001'

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Account created! Please log in.')
        navigate('/login')
      } else {
        throw new Error(data.message)
      }
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="auth-page">
      {/* Brand panel */}
      <div className="auth-left">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">Lunave</Link>
          <div className="auth-tagline">Luxury Perfumery</div>
          <div className="auth-ornament">
            <div className="auth-ornament-line"></div>
            <div className="auth-ornament-diamond"></div>
            <div className="auth-ornament-line right"></div>
          </div>
          <p className="auth-quote">
            "Wear your story. Let your scent speak first."
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="auth-right">
        <div className="auth-form-inner">
          <h1 className="auth-form-title">Create Account</h1>
          <p className="auth-form-sub">Join the House of Lunave</p>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Full Name</label>
              <input
                className="auth-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Email Address</label>
              <input
                className="auth-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                className="auth-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="auth-submit" type="submit">
              Create Account →
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Open browser and navigate to `/register`**

Verify:
- Same split-screen layout as login, different quote on left panel
- Three fields: Full Name, Email, Password
- "Login here" link navigates to `/login`
- Mobile: collapses to stacked

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/Register.jsx
git commit -m "feat: redesign register page with brand split-screen layout"
```

---

## Task 4: Create Profile.css

**Files:**
- Create: `client/src/styles/Profile.css`

- [ ] **Step 1: Create the file**

```css
/* ============================================
   PROFILE / ACCOUNT PAGE
   Uses CSS variables from index.css
   ============================================ */

.profile-page {
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--black);
}

/* ── Hero section ── */
.profile-hero {
  background: linear-gradient(160deg, #0f0d0a 0%, #141108 60%, #0a0a0a 100%);
  border-bottom: 1px solid #252010;
  padding: 48px clamp(24px, 5vw, 60px) 40px;
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
  overflow: hidden;
  flex-wrap: wrap;
}

.profile-hero::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 350px; height: 350px;
  background: radial-gradient(circle, rgba(201,151,90,0.05) 0%, transparent 65%);
  pointer-events: none;
}

.profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1510, #2a2018);
  border: 1px solid rgba(201, 151, 90, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 400;
  color: var(--gold);
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}

.profile-info {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 2;
}

.profile-name {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 300;
  color: var(--white);
  margin-bottom: 4px;
}

.profile-email {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--white-dim);
  margin-bottom: 12px;
}

.profile-member-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(201, 151, 90, 0.08);
  border: 1px solid rgba(201, 151, 90, 0.22);
  padding: 5px 14px;
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
}

.profile-member-badge::before {
  content: '';
  width: 4px;
  height: 4px;
  background: var(--gold);
  border-radius: 50%;
}

.profile-logout-btn {
  padding: 9px 20px;
  background: transparent;
  border: 1px solid var(--dark-border);
  color: var(--white-dim);
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.3s, color 0.3s;
  align-self: flex-start;
  position: relative;
  z-index: 2;
}

.profile-logout-btn:hover {
  border-color: rgba(220, 80, 80, 0.45);
  color: rgba(220, 80, 80, 0.75);
}

/* ── Stats bar ── */
.profile-stats {
  display: flex;
  border-bottom: 1px solid var(--dark-border);
  background: var(--dark);
}

.profile-stat {
  flex: 1;
  padding: 20px 0;
  text-align: center;
  border-right: 1px solid var(--dark-border);
}

.profile-stat:last-child { border-right: none; }

.profile-stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 300;
  color: var(--gold);
  margin-bottom: 4px;
}

.profile-stat-label {
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245, 240, 235, 0.32);
}

/* ── Order history ── */
.profile-orders {
  padding: clamp(24px, 4vw, 48px) clamp(24px, 5vw, 60px);
  max-width: 920px;
}

.profile-orders-heading {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.profile-orders-heading::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--dark-border);
}

.profile-order-card {
  display: flex;
  align-items: center;
  gap: clamp(12px, 2vw, 20px);
  padding: 16px 18px;
  background: var(--dark-card);
  border: 1px solid var(--dark-border);
  border-left: 2px solid rgba(201, 151, 90, 0.4);
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.order-id {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  color: var(--gold);
  letter-spacing: 0.08em;
  min-width: 80px;
}

.order-date {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--white-dim);
  flex: 1;
  min-width: 80px;
}

.order-total {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 300;
  color: var(--white);
  min-width: 90px;
  text-align: right;
}

.order-status-badge {
  padding: 4px 12px;
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  min-width: 84px;
  text-align: center;
}

.order-status-badge.delivered {
  background: rgba(100, 180, 100, 0.08);
  border: 1px solid rgba(100, 180, 100, 0.28);
  color: #7cc87c;
}

.order-status-badge.other {
  background: rgba(201, 151, 90, 0.08);
  border: 1px solid rgba(201, 151, 90, 0.25);
  color: var(--gold);
}

.profile-empty {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 16px;
  color: rgba(245, 240, 235, 0.25);
  text-align: center;
  padding: 48px 0;
}

.profile-loading {
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--white-dim);
  letter-spacing: 0.08em;
  padding: 24px 0;
}

/* ── Responsive ── */
@media (max-width: 640px) {
  .profile-hero { padding: 32px 20px 28px; }
  .profile-stat-value { font-size: 20px; }
  .profile-order-card { padding: 12px 14px; }
  .order-total { text-align: left; min-width: unset; }
}
```

- [ ] **Step 2: Verify the file exists**

```bash
ls client/src/styles/
```
Expected: `Auth.css  Hero.css  Profile.css`

---

## Task 5: Redesign Profile.jsx

**Files:**
- Modify: `client/src/pages/Profile.jsx`

- [ ] **Step 1: Replace the file contents**

```jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import '../styles/Profile.css'

const API_URL = 'http://localhost:5001'

export default function Profile() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user, navigate])

  useEffect(() => {
    if (!token) return
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders/my`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (data.success) {
          setOrders(data.orders)
        } else {
          throw new Error(data.message)
        }
      } catch {
        toast.error('Failed to load orders')
      } finally {
        setLoadingOrders(false)
      }
    }
    fetchOrders()
  }, [token])

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/')
  }

  // Compute stats from orders
  const totalSpent = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
  const memberSince = user
    ? new Date(user.createdAt || Date.now()).toLocaleDateString('en-IN', {
        month: 'short',
        year: '2-digit',
      })
    : '—'

  if (!user) return null

  return (
    <div className="profile-page">
      {/* Hero */}
      <div className="profile-hero">
        <div className="profile-avatar">
          {user.name[0].toUpperCase()}
        </div>
        <div className="profile-info">
          <div className="profile-name">{user.name}</div>
          <div className="profile-email">{user.email}</div>
          <div className="profile-member-badge">Lunave Member</div>
        </div>
        <button className="profile-logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </div>

      {/* Stats bar */}
      <div className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-value">{orders.length}</span>
          <span className="profile-stat-label">Orders</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">
            ₹{totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </span>
          <span className="profile-stat-label">Total Spent</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{memberSince}</span>
          <span className="profile-stat-label">Member Since</span>
        </div>
      </div>

      {/* Order history */}
      <section className="profile-orders">
        <div className="profile-orders-heading">Order History</div>

        {loadingOrders ? (
          <p className="profile-loading">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="profile-empty">No orders placed yet.</p>
        ) : (
          orders.map((order) => (
            <div className="profile-order-card" key={order._id}>
              <div className="order-id">
                #{order._id.slice(-6).toUpperCase()}
              </div>
              <div className="order-date">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
              <div className="order-total">
                ₹{order.totalPrice?.toFixed(2)}
              </div>
              <div
                className={`order-status-badge ${
                  order.orderStatus?.toLowerCase() === 'delivered'
                    ? 'delivered'
                    : 'other'
                }`}
              >
                {order.orderStatus}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Open browser and navigate to `/profile` (while logged in)**

Verify:
- Hero: avatar with gold border, name, email, "Lunave Member" badge, Sign Out button
- Stats bar: 3 columns (Orders, Total Spent, Member Since) in gold serif numbers
- Order cards: gold left border, ID in gold, date, price in serif, status badge
- "Delivered" orders show green badge; others show gold badge
- Not logged in → redirects to `/login`

- [ ] **Step 3: Commit**

```bash
git add client/src/styles/Profile.css client/src/pages/Profile.jsx
git commit -m "feat: redesign profile page with stats bar and order cards"
```

---

## Task 6: Clean up old profile styles from index.css

**Files:**
- Modify: `client/src/index.css` — remove lines 1097–1156 (old `.profile-page`, `.profile-header`, `.profile-avatar`, `.btn-logout`, `.profile-orders`, `.orders-table` classes)

- [ ] **Step 1: Remove the old profile class block**

Open `client/src/index.css` and delete everything from the `.nav-avatar` block downward that relates to the old profile styles. Specifically remove these classes (they are now replaced by `Profile.css`):

- `.profile-page`
- `.profile-header`
- `.profile-avatar`
- `.btn-logout`
- `.profile-orders h3`
- `.orders-table`
- `.orders-table th, .orders-table td`
- `.orders-table th`

Keep `.nav-avatar` — it's used by the Navbar component, not the profile page.

The section to remove starts at:
```css
.profile-page {
  max-width: 800px;
  margin: 80px auto;
```
and ends at:
```css
.orders-table th {
  font-weight: 600;
  color: #555;
}
```

- [ ] **Step 2: Verify no visual regression on homepage**

Visit `/` — navbar, hero, collections, best sellers, footer should all look unchanged.

- [ ] **Step 3: Verify profile page still looks correct**

Visit `/profile` — the new `Profile.css` styles should apply cleanly.

- [ ] **Step 4: Commit**

```bash
git add client/src/index.css
git commit -m "chore: remove superseded profile styles from index.css"
```

---

## Done

All three pages redesigned. Verify the full flow end-to-end:
1. Visit `/register` → create account → redirects to `/login`
2. Visit `/login` → log in → redirects to `/`
3. Click avatar in navbar → goes to `/profile` → shows stats + orders
4. Click "Sign Out" → logs out → redirects to `/`
5. Resize to mobile width (≤ 768px) → auth pages stack, profile page flows vertically
