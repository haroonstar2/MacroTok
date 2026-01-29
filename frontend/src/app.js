import { auth } from "./startFirebase.js";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

// DOM elements 
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signinBtn = document.getElementById("signin-btn");
const googleSigninBtn = document.getElementById("google-signin-btn");
const signupLink = document.getElementById("signup-link");
const forgotPasswordLink = document.getElementById("forgot-password-link");
const authStatus = document.getElementById("auth-status");
const togglePassword = document.getElementById("toggle-password");
const eyeOpen = document.getElementById("eye-open");
const eyeClosed = document.getElementById("eye-closed");

// Notification Modal Elements
const modal = document.getElementById("notification-modal");
const modalTitle = document.getElementById("notification-title");
const modalMessage = document.getElementById("notification-message");
const modalClose = document.getElementById("notification-close");

// Helpers 
function showNotification(title, message) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.classList.remove("hidden");
}
modalClose.addEventListener("click", () => modal.classList.add("hidden"));

// Auth state 
onAuthStateChanged(auth, (user) => {
  if (user) {
    authStatus.textContent = `Welcome, ${user.email}! (You are signed in)`;
    authStatus.classList.add("text-green-600");
    authStatus.classList.remove("text-red-600");
  } else {
    authStatus.textContent = "You are not signed in.";
    authStatus.classList.add("text-red-600");
    authStatus.classList.remove("text-green-600");
  }
});

// Email/Password Sign-In 
signinBtn.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;
  if (!email || !password) {
    showNotification("Error", "Please enter both email and password.");
    return;
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
    showNotification("Success!", "You are now signed in.");
  } catch (error) {
    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      showNotification("Sign In Failed", "Invalid email or password. Please try again.");
    } else {
      showNotification("Sign In Error", error.message);
    }
  }
});

// Google Sign-In 
googleSigninBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    showNotification("Success!", `Welcome, ${result.user.displayName || "User"}!`);
  } catch (error) {
    showNotification("Google Sign In Error", error.message);
  }
});

// Sign Up 
signupLink.addEventListener("click", async () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  if (!email || !password) {
    showNotification("Sign Up Error", "Please enter an email and password in the fields first.");
    return;
  }
  if (password.length < 6) {
    showNotification("Sign Up Error", "Password must be at least 6 characters long.");
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    showNotification("Account Created!", "Your account has been successfully created. You are now signed in.");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      showNotification("Sign Up Failed", "This email address is already in use.");
    } else {
      showNotification("Sign Up Error", error.message);
    }
  }
});

// Forgot Password 
forgotPasswordLink.addEventListener("click", async () => {
  const email = emailInput.value;
  if (!email) {
    showNotification("Password Reset", "Please enter your email address first.");
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showNotification("Check Your Email", `A password reset link has been sent to ${email}.`);
  } catch (error) {
    showNotification("Password Reset Error", error.message);
  }
});

// Toggle Password Visibility 
togglePassword.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  eyeOpen.classList.toggle("hidden");
  eyeClosed.classList.toggle("hidden");
});
