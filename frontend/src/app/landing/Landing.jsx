import React, { useEffect, useMemo, useRef, useState } from "react";
import "./Landing.css";
import { auth } from "../../startFirebase";
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom";

function AuthButton({ theme }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return null;

  return !user ? (
    <button className={`btn btn--outline ${theme === "dark" ? "light" : "dark"}`} onClick={() => navigate("/login")}>
      Log in
    </button>
  ) : (
    <button
      className={`btn btn--outline ${theme === "dark" ? "light" : "dark"}`}
      onClick={() => signOut(auth)}
    >
      Log out
    </button>
  );
}

export default function Landing() {

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


  return (
    <main className="landing">

      <header className="landing__header">
        <div className="brand" aria-label="MacroTok home">
          <span className="brand__dot" />
          <span className="brand__name">MacroTok</span>
        </div>

        <nav className="nav" aria-label="Main navigation">

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
          <AuthButton theme={theme} />
        </nav>
      </header>

      <section className="hero">
        {/* Text / Marketing Copy */}
        <div className="hero__copy">
          <h1 className="hero__title">Plan meals that fit your life.</h1>
          <p className="hero__subtitle">
            Schedule recipes, track intake and review weekly or monthly — all
            in one clean dashboard.
          </p>

          {/* CTA Buttons */}
          <div className="hero__cta">
            <a className="btn btn--filled btn--lg" href="/calendar">
              Open Calendar
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

      <section className="features">
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

      <section className="how">
        <h2 className="section__title">How it works</h2>
        <ol className="steps">
          <li className="step"><span>1</span> Add your meals to the Calendar</li>
          <li className="step"><span>2</span> Track intake as you go</li>
          <li className="step"><span>3</span> Review weekly & monthly</li>
        </ol>
      </section>

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


