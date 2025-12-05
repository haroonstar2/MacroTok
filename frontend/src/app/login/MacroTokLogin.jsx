import React, { useState } from "react";
import "./login.css";
import { useNavigate } from "react-router";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// --- 1. FIREBASE CONFIGURATION ---
import { firebaseConfig } from "../../../../backend/firebaseConfig"

// --- 2. INITIALIZE FIREBASE ---
const app = initializeApp(firebaseConfig); // This now uses the imported config
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function MacroTokLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    console.log("yo");
    
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Google sign in successful:", user);
        alert("Success!", `Welcome, ${user.displayName}!`);
        navigate("/feed");
    } catch (error) {
        console.error("Google sign in error:", error.code, error.message);
        alert("Google Sign In Error", error.message);
    }
  }

  const handleEmailSignIn = async () => {

    if (!email || !password) {
      alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in successful:", userCredential.user);
      alert("Success!", "You are now signed in.");
      navigate("/feed");
    } catch(error) {
      console.error("Sign in error:", error.code, error.message);
      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
          alert("Sign In Failed", "Invalid email or password. Please try again.");
      } else {
          alert("Sign In Error", error.message);
      }
    }
  }

  const handleSignUp = async () => {

    if (!email || !password) {
      alert("Sign Up Error: Please enter an email and password in the fields first.");
      return;
    }

    if (password.length < 6) {
      alert("Sign Up Error: Password must be at least 6 characters long.");
      return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Sign up successful:", userCredential.user);
        alert("Account Created!", "Your account has been successfully created. You are now signed in.");
        navigate("/feed")
    } catch (error) {
        console.error("Sign up error:", error.code, error.message);
        if (error.code === "auth/email-already-in-use") {
            alert("Sign Up Failed: This email address is already in use.");
        } else {
            alert("Sign Up Error", error.message);
        }
    }

  }

  const handleForgetPassword = async () => {
    if (!email) {
      alert("Password Reset: Please enter your email address in the email field first.");
      return;
    }
    try {
        await sendPasswordResetEmail(auth, email);
        alert(`Check Your Email: A password reset link has been sent to ${email}.`);
    } catch (error) {
        console.error("Password reset error:", error);
        alert(`Password Reset Error: ${error.message}`);
    }
  }

  return (
    <div className="modern-login-page">
      {/* LEFT PANEL (Login / Signup) */}
      <div className="container">
        <div className="div">
          <div className="container-2"></div>
          <div className="container-3"></div>
          <div className="container-4"></div>
          <img
            className="img"
            alt=""
            src="https://c.animaapp.com/jsUBuoxq/img/container.png"
          />
        </div>

        <div className="container-5">
          <div className="container-6">
            <div className="paragraph">
              <p className="text-wrapper">
                {isSignUp
                  ? "Create your account to start tracking your meals."
                  : "Welcome back! Sign in to continue your journey."}
              </p>
            </div>
            <div className="container-7">
              <div className="container-8"></div>
              <h1 className="text-wrapper-2">MacroTok</h1>
            </div>
          </div>

          <button id="google-signin-btn" className="button" type="button"
            onClick={handleGoogleSignIn}
          >
            <img
              className="icon"
              src="https://c.animaapp.com/jsUBuoxq/img/icon.svg"
              alt="Google"
            />
            <div className="text-wrapper-3">
              {isSignUp ? "Sign up with Google" : "Continue with Google"}
            </div>
          </button>

          <div className="div-wrapper">
            <div className="text">
              <div className="text-wrapper-4">or continue with email</div>
            </div>
          </div>

          <form className="form" 
          onSubmit={(e) => {
            e.preventDefault();
            if (isSignUp) {
              handleSignUp();
            } else {
              handleEmailSignIn();
            }
          }}
          >
            {isSignUp && (
              <div className="container-9">
                <label className="label">Full Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="container-9">
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="container-10">
              <div className="container-11">
                <label className="text-wrapper-5">Password</label>
                <button
                  type="button"
                  className="button-2"
                  onClick={handleForgetPassword}
                >
                  <div className="text-wrapper-6">Forgot password?</div>
                </button>
              </div>

              <div className="container-12">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-2"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  className="icon-wrapper"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src="https://c.animaapp.com/jsUBuoxq/img/button.svg"
                    alt="toggle"
                    className="icon-2"
                  />
                </div>
              </div>
            </div>

            {isSignUp && (
              <div className="container-10">
                <label className="text-wrapper-5">Confirm Password</label>
                <div className="container-12">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="input-2"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div
                    className="icon-wrapper"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    <img
                      src="https://c.animaapp.com/jsUBuoxq/img/button.svg"
                      alt="toggle"
                      className="icon-2"
                    />
                  </div>
                </div>
              </div>
            )}

            <button className="button-3" type="submit">
              <div className="text-wrapper-7">
                {isSignUp ? "Create Account" : "Sign In"}
              </div>
            </button>
          </form>

          <div className="paragraph-2">
            <p className="don-t-have-an">
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account?"}
            </p>
            <button className="button-4" onClick={() => setIsSignUp(!isSignUp)}>
              <div className="text-wrapper-8">
                {isSignUp ? "Sign in" : "Sign up"}
              </div>
            </button>
          </div>

          <div className="paragraph-3">
            <p className="p">By continuing, you agree to our</p>
            <a href="#terms" className="link">
              <div className="text-wrapper-9">Terms of Service</div>
            </a>
            <div className="text-wrapper-10">and</div>
            <a href="#privacy" className="link-2">
              <div className="text-wrapper-11">Privacy Policy</div>
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (Hero Section) */}
      <div className="container-13">
        <div className="container-14">
          <div className="container-15"></div>
          <div className="container-16"></div>
        </div>

        <div className="container-17">
          <div className="container-18">
            <div className="heading-2">
              <div className="text-wrapper-12">Cook smarter.</div>
              <div className="text-wrapper-13">Track macros.</div>
              <div className="text-wrapper-14">Stay consistent.</div>
            </div>
            <div className="discover-high-wrapper">
              <p className="discover-high">
                Discover high-protein meals and log nutrition data with ease.
              </p>
            </div>
          </div>

          <div className="container-19">
            <div className="hero-image"></div>
            <div className="container-20"></div>
          </div>

          <div className="container-21">
            <div className="container-22">
              <img
                className="icon-3"
                src="https://c.animaapp.com/jsUBuoxq/img/icon-1.svg"
                alt=""
              />
              <div className="paragraph-4">
                <div className="text-wrapper-15">Easy</div>
                <div className="text-wrapper-16">Tracking</div>
              </div>
            </div>
            <div className="container-23">
              <img
                className="icon-3"
                src="https://c.animaapp.com/jsUBuoxq/img/icon-2.svg"
                alt=""
              />
              <div className="paragraph-4">
                <div className="secure">Secure</div>
                <div className="text-wrapper-17">Data</div>
              </div>
            </div>
            <div className="container-24">
              <img
                className="icon-3"
                src="https://c.animaapp.com/jsUBuoxq/img/icon-3.svg"
                alt=""
              />
              <div className="paragraph-4">
                <div className="text-wrapper-18">Meal</div>
                <div className="text-wrapper-19">Analytics</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
