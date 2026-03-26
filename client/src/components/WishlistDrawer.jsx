// client/src/components/WishlistDrawer.jsx
import { useEffect, useState } from 'react'
import { X, Heart, ShoppingBag } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/Cartcontext'

const API_URL = 'http://localhost:5001'

const resolveUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}

// Accent tokens (Pantone 7420C champagne gold)
const A  = '#ecd798'
const AD = 'rgba(236,215,152,0.45)'
const AB = 'rgba(236,215,152,0.2)'
const AF = 'rgba(236,215,152,0.1)'
const AH = 'rgba(236,215,152,0.04)'

// ── Individual wishlist row ─────────────────────────────────────────────────
function WishlistItem({ item }) {
  const { removeItem } = useWishlist()
  const { addItem: addToCart } = useCart()
  const imgUrl = resolveUrl(item.image)

  const productId = item.product?._id ?? item.product

  return (
    <div className="wdr-item">
      <div className="wdr-thumb">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={item.name}
            className="wdr-thumb-img"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="wdr-thumb-placeholder">
            <Heart size={18} style={{ opacity: 0.2, color: A }} />
          </div>
        )}
      </div>

      <div className="wdr-item-body">
        <div className="wdr-item-top">
          <div style={{ minWidth: 0 }}>
            <p className="wdr-item-name">{item.name}</p>
          </div>
          <button
            className="wdr-remove-btn"
            onClick={() => removeItem(productId)}
            aria-label="Remove from wishlist"
          >
            <X size={12} />
          </button>
        </div>

        <div className="wdr-item-bottom">
          <span className="wdr-item-price">₹ {item.price?.toLocaleString('en-IN')}</span>
          <button
            className="wdr-add-cart-btn"
            onClick={() => addToCart({ _id: productId, name: item.name, images: item.image ? [{ url: item.image }] : [], basePrice: item.price })}
            aria-label="Add to cart"
          >
            <ShoppingBag size={11} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Drawer ──────────────────────────────────────────────────────────────────
