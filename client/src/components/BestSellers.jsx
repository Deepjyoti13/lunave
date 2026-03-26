// BestSellers.jsx
import { useEffect, useRef, useState } from 'react'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const API_URL = "http://localhost:5001"

const resolveUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_URL}${url}`
}

function ProductCard({ product, delay }) {
  const [adding, setAdding] = useState(false)
  const { addItem }         = useCart()
  const { isWished, addItem: wishAdd, removeItem: wishRemove } = useWishlist()

  const imgUrl  = resolveUrl(product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url)
  const wished  = isWished(product._id)

  const handleAdd = async () => {
    setAdding(true)
    await addItem(product)
    setTimeout(() => setAdding(false), 600)
  }

  const handleHeart = () => {
    if (wished) {
      wishRemove(product._id)
    } else {
      wishAdd(product)
    }
  }

  return (
    <div className={`product-card reveal reveal-delay-${delay}`}>
      <div className="product-img-wrap">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            className="product-img"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:'8px' }}>
            <svg width="60" height="100" viewBox="0 0 60 100" fill="none">
              <rect x="22" y="0" width="16" height="10" rx="2" fill="rgba(201,151,90,0.35)"/>
              <rect x="26" y="10" width="8" height="8" rx="1" fill="rgba(201,151,90,0.25)"/>
              <path d="M12 24 Q8 35 8 50 L8 78 Q8 92 30 92 Q52 92 52 78 L52 50 Q52 35 48 24 Z" fill="rgba(201,151,90,0.1)" stroke="rgba(201,151,90,0.35)" strokeWidth="1"/>
            </svg>
            <span style={{ fontFamily:'Montserrat,sans-serif',fontSize:'10px',color:'rgba(201,151,90,0.25)',letterSpacing:'0.1em',textTransform:'uppercase' }}>
              No Image
            </span>
          </div>
        )}

        <div className="product-actions">
          <button
            className="product-action-btn"
            onClick={handleHeart}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
            style={{
              color:       wished ? '#ecd798' : undefined,
              borderColor: wished ? 'rgba(236,215,152,0.5)' : undefined,
            }}
          >
            <Heart size={14} fill={wished ? '#ecd798' : 'none'} />
          </button>
          <button className="product-action-btn" aria-label="Quick view">
            <Eye size={14} />
          </button>
        </div>
      </div>

      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-vol">{product.volumeOptions?.[0]?.size ? `${product.volumeOptions[0].size}ml` : '100ml'}</p>
        <div className="product-footer">
          <span className="product-price">$ {product.basePrice?.toFixed(2)}</span>
          <button
            className="add-cart-btn"
            onClick={handleAdd}
            disabled={adding}
            style={adding ? { opacity: 0.7, transform: 'scale(0.96)' } : undefined}
          >
            <ShoppingBag size={12} style={{ display:'inline', marginRight:'6px' }} />
            {adding ? '✓' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function BestSellers() {
  const sectionRef = useRef(null)
  const [products, setProducts] = useState([])

  useEffect(() => {
    const controller = new AbortController()
    const fetchProducts = async () => {
      try {
        const res  = await fetch(`${API_URL}/api/products/bestsellers`, { signal: controller.signal })
        const data = await res.json()
        if (data.success) setProducts(data.products.slice(0, 4))
      } catch (err) {
        if (err.name !== 'AbortError') console.error('BestSellers fetch failed:', err)
      }
    }
    fetchProducts()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    sectionRef.current.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [products])

  return (
    <section className="bestsellers-section" ref={sectionRef}>
      <div className="bestsellers-header">
        <div>
          <p className="section-tag reveal" style={{ justifyContent:'flex-start' }}>Top Picks</p>
          <h2 className="section-title reveal reveal-delay-1" style={{ marginBottom:0 }}>
            Best Selling <em style={{ fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',color:'var(--gold)' }}>Products</em>
          </h2>
        </div>
        <a href="/shop" className="view-all-link reveal">View All →</a>
      </div>

      <div className="products-scroll-wrap">
        <div className="products-grid">
          {products.map((p, i) => (
            <ProductCard key={p._id} product={p} delay={i + 1} />
          ))}
          {!products.length && [1,2,3,4].map(i => (
            <div key={i} className={`product-card reveal reveal-delay-${i}`}>
              <div className="product-img-wrap" style={{ background:'#141414' }} />
              <div className="product-info">
                <div style={{ height:'14px',background:'#1c1c1c',borderRadius:'2px',marginBottom:'8px' }}/>
                <div style={{ height:'10px',background:'#1c1c1c',borderRadius:'2px',width:'60%' }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
