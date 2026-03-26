// Navbar.jsx
import { useState, useEffect } from 'react'
import { Search, User, Heart, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/Cartcontext'
import { useWishlist } from '../context/WishlistContext'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { totalCount, setOpen: openCart }       = useCart()
  const { totalCount: wishCount, setOpen: openWishlist } = useWishlist()
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
                {(user.name?.[0] ?? '?').toUpperCase()}
              </Link>
            ) : (
              <Link to="/register" className="nav-icon-btn" aria-label="Account">
                <User size={18} />
              </Link>
            )}
            {/* ── Wishlist button ── */}
            <button
              className="nav-icon-btn"
              aria-label="Wishlist"
              style={{ position: 'relative' }}
              onClick={() => openWishlist(true)}
            >
              <Heart
                size={18}
                fill={wishCount > 0 ? '#ecd798' : 'none'}
                style={{ color: wishCount > 0 ? '#ecd798' : undefined }}
              />
              {wishCount > 0 && (
                <span className="cart-badge">{wishCount > 99 ? '99+' : wishCount}</span>
              )}
            </button>

            {/* ── Cart button ── */}
            <button
              className="nav-icon-btn"
              aria-label="Cart"
              style={{ position: 'relative' }}
              onClick={() => openCart(true)}
            >
              <ShoppingBag size={18} />
              {totalCount > 0 && (
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