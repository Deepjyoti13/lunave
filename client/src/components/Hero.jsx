import "../styles/Hero.css";

export default function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        {/* LEFT SIDE */}
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


        {/* RIGHT SIDE */}
        <div className="hero-stage">

          {/* WATER SPLASH
          <svg
            className="water-svg"
            viewBox="0 0 600 600"
          >

            <defs>

              <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
                <stop offset="40%" stopColor="#cfe6ff" stopOpacity="0.6"/>
                <stop offset="70%" stopColor="#8fbfff" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#6ea8ff" stopOpacity="0"/>
              </linearGradient>

            </defs>


            {/* LEFT SPLASH */}
            {/* <path
              className="water-splash-left"
              d="
              M300 520
              C260 500 200 440 170 360
              C150 310 150 260 180 220
              C210 190 250 180 300 210
              C260 240 240 300 250 360
              C260 420 280 470 300 520
              Z"
              fill="url(#waterGrad)"
            /> */}

            {/* RIGHT SPLASH */}
            {/* <path
              className="water-splash-right"
              d="
              M300 520
              C340 500 400 440 430 360
              C450 310 450 260 420 220
              C390 190 350 180 300 210
              C340 240 360 300 350 360
              C340 420 320 470 300 520
              Z"
              fill="url(#waterGrad)"
            /> */}


            {/* WATER POOL */}
            {/* <ellipse
              className="water-pool"
              cx="300"
              cy="520"
              rx="120"
              ry="18"
            /> */}

            {/* RIPPLES */}
            {/* <ellipse className="ripple r1" cx="300" cy="520" rx="80" ry="12"/>
            <ellipse className="ripple r2" cx="300" cy="520" rx="120" ry="18"/>
            <ellipse className="ripple r3" cx="300" cy="520" rx="160" ry="24"/> */}


            {/* DROPLETS */}
            {/* <circle className="drop d1" cx="210" cy="210" r="6"/>
            <circle className="drop d2" cx="390" cy="210" r="6"/>
            <circle className="drop d3" cx="180" cy="260" r="4"/>
            <circle className="drop d4" cx="420" cy="260" r="4"/> */}
{/* 
          </svg> */}


          {/* PERFUME BOTTLE */}
{/* <video autoPlay loop muted className="hero-video">
  <source src="/output.mp4" type="video/mp4" />
</video> */}

        </div>

      </div>
    </section>
  );
}