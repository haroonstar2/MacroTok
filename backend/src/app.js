// Import all the Firebase functions we need
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
// To use Firestore, you would add:
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// --- 1. FIREBASE CONFIGURATION ---
// We now import the config from our private file
import { firebaseConfig } from "../firebaseConfig.js"

// --- 2. INITIALIZE FIREBASE ---
const app = initializeApp(firebaseConfig); // This now uses the imported config
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
// const db = getFirestore(app); // Uncomment if you use Firestore

// --- 3. GET HTML ELEMENTS ---
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

// --- 4. HELPER FUNCTION (replaces alert()) ---
function showNotification(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.remove("hidden");
}
modalClose.addEventListener("click", () => modal.classList.add("hidden"));


// --- 5. AUTHENTICATION LOGIC ---

// A. Listen for auth state changes (the "master" function)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("User is signed in:", user);
        authStatus.textContent = `Welcome, ${user.email}! (You are signed in)`;
        authStatus.classList.add("text-green-600");
        authStatus.classList.remove("text-red-600");
        // In a real app, you'd redirect here:
        // window.location.href = "dashboard.html";
    } else {
        // User is signed out
        console.log("User is signed out");
        authStatus.textContent = "You are not signed in.";
        authStatus.classList.add("text-red-600");
        authStatus.classList.remove("text-green-600");
    }
});

// B. Email/Password Sign-In
signinBtn.addEventListener("click", async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        showNotification("Error", "Please enter both email and password.");
        return;
    }
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Sign in successful:", userCredential.user);
        showNotification("Success!", "You are now signed in.");
    } catch (error) {
        console.error("Sign in error:", error.code, error.message);
        if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
            showNotification("Sign In Failed", "Invalid email or password. Please try again.");
        } else {
            showNotification("Sign In Error", error.message);
        }
    }
});

// C. Google Sign-In
googleSigninBtn.addEventListener("click", async () => {
    console.log("google butotn clicked");
    
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Google sign in successful:", user);
        showNotification("Success!", `Welcome, ${user.displayName}!`);
    } catch (error) { // <--- FIXED! Added {
        console.error("Google sign in error:", error.code, error.message);
        showNotification("Google Sign In Error", error.message);
    } // <--- FIXED! Added }
});

// D. Sign Up (using the "Sign up" link)
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Sign up successful:", userCredential.user);
        showNotification("Account Created!", "Your account has been successfully created. You are now signed in.");
    } catch (error) {
        console.error("Sign up error:", error.code, error.message);
        if (error.code === "auth/email-already-in-use") {
            showNotification("Sign Up Failed", "This email address is already in use.");
        } else {
            showNotification("Sign Up Error", error.message);
        }
    }
});

// E. Forgot Password
forgotPasswordLink.addEventListener("click", async () => {
    const email = emailInput.value;
    if (!email) {
        showNotification("Password Reset", "Please enter your email address in the email field first.");
        return;
    }
    
    try {
        await sendPasswordResetEmail(auth, email);
        showNotification("Check Your Email", `A password reset link has been sent to ${email}.`);
    } catch (error) {
        console.error("Password reset error:", error);
        showNotification("Password Reset Error", error.message);
    }
});

// F. Toggle Password Visibility
togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    eyeOpen.classList.toggle("hidden");
    eyeClosed.classList.toggle("hidden");
});