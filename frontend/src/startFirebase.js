// frontend/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

import firebaseConfig from "./firebaseConfig"

// Initialize Firebase once
export const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);
