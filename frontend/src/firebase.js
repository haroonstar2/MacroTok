// frontend/src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIejmQUd8dK_MjPp20aWyCT6RtY-xsXPc",
  authDomain: "macrotok-303a4.firebaseapp.com",
  projectId: "macrotok-303a4",
  storageBucket: "macrotok-303a4.firebasestorage.app",
  messagingSenderId: "20470071927",
  appId: "1:20470071927:web:ab1a3b7a84a1da0184bc72"
};

// Initializes Firebase
const app = initializeApp(firebaseConfig);

// Initializes Firestore and export it
export const db = getFirestore(app);
