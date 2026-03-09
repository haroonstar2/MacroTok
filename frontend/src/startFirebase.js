import { GoogleAuthProvider } from 'firebase/auth';
// Import the already initialized services from your config file
import { auth, db, app, storage } from "./FirebaseConfig.js";

// Initialize and export the provider (which doesn't exist in the config file yet)
export const provider = new GoogleAuthProvider();

// Re-export the others so your app doesn't break if it expects them from here
export { auth, db, app, storage };