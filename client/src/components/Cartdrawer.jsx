// CartDrawer.jsx
// A luxury slide-in cart panel matching the Lunave dark/gold brand theme.
// Place in src/components/CartDrawer.jsx

import { useEffect, useRef } from 'react'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/Cartcontext'

const API_URL = 'http://localhost:5000'

const resolveUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}

// ── Individual cart line ────────────────────────────────────────────────────
function CartItem({ item }) {
  const { updateQty, removeItem } = useCart()
  const imgUrl = resolveUrl(item.image)

  return (
    <div className="cdr-item">
      {/* thumbnail */}
      <div className="cdr-thumb">
        {imgUrl ? (
          <img src={imgUrl} alt={item.name} className="cdr-thumb-img"
            onError={e => { e.currentTarget.style.display = 'none' }} />
        ) : (
          <div className="cdr-thumb-placeholder">
            <ShoppingBag size={20} style={{ opacity: 0.25 }} />
          </div>
        )}
      </div>

      {/* details */}
      <div className="cdr-item-body">
        <div className="cdr-item-top">
          <div>
            <p className="cdr-item-name">{item.name}</p>
            {item.volume && (
              <p className="cdr-item-meta">{item.volume}ml</p>
            )}
          </div>
          <button
            className="cdr-remove-btn"
            onClick={() => removeItem(item._id)}
            aria-label="Remove item"
          >
            <Trash2 size={13} />
          </button>
        </div>

        <div className="cdr-item-bottom">
          {/* qty stepper */}
          <div className="cdr-stepper">
            <button
              className="cdr-step-btn"
              onClick={() => updateQty(item._id, item.quantity - 1)}
              aria-label="Decrease"
            >
              <Minus size={11} />
            </button>
            <span className="cdr-qty">{item.quantity}</span>
            <button
              className="cdr-step-btn"
              onClick={() => updateQty(item._id, item.quantity + 1)}
              aria-label="Increase"
              disabled={item.quantity >= 20}
            >
              <Plus size={11} />
            </button>
          </div>

          <span className="cdr-item-price">
            $ {(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Drawer ──────────────────────────────────────────────────────────────────
export default function CartDrawer() {
  const { items, totalCount, totalPrice, open, setOpen, clearCart } = useCart()
  const overlayRef  = useRef(null)
  const drawerRef   = useRef(null)

  // trap focus & ESC close
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* ── styles ── */}
      <style>{`
        /* ── overlay ── */
        .cdr-overlay {
          position: fixed; inset: 0; z-index: 1200;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none;
          transition: opacity 0.35s ease;
        }
        .cdr-overlay.open { opacity: 1; pointer-events: auto; }

        /* ── drawer panel ── */
        .cdr-panel {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(420px, 100vw);
          z-index: 1201;
          background: #0d0d0d;
          border-left: 1px solid rgba(201,151,90,0.12);
          display: flex; flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.32, 0, 0.16, 1);
          box-shadow: -20px 0 60px rgba(0,0,0,0.6);
        }
        .cdr-panel.open { transform: translateX(0); }

        /* ── header ── */
        .cdr-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 28px 20px;
          border-bottom: 1px solid rgba(201,151,90,0.1);
          flex-shrink: 0;
        }
        .cdr-header-left {
          display: flex; align-items: center; gap: 10px;
        }
        .cdr-title {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-size: 22px; font-weight: 400; letter-spacing: 0.02em;
          color: #f0e6d2;
          margin: 0;
        }
        .cdr-count-badge {
          display: inline-flex; align-items: center; justify-content: center;
          width: 20px; height: 20px; border-radius: 50%;
          background: rgba(201,151,90,0.18);
          border: 1px solid rgba(201,151,90,0.35);
          color: #c9975a;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 600;
          letter-spacing: 0;
        }
        .cdr-close-btn {
          background: none; border: 1px solid rgba(201,151,90,0.18);
          color: rgba(201,151,90,0.6);
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .cdr-close-btn:hover {
          border-color: rgba(201,151,90,0.5);
          color: #c9975a;
          background: rgba(201,151,90,0.06);
        }

        /* ── item list ── */
        .cdr-list {
          flex: 1; overflow-y: auto;
          padding: 8px 0;
          scrollbar-width: thin;
          scrollbar-color: rgba(201,151,90,0.15) transparent;
        }
        .cdr-list::-webkit-scrollbar { width: 4px; }
        .cdr-list::-webkit-scrollbar-track { background: transparent; }
        .cdr-list::-webkit-scrollbar-thumb {
          background: rgba(201,151,90,0.2); border-radius: 2px;
        }

        /* ── single item ── */
        .cdr-item {
          display: flex; gap: 14px;
          padding: 18px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
        }
        .cdr-item:hover { background: rgba(201,151,90,0.03); }

        .cdr-thumb {
          width: 72px; height: 88px; flex-shrink: 0;
          border-radius: 4px; overflow: hidden;
          background: #141414;
          border: 1px solid rgba(201,151,90,0.1);
        }
        .cdr-thumb-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .cdr-thumb-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
        }

        .cdr-item-body {
          flex: 1; display: flex; flex-direction: column;
          justify-content: space-between; min-width: 0;
        }
        .cdr-item-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 8px;
        }
        .cdr-item-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 12px; font-weight: 500;
          color: #e8dcc8; letter-spacing: 0.06em;
          text-transform: uppercase;
          margin: 0; line-height: 1.4;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .cdr-item-meta {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; color: rgba(201,151,90,0.5);
          letter-spacing: 0.05em; margin: 4px 0 0; font-weight: 400;
        }
        .cdr-remove-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.2);
          padding: 2px;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .cdr-remove-btn:hover { color: #c47575; }

        .cdr-item-bottom {
          display: flex; align-items: center;
          justify-content: space-between;
        }

        /* ── qty stepper ── */
        .cdr-stepper {
          display: flex; align-items: center; gap: 0;
          border: 1px solid rgba(201,151,90,0.2);
          border-radius: 3px; overflow: hidden;
        }
        .cdr-step-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(201,151,90,0.6);
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .cdr-step-btn:hover:not(:disabled) {
          background: rgba(201,151,90,0.1);
          color: #c9975a;
        }
        .cdr-step-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .cdr-qty {
          width: 32px; text-align: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px; color: #e8dcc8; font-weight: 500;
          border-left: 1px solid rgba(201,151,90,0.15);
          border-right: 1px solid rgba(201,151,90,0.15);
          line-height: 28px;
        }

        .cdr-item-price {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-size: 17px; font-weight: 500;
          color: #c9975a; letter-spacing: 0.01em;
        }

        /* ── empty state ── */
        .cdr-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 16px; padding: 40px 28px; text-align: center;
        }
        .cdr-empty-icon {
          width: 64px; height: 64px;
          border: 1px solid rgba(201,151,90,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: rgba(201,151,90,0.25);
        }
        .cdr-empty p {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px; letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin: 0;
        }
        .cdr-empty em {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-size: 22px; font-style: italic;
          color: rgba(201,151,90,0.3);
          display: block; margin-bottom: 4px;
        }

        /* ── footer / summary ── */
        .cdr-footer {
          flex-shrink: 0;
          border-top: 1px solid rgba(201,151,90,0.1);
          padding: 24px 28px 32px;
          background: #0a0a0a;
        }
        .cdr-summary-row {
          display: flex; justify-content: space-between;
          align-items: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 10px;
        }
        .cdr-summary-row span:last-child {
          color: rgba(255,255,255,0.5); font-size: 11px;
        }
        .cdr-total-row {
          display: flex; justify-content: space-between;
          align-items: baseline;
          margin-bottom: 22px;
          padding-top: 12px;
          border-top: 1px solid rgba(201,151,90,0.08);
        }
        .cdr-total-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; letter-spacing: 0.15em;
          text-transform: uppercase; color: rgba(255,255,255,0.5);
        }
        .cdr-total-amount {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-size: 28px; font-weight: 500;
          color: #c9975a; letter-spacing: 0.01em;
        }

        .cdr-checkout-btn {
          width: 100%;
          background: linear-gradient(135deg, rgba(201,151,90,0.9), rgba(201,151,90,0.7));
          border: 1px solid rgba(201,151,90,0.5);
          color: #0d0d0d;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 16px 24px;
          border-radius: 2px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: background 0.25s, box-shadow 0.25s, transform 0.15s;
        }
        .cdr-checkout-btn:hover {
          background: linear-gradient(135deg, rgba(201,151,90,1), rgba(184,133,72,0.95));
          box-shadow: 0 8px 28px rgba(201,151,90,0.25);
          transform: translateY(-1px);
        }
        .cdr-checkout-btn:active { transform: translateY(0); }

        .cdr-clear-btn {
          width: 100%; margin-top: 10px;
          background: none; border: none;
          color: rgba(255,255,255,0.2);
          font-family: 'Montserrat', sans-serif;
          font-size: 9px; letter-spacing: 0.12em;
          text-transform: uppercase; cursor: pointer;
          padding: 8px;
          transition: color 0.2s;
        }
        .cdr-clear-btn:hover { color: rgba(196,117,117,0.7); }

        /* ── free shipping bar ── */
        .cdr-shipping-bar {
          margin-bottom: 18px;
        }
        .cdr-shipping-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(201,151,90,0.5);
          margin-bottom: 6px;
        }
        .cdr-progress-track {
          height: 2px; background: rgba(201,151,90,0.1);
          border-radius: 1px; overflow: hidden;
        }
        .cdr-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, rgba(201,151,90,0.4), rgba(201,151,90,0.8));
          border-radius: 1px;
          transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
        }

        @media (max-width: 480px) {
          .cdr-panel { width: 100vw; }
          .cdr-item { padding: 16px 20px; }
          .cdr-header, .cdr-footer { padding-left: 20px; padding-right: 20px; }
        }
      `}</style>

      {/* overlay */}
      <div
        ref={overlayRef}
        className={`cdr-overlay${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* panel */}
      <div
        ref={drawerRef}
        className={`cdr-panel${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* header */}
        <div className="cdr-header">
          <div className="cdr-header-left">
            <h2 className="cdr-title">Your Cart</h2>
            {totalCount > 0 && (
              <span className="cdr-count-badge">{totalCount}</span>
            )}
          </div>
          <button
            className="cdr-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Close cart"
          >
            <X size={15} />
          </button>
        </div>

        {/* body */}
        {items.length === 0 ? (
          <div className="cdr-empty">
            <div className="cdr-empty-icon">
              <ShoppingBag size={26} />
            </div>
            <div>
              <em>Empty</em>
              <p>Your cart is waiting to be filled</p>
            </div>
          </div>
        ) : (
          <div className="cdr-list">
            {items.map(item => (
              <CartItem key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* footer */}
        {items.length > 0 && (
          <div className="cdr-footer">
            {/* free shipping progress */}
            <FreeShippingBar total={totalPrice} />

            {/* subtotal row */}
            <div className="cdr-summary-row">
              <span>Subtotal ({totalCount} {totalCount === 1 ? 'item' : 'items'})</span>
              <span>$ {totalPrice.toFixed(2)}</span>
            </div>
            <div className="cdr-summary-row">
              <span>Shipping</span>
              <span>{totalPrice >= 500 ? 'Free' : 'Calculated at checkout'}</span>
            </div>

            <div className="cdr-total-row">
              <span className="cdr-total-label">Total</span>
              <span className="cdr-total-amount">$ {totalPrice.toFixed(2)}</span>
            </div>

            <button className="cdr-checkout-btn" onClick={() => window.location.href = '/checkout'}>
              Proceed to Checkout
              <ArrowRight size={14} />
            </button>

            <button className="cdr-clear-btn" onClick={clearCart}>
              Clear all items
            </button>
          </div>
        )}
      </div>
    </>
  )
}

// ── Free shipping progress bar ─────────────────────────────────────────────
const FREE_SHIPPING_THRESHOLD = 500

function FreeShippingBar({ total }) {
  const pct = Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = FREE_SHIPPING_THRESHOLD - total

  return (
    <div className="cdr-shipping-bar">
      <p className="cdr-shipping-text">
        {pct >= 100
          ? '✦ You have free shipping!'
          : `$ ${remaining.toFixed(0)} away from free shipping`}
      </p>
      <div className="cdr-progress-track">
        <div className="cdr-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}