import { useReveal } from '../hooks/useReveal.js'

// Replace src with your values/brand image:
// import valuesImg from '../assets/images/values-perfume.jpg'
const VALUES_IMG = null // '/src/assets/images/values-perfume.jpg'

const values = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L9 9H2l5.5 4-2 7L12 16l6.5 4-2-7L22 9h-7z"/>
      </svg>
    ),
    title: 'Authenticity',
    desc: 'Every fragrance is crafted with genuine passion, celebrating the individuality of each person who wears it.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: 'Sustainability',
    desc: 'We embrace eco-conscious practices, from sourcing ingredients responsibly to our minimal packaging.',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'Community',
    desc: 'More than a store — a gathering of fragrance enthusiasts who inspire and empower one another.',
  },
]

export default function ValuesSection() {
  const ref = useReveal()

  return (
    <section className="values-section" ref={ref}>
      <div className="values-inner">
        {/* Image */}
        <div className="values-image-wrap reveal">
          {VALUES_IMG ? (
            <img src={VALUES_IMG} alt="Our values — Lunave perfume" className="values-img" loading="lazy" />
          ) : (
            <div className="values-img" style={{
              background: 'linear-gradient(135deg, #111 0%, #1c1a17 60%, #111 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '12px',
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201,151,90,0.12) 0%, transparent 70%)',
                border: '1px solid rgba(201,151,90,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(201,151,90,0.3)',
                fontSize: '11px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: 'Montserrat, sans-serif',
              }}>
                values-img
              </div>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="values-text">
          <div className="reveal">
            <p className="section-tag">Who We Are</p>
          </div>
          <div className="reveal reveal-delay-1">
            <h2 className="section-title">Our <em>Values</em></h2>
          </div>
          <div className="reveal reveal-delay-2">
            <p style={{ color: 'var(--white-dim)', fontSize: '14px', lineHeight: '1.8' }}>
              At Lunave, our perfume retail store is built on a foundation of passion and authenticity.
              We believe in celebrating the individuality of every customer, providing a diverse collection
              of scents that resonate with their unique personality and style.
            </p>
          </div>

          <div className="values-list">
            {values.map((v, i) => (
              <div className={`value-item reveal reveal-delay-${i + 2}`} key={v.title}>
                <div className="value-icon">{v.icon}</div>
                <div>
                  <h4>{v.title}</h4>
                  <p>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
