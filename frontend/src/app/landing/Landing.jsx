/**
 * Landing.jsx
 * ---------------------------------------------
 * MacroTok — Landing Page Component
 *
 * Features implemented:
 *  1. Hero section with a 5-image auto-slideshow (rotates every 5 seconds)
 *  2. Light/Dark theme toggle with persistent user preference
 *  3. Responsive layout with intro text, feature highlights, and footer
 *  4. Clean, accessible UI (keyboard + hover support)
 * ---------------------------------------------
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Landing.css";

export default function Landing() {
  /* ==========================================================
     THEME HANDLING (Light / Dark Mode)
     ==========================================================
     - Reads user preference from localStorage or system settings.
     - Toggles `.dark` class on <body> to switch theme colors.
     - Persists theme choice for future sessions.
  ========================================================== */

  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [theme, setTheme] = useState(() => {
    // Use saved theme if available, otherwise follow system preference
    const saved =
      typeof window !== "undefined" && localStorage.getItem("theme");
    return saved || (prefersDark ? "dark" : "light");
  });

  // Apply theme and save user choice
  useEffect(() => {
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Function to toggle between dark and light modes
  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  /* ==========================================================
     HERO SLIDESHOW (Auto-rotating background images)
     ==========================================================
     - Rotates between 5 provided images every 5 seconds.
     - User can navigate manually (prev / next / dots).
     - Pauses when hovered or focused for better accessibility.
  ========================================================== */

  // 5 image URLs provided by user
  const IMAGES = useMemo(
    () => [
      
      "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?semt=ais_hybrid&w=740&q=80",
      "https://media.hellofresh.com/f_auto,fl_lossy,q_auto/hellofresh_website/us/hp-homepage2025/Healthier-Made-Easier.png",
      "https://alittleinsanity.com/wp-content/uploads/2012/03/Natural-Breakfast-Smoothie-Recipe-Gluten-Free-Vegan-1024x683.jpg",
      "https://joyfoodsunshine.com/wp-content/uploads/2020/03/smoothie-bowl-recipe-1-500x500.jpg"," https://www.allrecipes.com/thmb/GiaXx_OGXO0Oo_yhaLWpKW8YTtQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/11706191_High-Protein-Broccoli-Cheddar-Soup_Nicole-Russell_4x3-e2eaaaf242a149de950b3dc0b066833c.jpg"," "
    ],
    []
  );

  // State for slideshow index and pause state
  const [idx, setIdx] = useState(0); // current image index
  const [paused, setPaused] = useState(false); // stop auto-rotation when true
  const intervalRef = useRef(null); // reference to timer interval

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    if (paused) return; // skip rotation when paused
    intervalRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % IMAGES.length); // go to next image cyclically
    }, 5000);

    // cleanup timer when unmounted or paused
    return () => clearInterval(intervalRef.current);
  }, [IMAGES.length, paused]);

  // Manual navigation handlers
  const goPrev = () => setIdx((i) => (i - 1 + IMAGES.length) % IMAGES.length);
  const goNext = () => setIdx((i) => (i + 1) % IMAGES.length);

  /* ==========================================================
     PAGE STRUCTURE
     ==========================================================
     1. Header (brand + navigation + theme toggle)
     2. Hero section (intro text + slideshow)
     3. Features section (list of features)
     4. How It Works section (3-step list)
     5. Footer
  ========================================================== */

  return (
    <main className="landing">
      {/* =====================================================
          HEADER SECTION
          -----------------------------------------------------
          - Displays MacroTok logo/brand
          - Navigation links
          - Theme toggle + login/signup buttons
      ===================================================== */}
      <header className="landing__header">
        <div className="brand" aria-label="MacroTok home">
          <span className="brand__dot" />
          <span className="brand__name">MacroTok</span>
        </div>

        <nav className="nav" aria-label="Main navigation">
          <a href="#features" className="nav__link">Features</a>
          <a href="#how" className="nav__link">How it works</a>
          <a href="#faq" className="nav__link">FAQ</a>

          {/* Dark / Light mode toggle button */}
          <button
            className="btn btn--ghost"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title="Toggle theme"
          >
            {theme === "dark" ? "🌞" : "🌓"}
          </button>

          {/* Auth buttons */}
          <a className="btn btn--outline" href="/login">Log in</a>
          <a className="btn btn--filled" href="/signup">Sign up</a>
        </nav>
      </header>

      {/* =====================================================
          HERO SECTION (Slideshow + Text)
          -----------------------------------------------------
          - Shows rotating food images with fade animation
          - Displays main slogan, CTA buttons, and key points
      ===================================================== */}
      <section className="hero">
        {/* Text / Marketing Copy */}
        <div className="hero__copy">
          <h1 className="hero__title">Plan meals that fit your life.</h1>
          <p className="hero__subtitle">
            Schedule recipes, track intake (e.g.,{" "}
            <strong>1600/1900 kcal</strong>), and review weekly or monthly — all
            in one clean dashboard.
          </p>

          {/* CTA Buttons */}
          <div className="hero__cta">
            <a className="btn btn--filled btn--lg" href="/calendar">
              Open Calendar
            </a>
            <a className="btn btn--outline btn--lg" href="#features">
              See Features
            </a>
          </div>

          {/* Quick selling points */}
          <ul className="hero__points">
            <li>Fast add: Breakfast / Lunch / Dinner</li>
            <li>Quick edit & remove any day</li>
            <li>Weekly & Monthly review views</li>
          </ul>
        </div>

        {/* Image Slideshow */}
        <div
          className="hero__image"
          // Pause the slideshow when user interacts
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Current active image */}
          <img
            key={IMAGES[idx]} // key triggers fade transition
            src={IMAGES[idx]}
            alt="Healthy meal preview"
            className="hero__img hero__img--fade"
          />

          {/* Slide Controls (Prev, Dots, Next) */}
          <div className="hero__controls" aria-label="Slideshow controls">
            <button
              className="ctrl"
              onClick={goPrev}
              aria-label="Previous slide"
            >
              ‹
            </button>

            {/* Dots navigation */}
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

            <button
              className="ctrl"
              onClick={goNext}
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURES SECTION
          -----------------------------------------------------
          - Highlights 4 main capabilities of MacroTok
      ===================================================== */}
      <section id="features" className="features">
        <h2 className="section__title">What you can do</h2>

        <div className="features__grid">
          <article className="feature">
            <div className="feature__icon">🗓️</div>
            <h3 className="feature__title">Schedule Recipes</h3>
            <p className="feature__text">
              Drop meals onto any date — just like your Calendar.
            </p>
          </article>

          <article className="feature">
            <div className="feature__icon">🍽️</div>
            <h3 className="feature__title">Quick Add</h3>
            <p className="feature__text">
              One-tap Breakfast, Lunch, or Dinner buttons to save time.
            </p>
          </article>

          <article className="feature">
            <div className="feature__icon">✏️</div>
            <h3 className="feature__title">Edit & Remove</h3>
            <p className="feature__text">
              Swap meals, adjust portions, or remove entries in one click.
            </p>
          </article>

          <article className="feature">
            <div className="feature__icon">📊</div>
            <h3 className="feature__title">Intake Review</h3>
            <p className="feature__text">
              Track daily totals like <strong>1600/1900 kcal</strong> and see
              your progress weekly or monthly.
            </p>
          </article>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS SECTION
          -----------------------------------------------------
          - Simple 3-step explanation for new users
      ===================================================== */}
      <section id="how" className="how">
        <h2 className="section__title">How it works</h2>
        <ol className="steps">
          <li className="step"><span>1</span> Add your meals to the Calendar</li>
          <li className="step"><span>2</span> Track intake as you go</li>
          <li className="step"><span>3</span> Review weekly & monthly</li>
        </ol>
      </section>

      {/* =====================================================
          FOOTER SECTION
          -----------------------------------------------------
          - Displays copyright
          - Links to FAQ, Privacy, Terms
      ===================================================== */}
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
