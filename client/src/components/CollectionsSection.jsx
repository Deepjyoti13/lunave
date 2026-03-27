import { useEffect, useRef, useState } from "react"

const API_URL = "http://localhost:5001"

function PlaceholderImg({ name, accent }) {
  return (
    <div style={{ width:"100%",height:"100%",background:"linear-gradient(135deg,#111 0%,#1a1a1a 50%,#111 100%)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",width:"300px",height:"300px",borderRadius:"50%",background:`radial-gradient(circle,${accent}22 0%,transparent 70%)` }} />
      <span style={{ fontFamily:"Montserrat,sans-serif",fontSize:"11px",letterSpacing:"0.15em",textTransform:"uppercase",color:"rgba(201,151,90,0.3)",position:"relative",zIndex:1,textAlign:"center",padding:"0 20px" }}>{name}</span>
    </div>
  )
}

// Resolve image URL — Cloudinary URLs are already full https://
// Old disk-based URLs start with /uploads/ and need the API prefix
const resolveUrl = (url) => {
  if (!url) return null
  if (url.startsWith('http')) return url           // Cloudinary — use as-is
  return `${API_URL}${url}`                        // legacy disk path
}

export default function CollectionsSection() {
  const sectionRef = useRef(null)
  const [collections, setCollections] = useState([])
  const [error, setError]             = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const fetchCollections = async () => {
      try {
        const res  = await fetch(`${API_URL}/api/products`, { signal: controller.signal })
        const data = await res.json()

        if (!data.success || !data.products?.length) {
          setError("No products found")
          return
        }

        const grouped = {}
        data.products.forEach((product) => {
          const category = product.category || "Collection"
          if (!grouped[category]) {
            const imgObj = product.images?.find((img) => img.isPrimary) || product.images?.[0]
            grouped[category] = {
              id:   category,
              name: category,
              src:  resolveUrl(imgObj?.url),
            }
          }
        })

        setCollections(Object.values(grouped).slice(0, 4))
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Collections fetch failed:", err)
          setError(err.message)
        }
      }
    }
    fetchCollections()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    )
    sectionRef.current.querySelectorAll(".reveal").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [collections])

  return (
    <section className="collections-section" ref={sectionRef}>
      <div className="collections-header reveal">
        <p className="section-tag">Explore</p>
        <h2 className="section-title">Our Collections</h2>
      </div>

      {error && (
        <p style={{ textAlign:"center",color:"rgba(201,151,90,0.5)",fontSize:"13px",padding:"2rem 0" }}>
          {error}
        </p>
      )}

      <div className="collections-grid">
        {collections.map((col, i) => (
          <div
            className={`collection-card reveal reveal-delay-${i + 1}`}
            key={col.id}
            role="button"
            tabIndex={0}
          >
            {col.src ? (
              <img
                src={col.src}
                alt={col.name}
                className="collection-img"
                loading="lazy"
                onError={(e) => { e.currentTarget.style.display = "none" }}
              />
            ) : (
              <PlaceholderImg name={col.name} accent="#c9975a" />
            )}
            <div className="collection-overlay" />
            <div className="collection-label">
              <h3>{col.name}</h3>
              <span className="collection-cta">Explore</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
