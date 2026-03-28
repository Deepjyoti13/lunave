// client/src/pages/CollectionPage.jsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Heart } from 'lucide-react'
import Navbar  from '../components/Navbar'
import Footer  from '../components/Footer'
import { useCart }     from '../context/Cartcontext'
import { useWishlist } from '../context/WishlistContext'
import './CollectionPage.css'

const API_URL = 'http://localhost:5001'

function ProductCard({ product }) {
  const [adding, setAdding] = useState(false)
  const { addItem }         = useCart()
  const { isWished, addItem: wishAdd, removeItem: wishRemove } = useWishlist()

  const imgUrl = (() => {
    const img = product.images?.find(i => i.isPrimary) || product.images?.[0]
    if (!img?.url) return null
    return img.url.startsWith('http') ? img.url : `${API_URL}${img.url}`
  })()

  const wished = isWished(product._id)

  const handleAdd = async () => {
    setAdding(true)
    await addItem(product)
    setTimeout(() => setAdding(false), 600)
  }

  const handleHeart = () => {
    wished ? wishRemove(product._id) : wishAdd(product)
  }

  return (
    <div className="col-product-card">
      <div className="col-product-img-wrap">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={product.name}
            className="col-product-img"
            loading="lazy"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="col-product-no-img">
            <svg width="54" height="90" viewBox="0 0 60 100" fill="none">
              <rect x="22" y="0" width="16" height="10" rx="2" fill="rgba(201,151,90,0.35)" />
              <rect x="26" y="10" width="8" height="8" rx="1" fill="rgba(201,151,90,0.25)" />
              <path d="M12 24 Q8 35 8 50 L8 78 Q8 92 30 92 Q52 92 52 78 L52 50 Q52 35 48 24 Z" fill="rgba(201,151,90,0.1)" stroke="rgba(201,151,90,0.35)" strokeWidth="1" />
            </svg>
            <span>No Image</span>
          </div>
        )}

        <div className="col-product-actions">
          <button
            className={`col-product-action-btn${wished ? ' wished' : ''}`}
            onClick={handleHeart}
            aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={14} fill={wished ? 'var(--gold-champagne)' : 'none'} />
          </button>
        </div>
      </div>

      <div className="col-product-info">
        <p className="col-product-name">{product.name}</p>
        <p className="col-product-desc">{product.shortDescription}</p>
        <div className="col-product-footer">
          <span className="col-product-price">₹{product.basePrice?.toLocaleString('en-IN')}</span>
          <button
            className="col-add-cart-btn"
            onClick={handleAdd}
            disabled={adding}
          >
            <ShoppingBag size={12} />
            {adding ? '✓' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="col-skeleton">
      <div className="col-skeleton-img" />
      <div className="col-skeleton-info">
        <div className="col-skeleton-line" />
        <div className="col-skeleton-line short" />
      </div>
    </div>
  )
}

export default function CollectionPage() {
  const { category }            = useParams()
  const [cat, setCat]           = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    setLoading(true)
    const controller = new AbortController()

    fetch(`${API_URL}/api/categories/${category}`, { signal: controller.signal })
      .then(r => r.json())
      .then(catData => {
        if (!catData.success) return Promise.reject(new Error('Category not found'))
        setCat(catData.category)
        return fetch(
          `${API_URL}/api/products?category=${encodeURIComponent(catData.category.name)}&limit=20`,
          { signal: controller.signal }
        )
      })
      .then(r => r.json())
      .then(prodData => {
        if (prodData.success) setProducts(prodData.products)
      })
      .catch(err => { if (err.name !== 'AbortError') console.error(err) })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [category])

  const heroContent = cat?.coverImage?.url ? (
    <img src={cat.coverImage.url} alt={cat.name} className="col-page-hero-img" />
  ) : (
    <div className="col-page-hero-gradient" />
  )

  return (
    <>
      <Navbar />

      <section className="col-page-hero">
        {heroContent}
        <div className="col-page-hero-overlay" />
        <div className="col-page-hero-content">
          <p className="col-page-tag">Lunave</p>
          <h1 className="col-page-title">{cat?.name ?? category}</h1>
          <div className="col-page-rule" />
          {!loading && (
            <p className="col-page-count">
              {products.length} {products.length === 1 ? 'Fragrance' : 'Fragrances'}
            </p>
          )}
        </div>
      </section>

      <Link to="/#collections" className="col-page-back">← All Collections</Link>

      <section className="col-page-products">
        <div className="col-page-grid-wrap">
          {loading ? (
            <div className="col-page-grid">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <p className="col-page-empty">No fragrances found in this collection yet.</p>
          ) : (
            <div className="col-page-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
