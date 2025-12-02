import React, { useState } from "react";
import "../style.css"; // ensures the original layout CSS is applied

export default function MacroTokLogin() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    console.log(isSignUp ? "Sign up:" : "Sign in:", {
      name,
      email,
      password,
    });
  };

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

       <div className={`container-5 ${isSignUp ? "expanded" : ""}`}>
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

          <button className="button" type="button">
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

          <form className="form" onSubmit={handleSubmit}>
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
                  onClick={() => alert("Forgot password clicked")}
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
