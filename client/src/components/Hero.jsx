import ProductCarousel from './ProductCarousel.jsx'
import "../styles/Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">

        {/* LEFT — text */}
        <div className="hero-text">
          <p className="hero-tag">New Collection 2025</p>
          <h1 className="hero-title">
            Elevate Your Spirit with <br />
            <em>Victory</em> Scented <br />
            Fragrances
          </h1>
          <p className="hero-subtitle">
            Shop now and embrace the sweet smell of victory with Lunave.
            Each fragrance tells the story of your journey.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Shop Now</button>
            <button className="btn-ghost">Our Story</button>
          </div>
        </div>

        {/* RIGHT — embedded carousel */}
        <div className="hero-stage">
          <ProductCarousel embedded />
        </div>

      </div>
    </section>
  );
}
