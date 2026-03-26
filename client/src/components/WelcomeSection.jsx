import { useReveal } from '../hooks/useReveal.js'

export default function WelcomeSection() {
  const ref = useReveal()

  return (
    <section className="welcome-section" ref={ref}>
      {/* 
        Background image: replace with your perfume-bg image
        <div className="welcome-bg" style={{ backgroundImage: 'url(/src/assets/images/welcome-bg.jpg)' }} />
      */}
      <div className="welcome-bg" style={{
        background: 'radial-gradient(ellipse at center, rgba(201,151,90,0.06) 0%, transparent 70%)'
      }} />
      <div className="welcome-overlay" />

      <div className="welcome-inner">
        <div className="reveal">
          <p className="section-tag">Our Philosophy</p>
        </div>
        <div className="reveal reveal-delay-1">
          <h2 className="section-title">
            Welcome to <em>Lunave</em>
          </h2>
        </div>
        <div className="reveal reveal-delay-2">
          <p className="section-body">
            Welcome to Lunave Perfumes, where the spirit of victory and triumph come alive
            through scents that empower and inspire. Our curated collection, aptly named "Victory
            Scented," is a celebration of success and elegance, designed to unleash your victorious
            essence. Indulge in the sweet taste of triumph with captivating fragrances that tell
            the tale of your achievements. At Lunave, we believe that every victory deserves a
            signature scent, and we are dedicated to providing unforgettable fragrances that
            elevate your spirit and empower your journey.
          </p>
        </div>
      </div>
    </section>
  )
}
