/**
 * Landing.jsx
 * ------------------------------------------------------------
 * MacroTok — Landing Page Component
 *
 * Responsibilities:
 *  - Render the public landing page before login
 *  - Display the hero section with an auto-rotating slideshow
 *  - Provide navigation links to features, FAQ, and actions
 *  - Use global light/dark theme applied in App.jsx
 *  - Support keyboard and pointer interactions
 * ------------------------------------------------------------
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./global.css";  // Global theme variables and UI styles

export default function Landing() {
  const navigate = useNavigate();

  /**
   * ------------------------------------------------------------
   * HERO SLIDESHOW IMAGES
   * ------------------------------------------------------------
   * useMemo is used so the array is created once and not 
   * recreated on every render.
   */
  const IMAGES = useMemo(
    () => [
      "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?semt=ais_hybrid&w=740&q=80",
      "https://media.hellofresh.com/f_auto,fl_lossy,q_auto/hellofresh_website/us/hp-homepage2025/Healthier-Made-Easier.png",
      "https://alittleinsanity.com/wp-content/uploads/2012/03/Natural-Breakfast-Smoothie-Recipe-Gluten-Free-Vegan-1024x683.jpg",
      "https://joyfoodsunshine.com/wp-content/uploads/2020/03/smoothie-bowl-recipe-1-500x500.jpg",
      "https://www.allrecipes.com/thmb/GiaXx_OGXO0Oo_yhaLWpKW8YTtQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11706191_High-Protein-Broccoli-Cheddar-Soup_Nicole-Russell_4x3-e2eaaaf242a149de950b3dc0b066833c.jpg",
    ],
    []
  );

  /**
   * idx = current index of slideshow image
   * paused = determines whether auto-rotation is enabled
   */
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  // Store interval id for cleanup
  const intervalRef = useRef(null);

  /**
   * ------------------------------------------------------------
   * AUTO SLIDESHOW ROTATION (5 seconds)
   * ------------------------------------------------------------
   * When paused = true, slideshow stops advancing.
   * Clears interval on unmount or when paused changes.
   */
  useEffect(() => {
    if (paused) return;

    intervalRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % IMAGES.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [IMAGES.length, paused]);

  // Manual navigation arrows
  const goPrev = () => setIdx((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  const goNext = () => setIdx((i) => (i + 1) % IMAGES.length);

  return (
    <main className="landing">
      {/* ------------------------------------------------------------
         HEADER: Brand name + navigation links
         ------------------------------------------------------------ */}
      <header className="landing__header">
        <div className="brand" aria-label="MacroTok home">
          <span className="brand__dot" />
          <span className="brand__name">MacroTok</span>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <a href="#features" className="nav__link">Features</a>
          <a href="#how" className="nav__link">How it works</a>
          <a href="#faq" className="nav__link">FAQ</a>

          {/* Authentication buttons */}
          <a className="btn btn--outline" href="/login">Log in</a>
          <a className="btn btn--filled" href="/signup">Sign up</a>
        </nav>
      </header>

      {/* ------------------------------------------------------------
         HERO SECTION: Introductory text + slideshow
         ------------------------------------------------------------ */}
      <section className="hero">
        {/* Text content */}
        <div className="hero__copy">
          <h1 className="hero__title">Plan meals that fit your life.</h1>

          <p className="hero__subtitle">
            Schedule recipes, track intake totals, and review weekly or monthly
            inside one dashboard.
          </p>

          <div className="hero__cta">
            <button
              className="btn btn--filled btn--lg"
              onClick={() => navigate("/calendar")}
            >
              Open Calendar
            </button>

            <a className="btn btn--outline btn--lg" href="#features">
              See Features
            </a>
          </div>

          <ul className="hero__points">
            <li>Fast add: Breakfast, Lunch, Dinner</li>
            <li>Adjust or remove any entry</li>
            <li>Weekly and monthly overviews</li>
          </ul>
        </div>

        {/* Slideshow container */}
        <div
          className="hero__image"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <img
            key={IMAGES[idx]}
            src={IMAGES[idx]}
            alt="Healthy meal preview"
            className="hero__img hero__img--fade"
          />

          {/* Slideshow control bar */}
          <div className="hero__controls" aria-label="Slideshow controls">
            <button className="ctrl" onClick={goPrev} aria-label="Previous slide">
              ‹
            </button>

            <div className="dots" role="tablist">
              {IMAGES.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={i === idx}
                  className={`dot ${i === idx ? "dot--active" : ""}`}
                  onClick={() => setIdx(i)}
                />
              ))}
            </div>

            <button className="ctrl" onClick={goNext} aria-label="Next slide">
              ›
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------
         FEATURES SECTION
         ------------------------------------------------------------ */}
      <section id="features" className="features">
        <h2 className="section__title">What you can do</h2>

        <div className="features__grid">
          <article className="feature">
            <div className="feature__icon">Schedule Recipes</div>
            <h3 className="feature__title">Schedule Recipes</h3>
            <p className="feature__text">Assign meals to any date on your calendar.</p>
          </article>

          <article className="feature">
            <div className="feature__icon">Quick Add</div>
            <h3 className="feature__title">Quick Add</h3>
            <p className="feature__text">Add meals with one action.</p>
          </article>

          <article className="feature">
            <div className="feature__icon">Edit & Remove</div>
            <h3 className="feature__title">Edit & Remove</h3>
            <p className="feature__text">Modify or clear any entry at any time.</p>
          </article>

          <article className="feature">
            <div className="feature__icon">Intake Review</div>
            <h3 className="feature__title">Intake Review</h3>
            <p className="feature__text">View daily totals and historical summaries.</p>
          </article>
        </div>
      </section>

      {/* ------------------------------------------------------------
         HOW IT WORKS SECTION
         ------------------------------------------------------------ */}
      <section id="how" className="how">
        <h2 className="section__title">How it works</h2>
        <ol className="steps">
          <li className="step"><span>1</span> Add meals to the calendar</li>
          <li className="step"><span>2</span> Track intake through the day</li>
          <li className="step"><span>3</span> Review weekly or monthly</li>
        </ol>
      </section>

      {/* ------------------------------------------------------------
         FOOTER
         ------------------------------------------------------------ */}
      <footer className="footer">
        <div className="footer__row">
          <div>© {new Date().getFullYear()} MacroTok</div>

          <div className="footer__links">
            <a href="#faq">FAQ</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
