// Navbar.jsx — updated to wire cart icon → CartDrawer
// Changes from your original: import useCart, update ShoppingBag button, live badge

import { useState, useEffect } from 'react'
import { Search, User, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalCount, setOpen: openCart } = useCart()   // ← NEW
  const { user } = useAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = ['Home', 'Shop', 'About us', 'Services', 'Blog']

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <a className="logo" href="/">Lunave</a>

          <ul className="nav-links">
            {links.map(l => (
              <li key={l}>
                <a href={l === 'Home' ? '/' : `/${l.toLowerCase().replace(' ', '-')}`}>{l}</a>
              </li>
            ))}
          </ul>

          <div className="nav-icons">
            <button className="nav-icon-btn" aria-label="Search"><Search size={18} /></button>
            {user ? (
              <Link to="/profile" className="nav-icon-btn nav-avatar" aria-label="Account">
                {user.name[0].toUpperCase()}
              </Link>
            ) : (
              <Link to="/login" className="nav-icon-btn" aria-label="Account">
                <User size={18} />
              </Link>
            )}
            <button className="nav-icon-btn" aria-label="Wishlist"><Heart size={18} /></button>

            {/* ── Cart button — opens drawer ── */}
            <button
              className="nav-icon-btn"
              aria-label="Cart"
              style={{ position: 'relative' }}
              onClick={() => openCart(true)}   // ← opens CartDrawer
            >
              <ShoppingBag size={18} />
              {totalCount > 0 && (              // ← live count from context
                <span className="cart-badge">{totalCount > 99 ? '99+' : totalCount}</span>
              )}
            </button>

            <button
              className={`hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <ul>
          {links.map(l => (
            <li key={l}>
              <a
                href={l === 'Home' ? '/' : `/${l.toLowerCase().replace(' ', '-')}`}
                onClick={() => setMenuOpen(false)}
              >
                {l}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}