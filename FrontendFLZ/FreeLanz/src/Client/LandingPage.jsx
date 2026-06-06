import React, { useState, useEffect, useCallback } from 'react';

const testimonials = [
  {
    quote: "Finding reliable developers used to take weeks. With this platform, I found the perfect match in just two days!",
    name: "Alex Rivera",
    role: "Startup Founder",
  },
  {
    quote: "Great user interface and active clients. The short video feature helps me stand out way better than a standard resume.",
    name: "Alisha Chinai",
    role: "UI/UX Designer",
  },
  {
    quote: "Very amazing website. I can make so much money with this website. I'm very grateful that I found this beautiful website.",
    name: "Ronald Johnson",
    role: "Freelancer",
  },
  {
    quote: "The integrated chat and real-time trackers make managing remote design milestones completely stress-free.",
    name: "Daniel Silva",
    role: "Product Manager",
  },
  {
    quote: "Highly recommended for modern tech freelancers. Payments are secure, and communication is completely transparent.",
    name: "Sarah Connor",
    role: "Core Developer",
  },
];

export default function LandingPage({ onChangePage }) {
  const [activeSlide, setActiveSlide] = useState(2);
  const [cardWidth, setCardWidth] = useState(360);
  const GAP = 30;

  // Load Google Fonts & Font Awesome
  useEffect(() => {
    const font = document.createElement('link');
    font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap';
    document.head.appendChild(font);

    const fa = document.createElement('link');
    fa.rel = 'stylesheet';
    fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(fa);

    return () => {
      document.head.removeChild(font);
      document.head.removeChild(fa);
    };
  }, []);

  // Recalculate card width on resize
  const updateCardWidth = useCallback(() => {
    if (window.innerWidth <= 968) {
      setCardWidth(290);
    } else {
      setCardWidth(360);
    }
  }, []);

  useEffect(() => {
    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, [updateCardWidth]);

  // Compute translateX so active card is centered
  const getTranslateX = () => {
    const containerWidth = window.innerWidth <= 968 ? 330 : 1100;
    return -(activeSlide * (cardWidth + GAP)) + containerWidth / 2 - cardWidth / 2;
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#030647', color: '#fff', overflowX: 'hidden', position: 'relative' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }

        body { background: radial-gradient(circle at 50% 0%, #0c149c 0%, #04073b 70%); }

        /* ── DECORATIONS ── */
        .lp2-decor-star {
          position: absolute;
          background: #ccff00;
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
          opacity: 0.6;
          filter: drop-shadow(0 0 10px #ccff00);
          animation: lp2-pulse 3s infinite alternate;
        }
        .lp2-decor-hex {
          position: absolute;
          background: rgba(204, 255, 0, 0.18);
          clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
          filter: drop-shadow(0 0 6px rgba(204, 255, 0, 0.6));
          animation: lp2-float 6s infinite ease-in-out;
        }
        @keyframes lp2-pulse {
          0%   { transform: scale(0.8); opacity: 0.4; }
          100% { transform: scale(1.2); opacity: 0.8; }
        }
        @keyframes lp2-float {
          0%, 100% { transform: translateY(0)    rotate(0deg); }
          50%       { transform: translateY(-15px) rotate(10deg); }
        }

        /* ── NAVBAR ── */
        .lp2-navbar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 5%; height: 70px; position: relative; z-index: 10;
        }
        .lp2-logo {
          font-weight: 900; font-size: 26px; color: #ccff00;
          font-style: italic; letter-spacing: -1px; cursor: pointer;
          transition: text-shadow 0.3s;
        }
        .lp2-logo:hover { text-shadow: 0 0 30px rgba(204,255,0,0.8); }
        .lp2-nav-links { display: flex; list-style: none; gap: 25px; }
        .lp2-nav-links a {
          color: #fff; text-decoration: none; font-size: 13px;
          font-weight: bold; letter-spacing: 0.5px; transition: color 0.2s;
        }
        .lp2-nav-links a:hover { color: #ccff00; }
        .lp2-btn-primary {
          background-color: #ccff00; color: #050b8b; border: none;
          padding: 8px 22px; border-radius: 20px; font-weight: 700;
          font-size: 13px; cursor: pointer; transition: 0.3s; font-family: inherit;
        }
        .lp2-btn-primary:hover, .lp2-btn-neon:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 30px rgba(204,255,0,0.6);
        }
        .lp2-btn-neon {
          background-color: #ccff00; color: #050b8b; border: none;
          padding: 14px 40px; border-radius: 25px; font-weight: 700;
          font-size: 1rem; cursor: pointer; font-family: inherit;
          box-shadow: 0 5px 25px rgba(204,255,0,0.4); transition: 0.3s;
        }

        /* ── HERO ── */
        .lp2-hero {
          display: flex; flex-direction: column; align-items: center;
          text-align: center; padding: 100px 10% 60px; position: relative; z-index: 2;
        }
        .lp2-hero-title {
          font-size: 4.2rem; font-weight: 800; line-height: 1.15;
          letter-spacing: 1px; margin-bottom: 25px;
        }
        .lp2-hero-sub {
          font-size: 1.15rem; max-width: 650px; opacity: 0.75;
          margin-bottom: 45px; line-height: 1.7;
        }
        .lp2-stats {
          display: flex; gap: 100px; margin-top: 80px;
        }
        .lp2-stat h3 { font-size: 2.8rem; color: #4cc9f0; font-weight: 700; }
        .lp2-stat p  { font-size: 0.85rem; letter-spacing: 1px; opacity: 0.6; margin-top: 5px; }

        /* ── FEATURES ── */
        .lp2-features { padding: 120px 12%; position: relative; }
        .lp2-section-title {
          font-size: 2.5rem; font-weight: 800; text-align: center;
          margin-bottom: 60px; line-height: 1.3;
        }
        .lp2-feature-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 30px; align-items: center;
        }
        .lp2-card {
          border-radius: 24px; padding: 45px; height: 240px;
          display: flex; flex-direction: column; justify-content: center; transition: 0.3s;
        }
        .lp2-card-neon {
          background-color: #ccff00; color: #050b8b; position: relative;
        }
        .lp2-card-neon h3 { font-size: 2rem; font-weight: 800; line-height: 1.3; }
        .lp2-card-neon .lp2-card-icon {
          font-size: 4rem; position: absolute; right: 40px; bottom: 30px;
        }
        .lp2-card-dark {
          background-color: #091082; border: 1px solid rgba(255,255,255,0.08);
        }
        .lp2-card-dark p { font-size: 1.05rem; line-height: 1.6; opacity: 0.85; }

        /* ── TESTIMONIALS ── */
        .lp2-testimonials {
          padding: 100px 0 140px; display: flex; flex-direction: column;
          align-items: center; width: 100%; overflow: hidden;
        }
        .lp2-testi-title { font-size: 2.5rem; font-weight: 800; text-align: center; margin-bottom: 60px; color: #ccff00; }
        .lp2-testi-container { width: 100%; max-width: 1100px; padding: 20px; overflow: hidden; }
        .lp2-testi-track { display: flex; gap: 30px; align-items: center; transition: transform 0.5s cubic-bezier(0.25,1,0.5,1); }
        .lp2-testi-card {
          flex: 0 0 360px; background: rgba(255,255,255,0.12); color: #fff;
          backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px; padding: 35px; opacity: 0.4;
          transform: scale(0.9); transition: all 0.4s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15); position: relative;
        }
        .lp2-testi-card.active {
          background: #fff; color: #1a1a1a; opacity: 1;
          transform: scale(1.05); box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        .lp2-quote-mark {
          font-size: 4rem; font-family: serif; position: absolute;
          top: 5px; left: 20px; color: rgba(0,0,0,0.05); line-height: 1;
        }
        .lp2-testi-card.active .lp2-quote-mark { color: rgba(0,0,0,0.08); }
        .lp2-quote { font-size: 1rem; line-height: 1.6; margin-bottom: 30px; position: relative; z-index: 2; }
        .lp2-user-info { display: flex; align-items: center; gap: 15px; }
        .lp2-avatar {
          width: 45px; height: 45px; border-radius: 50%;
          background: linear-gradient(45deg, #ccff00, #4cc9f0); flex-shrink: 0;
        }
        .lp2-user-info h4 { font-size: 1rem; font-weight: 700; }
        .lp2-user-info span { font-size: 0.85rem; opacity: 0.6; }

        /* ── DOTS ── */
        .lp2-dots { display: flex; gap: 10px; margin-top: 50px; }
        .lp2-dot {
          width: 8px; height: 8px; background: rgba(255,255,255,0.3);
          border-radius: 50%; cursor: pointer; transition: all 0.3s ease; border: none;
        }
        .lp2-dot.active { background: #ccff00; width: 28px; border-radius: 4px; }

        /* ── RESPONSIVE ── */
        @media (max-width: 968px) {
          .lp2-nav-links { display: none; }
          .lp2-hero-title { font-size: 2.6rem; }
          .lp2-stats { gap: 40px; flex-wrap: wrap; justify-content: center; }
          .lp2-feature-grid { grid-template-columns: 1fr; }
          .lp2-testi-card { flex: 0 0 290px; }
          .lp2-testi-container { max-width: 330px; }
        }
      `}</style>

      {/* ── DEKORASI BG ── */}
      <div className="lp2-decor-star" style={{ width: 30, height: 30, top: '15%', left: '18%' }} />
      <div className="lp2-decor-star" style={{ width: 25, height: 25, top: '25%', right: '25%' }} />
      <div className="lp2-decor-star" style={{ width: 35, height: 35, top: '45%', right: '15%' }} />
      <div className="lp2-decor-hex" style={{ width: 60, height: 60, top: '12%', right: '12%' }} />
      <div className="lp2-decor-hex" style={{ width: 80, height: 80, top: '30%', left: '8%', animationDelay: '2s' }} />
      <div className="lp2-decor-hex" style={{ width: 50, height: 50, top: '65%', left: '10%', animationDelay: '4s' }} />

      {/* ── NAVBAR ── */}
      <nav className="lp2-navbar">
        <div className="lp2-logo" onClick={() => onChangePage('landing')}>FreeLanZ</div>
        <ul className="lp2-nav-links">
          <li>
            <a href="#explore" onClick={(e) => { e.preventDefault(); onChangePage('explore'); }}>
              EXPLORE
            </a>
          </li>
          <li>
            <a href="#chat" onClick={(e) => { e.preventDefault(); onChangePage('chat'); }}>
              CHAT
            </a>
          </li>
          <li>
            <a href="#project" onClick={(e) => { e.preventDefault(); onChangePage('project'); }}>
              PROJECT
            </a>
          </li>
        </ul>
        <button className="lp2-btn-primary" onClick={() => onChangePage('chooseRole')}>
          Get Started
        </button>
      </nav>

      {/* ── HERO ── */}
      <section className="lp2-hero">
        <h1 className="lp2-hero-title">
          FIND YOUR <span style={{ color: '#ccff00' }}>PERFECT MATCH</span>
          <br />OF WORKING.
        </h1>
        <p className="lp2-hero-sub">
          A new way for freelancers and clients to connect through shared vision, creativity, and goals.
        </p>
        <button className="lp2-btn-neon" onClick={() => onChangePage('chooseRole')}>
          Sign Up Now!
        </button>

        <div className="lp2-stats">
          <div className="lp2-stat">
            <h3>12K+</h3>
            <p>FREELANCERS</p>
          </div>
          <div className="lp2-stat">
            <h3>98%</h3>
            <p>SATISFACTION</p>
          </div>
          <div className="lp2-stat">
            <h3>&lt;2h</h3>
            <p>AVG RESPONSE</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="lp2-features">
        <h2 className="lp2-section-title">
          EVERYTHING YOU NEED <br /> IN ONE PLATFORM
        </h2>

        <div className="lp2-feature-grid">
          {/* Row 1 */}
          <div className="lp2-card lp2-card-neon">
            <h3>Explore <br /> Short Video</h3>
            <div className="lp2-card-icon">
              <svg viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '3.5rem', height: '3.5rem' }}>
                {/* Phone frame */}
                <rect x="4" y="2" width="56" height="76" rx="10" ry="10" stroke="#050b8b" strokeWidth="6" fill="none" />
                {/* Screen inner */}
                <rect x="11" y="12" width="42" height="54" rx="4" fill="none" stroke="#050b8b" strokeWidth="3" />
                {/* Play triangle */}
                <polygon points="26,30 26,52 46,41" fill="#050b8b" />
              </svg>
            </div>
          </div>
          <div className="lp2-card lp2-card-dark">
            <p>
              Discover freelancers through immersive short video previews and creative showcases,
              making it easier to find the perfect talent instantly.
            </p>
          </div>

          {/* Row 2 */}
          <div className="lp2-card lp2-card-dark">
            <p>
              Communicate instantly with real-time messaging built directly into the platform.
              No more switching between different apps to discuss projects.
            </p>
          </div>
          <div className="lp2-card lp2-card-neon">
            <h3>Integrated <br /> Chat</h3>
            <div className="lp2-card-icon">
              <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '3.8rem', height: '3.8rem' }}>
                {/* Back bubble (kiri atas) */}
                <path
                  d="M10 5 Q10 5 45 5 Q68 5 68 25 Q68 40 55 46 Q48 49 38 49 L20 65 L24 49 Q10 47 10 30 Q10 5 10 5 Z"
                  stroke="#050b8b" strokeWidth="5" fill="none" strokeLinejoin="round" strokeLinecap="round"
                />
                {/* Front bubble (kanan bawah) */}
                <path
                  d="M35 30 Q35 30 78 30 Q95 30 95 50 Q95 68 78 68 L82 85 L62 68 Q35 68 35 50 Q35 30 35 30 Z"
                  stroke="#050b8b" strokeWidth="5" fill="white" strokeLinejoin="round" strokeLinecap="round"
                />
                {/* Tiga titik di dalam front bubble */}
                <circle cx="53" cy="49" r="3.5" fill="#050b8b" />
                <circle cx="65" cy="49" r="3.5" fill="#050b8b" />
                <circle cx="77" cy="49" r="3.5" fill="#050b8b" />
              </svg>
            </div>
          </div>

          {/* Row 3 */}
          <div className="lp2-card lp2-card-neon">
            <h3>Project <br /> Management</h3>
            <div className="lp2-card-icon">
              <svg viewBox="0 0 110 108" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '3.8rem', height: '3.8rem' }}>
                {/* ── Top-left box (browser/list layout) ── */}
                <rect x="2" y="2" width="38" height="33" rx="3" stroke="#050b8b" strokeWidth="3" fill="none" />
                <line x1="2" y1="9" x2="40" y2="9" stroke="#050b8b" strokeWidth="2" />
                <rect x="5" y="4.5" width="2.5" height="2.5" rx="0.5" fill="#050b8b" />
                <rect x="9.5" y="4.5" width="2.5" height="2.5" rx="0.5" fill="#050b8b" />
                <rect x="14" y="4.5" width="2.5" height="2.5" rx="0.5" fill="#050b8b" />
                <rect x="5" y="12" width="8" height="7" rx="1" stroke="#050b8b" strokeWidth="1.5" fill="none" />
                <line x1="16" y1="13.5" x2="37" y2="13.5" stroke="#050b8b" strokeWidth="1.5" />
                <line x1="16" y1="17" x2="37" y2="17" stroke="#050b8b" strokeWidth="1.5" />
                <line x1="5" y1="22" x2="37" y2="22" stroke="#050b8b" strokeWidth="1.5" />
                <line x1="5" y1="26" x2="37" y2="26" stroke="#050b8b" strokeWidth="1.5" />
                <line x1="5" y1="30" x2="22" y2="30" stroke="#050b8b" strokeWidth="1.5" />

                {/* ── Top-right box (bar chart) ── */}
                <rect x="70" y="2" width="38" height="33" rx="3" stroke="#050b8b" strokeWidth="3" fill="none" />
                <line x1="70" y1="9" x2="108" y2="9" stroke="#050b8b" strokeWidth="2" />
                <rect x="73" y="4.5" width="2.5" height="2.5" rx="0.5" fill="#050b8b" />
                <rect x="77.5" y="4.5" width="2.5" height="2.5" rx="0.5" fill="#050b8b" />
                <rect x="82" y="4.5" width="2.5" height="2.5" rx="0.5" fill="#050b8b" />
                <rect x="76" y="22" width="5" height="8" fill="#050b8b" />
                <rect x="83" y="17" width="5" height="13" fill="#050b8b" />
                <rect x="90" y="13" width="5" height="17" fill="#050b8b" />
                <rect x="97" y="19" width="5" height="11" fill="#050b8b" />
                <line x1="73" y1="30" x2="104" y2="30" stroke="#050b8b" strokeWidth="1.5" />

                {/* ── Connectors: top boxes → cylinder top ── */}
                <line x1="21" y1="35" x2="21" y2="45" stroke="#050b8b" strokeWidth="2" />
                <line x1="21" y1="45" x2="40" y2="45" stroke="#050b8b" strokeWidth="2" />
                <line x1="40" y1="45" x2="40" y2="50" stroke="#050b8b" strokeWidth="2" />
                <line x1="89" y1="35" x2="89" y2="45" stroke="#050b8b" strokeWidth="2" />
                <line x1="89" y1="45" x2="70" y2="45" stroke="#050b8b" strokeWidth="2" />
                <line x1="70" y1="45" x2="70" y2="50" stroke="#050b8b" strokeWidth="2" />

                {/* ── Cylinder (database) ── */}
                <ellipse cx="55" cy="50" rx="17" ry="5" stroke="#050b8b" strokeWidth="2.5" fill="none" />
                <line x1="38" y1="50" x2="38" y2="68" stroke="#050b8b" strokeWidth="2.5" />
                <line x1="72" y1="50" x2="72" y2="68" stroke="#050b8b" strokeWidth="2.5" />
                <ellipse cx="55" cy="59" rx="17" ry="5" stroke="#050b8b" strokeWidth="2.5" fill="none" />
                <ellipse cx="55" cy="68" rx="17" ry="5" stroke="#050b8b" strokeWidth="2.5" fill="none" />

                {/* ── Connectors: cylinder → bottom boxes ── */}
                <line x1="38" y1="59" x2="17" y2="59" stroke="#050b8b" strokeWidth="2" />
                <line x1="17" y1="59" x2="17" y2="77" stroke="#050b8b" strokeWidth="2" />
                <line x1="72" y1="59" x2="93" y2="59" stroke="#050b8b" strokeWidth="2" />
                <line x1="93" y1="59" x2="93" y2="77" stroke="#050b8b" strokeWidth="2" />

                {/* ── Bottom-left box ── */}
                <rect x="2" y="77" width="30" height="28" rx="3" stroke="#050b8b" strokeWidth="3" fill="none" />
                <line x1="6" y1="84" x2="28" y2="84" stroke="#050b8b" strokeWidth="1.5" />
                <line x1="6" y1="89" x2="28" y2="89" stroke="#050b8b" strokeWidth="1.5" />
                <line x1="6" y1="94" x2="28" y2="94" stroke="#050b8b" strokeWidth="1.5" />

                {/* ── Bottom-right box ── */}
                <rect x="78" y="77" width="30" height="28" rx="3" stroke="#050b8b" strokeWidth="3" fill="none" />
                <line x1="82" y1="84" x2="104" y2="84" stroke="#050b8b" strokeWidth="1.5" />
                <line x1="82" y1="89" x2="104" y2="89" stroke="#050b8b" strokeWidth="1.5" />
                <line x1="82" y1="94" x2="104" y2="94" stroke="#050b8b" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
          <div className="lp2-card lp2-card-dark">
            <p>
              Manage and track projects efficiently in an organized workspace.
              Monitor progress, timelines, and collaboration with ease.
            </p>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="lp2-testimonials">
        <h2 className="lp2-testi-title">OUR TESTIMONIALS</h2>

        <div className="lp2-testi-container">
          <div
            className="lp2-testi-track"
            style={{ transform: `translateX(${getTranslateX()}px)` }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`lp2-testi-card${i === activeSlide ? ' active' : ''}`}
                onClick={() => setActiveSlide(i)}
                style={{ cursor: 'pointer' }}
              >
                {i === activeSlide && <span className="lp2-quote-mark">"</span>}
                <p className="lp2-quote">{t.quote}</p>
                <div className="lp2-user-info">
                  <div className="lp2-avatar" />
                  <div>
                    <h4>{t.name}</h4>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="lp2-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`lp2-dot${i === activeSlide ? ' active' : ''}`}
              onClick={() => setActiveSlide(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
