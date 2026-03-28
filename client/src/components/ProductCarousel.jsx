import { useEffect, useRef, useState } from 'react'
import './ProductCarousel.css'

const API_URL = 'http://localhost:5001'

function getPrimaryImage(images) {
  if (!images?.length) return null
  const primary = images.find(img => img.isPrimary) ?? images[0]
  const url = primary?.url
  return url?.startsWith('http') ? url : `${API_URL}${url}`
}

function getScentNotes(product) {
  const t = product.scentNotes?.top    ?? []
  const h = product.scentNotes?.heart  ?? []
  const b = product.scentNotes?.base   ?? []
  return [...t.slice(0,2), ...h.slice(0,1), ...b.slice(0,1)].slice(0, 4)
}

/* ─────────────────────────────────────────────────────────
   EMBEDDED — lives inside .hero-stage (right col of hero)
───────────────────────────────────────────────────────── */
function EmbeddedCarousel({ products }) {
  const [active, setActive]   = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const intervalRef           = useRef(null)
  const touchStartX           = useRef(null)
  const count = products.length

  const go = (dir) => {
    setActive(prev => dir === 'next'
      ? (prev + 1) % count
      : (prev - 1 + count) % count
    )
    setAnimKey(k => k + 1)
  }

  useEffect(() => {
    if (count < 2) return
    intervalRef.current = setInterval(() => go('next'), 5000)
    return () => clearInterval(intervalRef.current)
  }, [count, active])

  const pause  = () => clearInterval(intervalRef.current)
  const resume = () => {
    clearInterval(intervalRef.current)
    if (count >= 2) intervalRef.current = setInterval(() => go('next'), 5000)
  }

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = e => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 'next' : 'prev')
    touchStartX.current = null
  }

  const product    = products[active]
  const img        = getPrimaryImage(product.images)
  const scentNotes = getScentNotes(product)

  return (
    <div
      className="pce"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* ── Ambient blurred background (key change = re-anim) ── */}
      <div
        key={`bg-${active}`}
        className="pce-bg"
        style={{ backgroundImage: img ? `url(${img})` : 'none' }}
      />

      {/* ── Gold radial glow under bottle ── */}
      <div className="pce-glow" />

      {/* ── Floating scent note pills ── */}
      <div className="pce-notes" key={`notes-${active}`}>
        {scentNotes.map((note, i) => (
          <span key={note} className={`pce-note pce-note--${i}`}>{note}</span>
        ))}
      </div>

      {/* ── Bottle ── */}
      <div className="pce-bottle-wrap" key={`bottle-${animKey}`}>
        {img ? (
          <>
            <img src={img} alt={product.name} className="pce-bottle" />
            <div className="pce-light-sweep" />
          </>
        ) : (
          <div className="pce-bottle-placeholder">L</div>
        )}
      </div>

      {/* ── Bottom info overlay ── */}
      <div className="pce-overlay" key={`info-${active}`}>
        {product.scentFamily && (
          <span className="pce-overlay-family">{product.scentFamily}</span>
        )}
        <h2 className="pce-overlay-name">{product.name}</h2>
        <div className="pce-overlay-bottom">
          <span className="pce-overlay-price">
            ₹{product.basePrice?.toLocaleString('en-IN')}
          </span>
          <a href={`/product/${product.slug}`} className="pce-overlay-link">
            Explore
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>

      {/* ── Left / Right arrows ── */}
      {count > 1 && (
        <>
          <button className="pce-arrow pce-arrow--prev" onClick={() => go('prev')} aria-label="Previous">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button className="pce-arrow pce-arrow--next" onClick={() => go('next')} aria-label="Next">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* ── Dots ── */}
      {count > 1 && (
        <div className="pce-dots-vert">
          {products.map((_, i) => (
            <button
              key={i}
              className={`pce-dot-v${i === active ? ' active' : ''}`}
              onClick={() => { setAnimKey(k => k + 1); setActive(i) }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* ── Slide counter ── */}
      <div className="pce-counter">
        <span className="pce-counter-cur">{String(active + 1).padStart(2, '0')}</span>
        <span className="pce-counter-sep"> / </span>
        <span className="pce-counter-tot">{String(count).padStart(2, '0')}</span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   STANDALONE — full-width section (used outside hero)
───────────────────────────────────────────────────────── */
function StandaloneCarousel({ products }) {
  const [active, setActive]   = useState(0)
  const [animDir, setAnimDir] = useState('next')
  const intervalRef           = useRef(null)
  const touchStartX           = useRef(null)
  const count = products.length

  const go = (dir) => {
    setAnimDir(dir)
    setActive(prev => dir === 'next'
      ? (prev + 1) % count
      : (prev - 1 + count) % count
    )
  }

  useEffect(() => {
    if (count < 2) return
    intervalRef.current = setInterval(() => go('next'), 4500)
    return () => clearInterval(intervalRef.current)
  }, [count, active])

  const pause  = () => clearInterval(intervalRef.current)
  const resume = () => {
    clearInterval(intervalRef.current)
    if (count >= 2) intervalRef.current = setInterval(() => go('next'), 4500)
  }

  const onTouchStart = e => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = e => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 'next' : 'prev')
    touchStartX.current = null
  }

  const product = products[active]
  const img     = getPrimaryImage(product.images)

  return (
    <section
      className="pcarousel"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="pcarousel-bg-glow" />
      <div className="pcarousel-label">
        <span className="pcarousel-label-line" />
        Featured Collection
        <span className="pcarousel-label-line" />
      </div>
      <div className="pcarousel-stage">
        <button className="pcarousel-arrow pcarousel-arrow--prev" onClick={() => go('prev')} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6" /></svg>
        </button>
        <div className={`pcarousel-slide pcarousel-slide--${animDir}`} key={active}>
          <div className="pcarousel-img-wrap">
            {img
              ? <img src={img} alt={product.name} className="pcarousel-img" />
              : <div className="pcarousel-img-placeholder"><span>L</span></div>
            }
            <div className="pcarousel-reflection" style={img ? { backgroundImage: `url(${img})` } : {}} />
          </div>
          <div className="pcarousel-info">
            {product.scentFamily && <span className="pcarousel-category">{product.scentFamily}</span>}
            <h2 className="pcarousel-name">{product.name}</h2>
            {product.shortDescription && <p className="pcarousel-desc">{product.shortDescription}</p>}
            <div className="pcarousel-pricing">
              <span className="pcarousel-price">₹{product.basePrice?.toLocaleString('en-IN')}</span>
              {product.comparePrice > product.basePrice && (
                <span className="pcarousel-compare">₹{product.comparePrice?.toLocaleString('en-IN')}</span>
              )}
            </div>
            <div className="pcarousel-cta-row">
              <a href="/shop" className="pcarousel-btn-primary">Shop Now</a>
              <a href={`/product/${product.slug}`} className="pcarousel-btn-ghost">View Details</a>
            </div>
          </div>
        </div>
        <button className="pcarousel-arrow pcarousel-arrow--next" onClick={() => go('next')} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
      <div className="pcarousel-dots">
        {products.map((_, i) => (
          <button key={i} className={`pcarousel-dot${i === active ? ' active' : ''}`}
            onClick={() => { setAnimDir(i > active ? 'next' : 'prev'); setActive(i) }}
            aria-label={`Slide ${i + 1}`} />
        ))}
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   ROOT — fetches data, renders correct variant
───────────────────────────────────────────────────────── */
export default function ProductCarousel({ embedded = false }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/api/products/featured`)
      .then(r => r.json())
      .then(data => { if (data.success && data.products?.length) setProducts(data.products) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (embedded) {
    if (loading) return <div className="pce pce--loading"><div className="pce-shimmer" /></div>
    if (!products.length) return null
    return <EmbeddedCarousel products={products} />
  }

  if (loading) return <section className="pcarousel pcarousel--loading"><div className="pcarousel-shimmer" /></section>
  if (!products.length) return null
  return <StandaloneCarousel products={products} />
}