export default function WishlistDrawer() {
  const { items, totalCount, open, setOpen, clearWishlist } = useWishlist()
  const { addItem: addToCart } = useCart()

  // ESC key close
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const totalValue = items.reduce((s, i) => s + (i.price || 0), 0)

  const [movingAll, setMovingAll] = useState(false)

  const handleMoveAllToCart = async () => {
    if (movingAll) return
    setMovingAll(true)
    try {
      for (const item of items) {
        const productId = item.product?._id ?? item.product
        await addToCart({
          _id:       productId,
          name:      item.name,
          images:    item.image ? [{ url: item.image }] : [],
          basePrice: item.price,
        })
      }
      await clearWishlist()
      setOpen(false)
    } catch {
      // individual addToCart already shows a toast on failure
    } finally {
      setMovingAll(false)
    }
  }

  return (
    <>
      <style>{`
        /* ── overlay ── */
        .wdr-overlay {
          position: fixed; inset: 0; z-index: 1300;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px);
          opacity: 0; pointer-events: none;
          transition: opacity 0.35s ease;
        }
        .wdr-overlay.open { opacity: 1; pointer-events: auto; }

        /* ── panel ── */
        .wdr-panel {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(420px, 100vw);
          z-index: 1301;
          background: #0d0d0d;
          border-left: 1px solid ${AB};
          display: flex; flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.32,0,0.16,1);
          box-shadow: -20px 0 60px rgba(0,0,0,0.6);
        }
        .wdr-panel.open { transform: translateX(0); }

        /* ── header ── */
        .wdr-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 28px 20px;
          border-bottom: 1px solid ${AB};
          flex-shrink: 0;
        }
        .wdr-header-left { display: flex; align-items: center; gap: 10px; }
        .wdr-title {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-size: 22px; font-weight: 400; letter-spacing: 0.02em;
          color: #f0e6d2; margin: 0;
        }
        .wdr-count-badge {
          display: inline-flex; align-items: center; justify-content: center;
          width: 20px; height: 20px; border-radius: 50%;
          background: ${AF};
          border: 1px solid ${AB};
          color: ${A};
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 600;
        }
        .wdr-close-btn {
          background: none; border: 1px solid ${AB};
          color: ${AD};
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .wdr-close-btn:hover {
          border-color: rgba(236,215,152,0.5);
          color: ${A};
          background: ${AF};
        }
        .wdr-close-btn:focus-visible {
          outline: 2px solid ${A}; outline-offset: 2px;
        }

        /* ── item list ── */
        .wdr-list {
          flex: 1; overflow-y: auto;
          padding: 8px 0;
          scrollbar-width: thin;
          scrollbar-color: ${AB} transparent;
        }
        .wdr-list::-webkit-scrollbar { width: 4px; }
        .wdr-list::-webkit-scrollbar-track { background: transparent; }
        .wdr-list::-webkit-scrollbar-thumb { background: ${AB}; border-radius: 2px; }

        /* ── single item ── */
        .wdr-item {
          display: flex; gap: 14px;
          padding: 18px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
          flex-wrap: wrap;
        }
        .wdr-item:hover { background: ${AH}; }

        .wdr-thumb {
          width: 76px; height: 92px; flex-shrink: 0;
          border-radius: 4px; overflow: hidden;
          background: #141414;
          border: 1px solid ${AB};
        }
        .wdr-thumb-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .wdr-thumb-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
        }

        .wdr-item-body {
          flex: 1; display: flex; flex-direction: column;
          justify-content: space-between; min-width: 0;
        }
        .wdr-item-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 8px;
        }
        .wdr-item-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px; font-weight: 500;
          color: #e8dcc8; letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0; line-height: 1.4;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .wdr-remove-btn {
          background: none; border: none; cursor: pointer;
          color: rgba(255,255,255,0.2);
          padding: 2px; flex-shrink: 0;
          transition: color 0.2s;
        }
        .wdr-remove-btn:hover { color: #c47575; }
        .wdr-remove-btn:focus-visible { outline: 2px solid #c47575; outline-offset: 2px; border-radius: 2px; }

        .wdr-item-bottom {
          display: flex; align-items: center;
          justify-content: space-between; gap: 8px; flex-wrap: wrap;
        }
        .wdr-item-price {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-size: 19px; font-weight: 500;
          color: ${A}; letter-spacing: 0.01em;
        }
        .wdr-add-cart-btn {
          display: flex; align-items: center; gap: 5px;
          background: ${A}; color: #0d0d0d;
          border: none; cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-size: 9px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 7px 12px; border-radius: 2px;
          transition: opacity 0.2s, transform 0.15s;
        }
        .wdr-add-cart-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .wdr-add-cart-btn:focus-visible { outline: 2px solid ${A}; outline-offset: 2px; }

        /* ── empty state ── */
        .wdr-empty {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 16px; padding: 40px 28px; text-align: center;
        }
        .wdr-empty-icon {
          width: 64px; height: 64px;
          border: 1px solid ${AB};
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: ${AD};
        }
        .wdr-empty em {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-size: 22px; font-style: italic;
          color: ${AD};
          display: block; margin-bottom: 4px;
        }
        .wdr-empty p {
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.25);
          margin: 0;
        }

        /* ── footer ── */
        .wdr-footer {
          flex-shrink: 0;
          border-top: 1px solid ${AB};
          padding: 22px 28px 28px;
          background: #0a0a0a;
        }
        .wdr-footer-summary {
          display: flex; justify-content: space-between; align-items: baseline;
          margin-bottom: 16px;
        }
        .wdr-footer-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .wdr-footer-total {
          font-family: 'Cormorant Garamond', 'Georgia', serif;
          font-size: 22px; font-weight: 500; color: ${A};
        }
        .wdr-move-all-btn {
          width: 100%;
          background: ${A}; color: #0d0d0d;
          border: none; cursor: pointer;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          padding: 16px 24px; border-radius: 2px;
          transition: opacity 0.2s, box-shadow 0.25s, transform 0.15s;
        }
        .wdr-move-all-btn:hover {
          opacity: 0.88;
          box-shadow: 0 8px 28px ${AB};
          transform: translateY(-1px);
        }
        .wdr-move-all-btn:focus-visible { outline: 2px solid ${A}; outline-offset: 2px; }
        .wdr-clear-btn {
          width: 100%; margin-top: 10px;
          background: none; border: none;
          color: rgba(255,255,255,0.2);
          font-family: 'Montserrat', sans-serif;
          font-size: 9px; letter-spacing: 0.12em;
          text-transform: uppercase; cursor: pointer;
          padding: 8px;
          transition: color 0.2s;
        }
        .wdr-clear-btn:hover { color: rgba(196,117,117,0.7); }
        .wdr-clear-btn:focus-visible { outline: 2px solid rgba(196,117,117,0.5); outline-offset: 2px; border-radius: 2px; }

        @media (max-width: 480px) {
          .wdr-panel { width: 100vw; }
          .wdr-item { padding: 16px 20px; }
          .wdr-header, .wdr-footer { padding-left: 20px; padding-right: 20px; }
        }
      `}</style>

      {/* overlay */}
      <div
        className={`wdr-overlay${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* panel */}
      <div
        className={`wdr-panel${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
      >
        {/* header */}
        <div className="wdr-header">
          <div className="wdr-header-left">
            <h2 className="wdr-title">Wishlist</h2>
            {totalCount > 0 && (
              <span className="wdr-count-badge">{totalCount}</span>
            )}
          </div>
          <button
            className="wdr-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Close wishlist"
          >
            <X size={15} />
          </button>
        </div>

        {/* body */}
        {items.length === 0 ? (
          <div className="wdr-empty">
            <div className="wdr-empty-icon">
              <Heart size={26} />
            </div>
            <div>
              <em>Nothing saved yet</em>
              <p>Add pieces you love to your wishlist</p>
            </div>
          </div>
        ) : (
          <div className="wdr-list">
            {items.map(item => (
              <WishlistItem key={item._id} item={item} />
            ))}
          </div>
        )}

        {/* footer */}
        {items.length > 0 && (
          <div className="wdr-footer">
            <div className="wdr-footer-summary">
              <span className="wdr-footer-label">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} saved
              </span>
              <span className="wdr-footer-total">
                ₹ {totalValue.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              className="wdr-move-all-btn"
              onClick={handleMoveAllToCart}
              disabled={movingAll}
              style={movingAll ? { opacity: 0.6, cursor: 'not-allowed', transform: 'none' } : undefined}
            >
              {movingAll ? 'Moving...' : 'Move All to Cart'}
            </button>
            <button className="wdr-clear-btn" onClick={clearWishlist}>
              Clear wishlist
            </button>
          </div>
        )}
      </div>
    </>
  )
}
