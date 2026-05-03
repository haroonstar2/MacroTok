<<<<<<< HEAD
import { Navigation } from "./components/Navigation";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { BenefitsSection } from "./components/BenefitsSection";
import { CommunityFeedSection } from "./components/CommunityFeedSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";
=======
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
import { auth } from "../../firebaseConfig";
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
>>>>>>> ca5b7f2 (Andres' Updates NOT DONE)

export default function Landing() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
      {/* Decorative gradient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-gradient-radial from-blue-400/30 via-blue-500/20 to-transparent rounded-full blur-3xl filter" />
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-gradient-radial from-indigo-400/25 via-indigo-500/15 to-transparent rounded-full blur-3xl filter" />
        <div className="absolute -bottom-32 right-1/4 w-[550px] h-[550px] bg-gradient-radial from-blue-500/20 via-blue-600/10 to-transparent rounded-full blur-3xl filter" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <BenefitsSection />
        <CommunityFeedSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}
