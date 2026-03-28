// client/src/components/CollectionsSection.jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './CollectionsSection.css'

const API_URL = 'http://localhost:5001'

export default function CollectionsSection() {
  const sectionRef              = useRef(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    fetch(`${API_URL}/api/categories`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => { if (data.success) setCategories(data.categories) })
      .catch(err => { if (err.name !== 'AbortError') console.error('Categories fetch failed:', err) })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    sectionRef.current.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [categories])

  return (
    <section className="collections-section" id="collections" ref={sectionRef}>
      <div className="collections-header reveal">
        <p className="section-tag">Explore</p>
        <h2 className="section-title">Our Collections</h2>
      </div>

      <div className="collections-grid">
        {loading
          ? [1, 2, 3].map(i => (
              <div className="collection-card collection-card--skeleton reveal" key={i}>
                <div className="collection-placeholder"><span></span></div>
              </div>
            ))
          : categories.slice(0, 3).map((cat, i) => (
              <Link
                to={`/collections/${cat.slug}`}
                className={`collection-card reveal reveal-delay-${i + 1}`}
                key={cat._id}
              >
                {cat.coverImage?.url ? (
                  <img
                    src={cat.coverImage.url}
                    alt={cat.name}
                    className="collection-img"
                    loading="lazy"
                    onError={e => { e.currentTarget.style.display = 'none' }}
                  />
                ) : (
                  <div className="collection-placeholder">
                    <span>{cat.name}</span>
                  </div>
                )}
                <div className="collection-overlay" />
                <div className="collection-label">
                  <h3>{cat.name}</h3>
                  <span className="collection-cta">Explore</span>
                </div>
              </Link>
            ))
        }
      </div>
    </section>
  )
}
