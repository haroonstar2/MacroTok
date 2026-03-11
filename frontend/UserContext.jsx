import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { auth, db } from "./src/startFirebase";

import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";

import {
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    let unsubscribeSnap = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // If a previous user exists, delete their listener
      if (unsubscribeSnap) unsubscribeSnap();

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);

        // Sets up a listener for the user document
        const unsubscribeSnap = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No such document!");
          }
          setLoading(false);
        });
        return () => unsubscribeSnap();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
    };
  }, []);

  const updateSettings = async (newSettings) => {
    if (!user || !userData) return;

    try {
      const docRef = doc(db, "users", user.uid);

      await updateDoc(docRef, {
        settings: { ...userData.settings, ...newSettings },
      });
    } catch (error) {
      console.error("Global update failed:", error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    // Return early is the user is not logged in
    if (!user) {
      console.log("There's no user signed in. Stopping deletion...");
      return;
    }

    console.log("Reauthenticating user...");
    try {
      // Check how the user is logged in
      const providerId = user.providerData[0].providerId;
      // If the user is a google user
      if (providerId === "google.com") {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
      } else {
        // If the user is an email user
        const password = prompt(
          "Please enter your current password to confirm account deletion:",
        );
        // If no password then stop deletion
        if (!password) return;

        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }

      // Delete user data from Firestore
      console.log("Deleting user data...");
      const docRef = doc(db, "users", user.uid);
      await deleteDoc(docRef);

      // Delete the user account
      console.log("Deleting user account...");
      await deleteUser(user);

      alert("Account permanently deleted. We're sad to see you go.");
      setShowDeleteDialog(false);

      // Go back to landing page
      navigate("/");
    } catch (error) {
      console.error("Deletion failed:", error);

      if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Deletion cancelled.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <UserContext.Provider
      value={{ user, userData, loading, updateSettings, deleteAccount }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading)
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading...
      </div>
    );

  if (!user) return <Navigate to="/login" />;

  return children;
};

export const useUser = () => useContext(UserContext);
export default UserProvider;
