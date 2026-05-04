import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { auth, db, provider } from "./startFirebase";
import {
  onAuthStateChanged,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  GoogleAuthProvider,
  getAdditionalUserInfo,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import {
  sendAccountCreatedEmail,
  sendAccountDeletedEmail,
  sendAccountDeactivatedEmail,
  sendAccountReactivatedEmail,
  sendPasswordResetNotificationEmail,
} from "./api/emailService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeSnap = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (unsubscribeSnap) unsubscribeSnap();

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        unsubscribeSnap = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
          setLoading(false);
        });
      } else {
        setUserData(null);
        setLoading(false);
        // navigate("/login");
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
      // Merges existing settings with the new updates
      await updateDoc(docRef, {
        settings: { ...userData.settings, ...newSettings },
      });
    } catch (error) {
      console.error("Global update failed:", error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user) return;

    try {
      const providerId = user.providerData[0].providerId;
      if (providerId === "google.com") {
        await reauthenticateWithPopup(user, new GoogleAuthProvider());
      } else {
        const password = prompt("Enter password to confirm deletion:");
        if (!password) return;
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }

      await sendAccountDeletedEmail(user);

      const docRef = doc(db, "users", user.uid);
      await deleteDoc(docRef);
      await deleteUser(user);

      alert("Account deleted.");
      // navigate("/");
    } catch (error) {
      console.error("Deletion failed:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const deactivateAccount = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, { isDeactivated: true });
      await sendAccountDeactivatedEmail(user);
    } catch (error) {
      console.error("Deactivation failed:", error);
      throw error;
    }
  };

  const reactivateAccount = async (currentUser = user) => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, "users", currentUser.uid);
      await updateDoc(docRef, { isDeactivated: false });
      await sendAccountReactivatedEmail(currentUser);
    } catch (error) {
      console.error("Reactivation failed:", error);
      throw error;
    }
  };

  const resetPassword = async (emailToReset) => {
    try {
      await sendPasswordResetEmail(auth, emailToReset);

      await sendPasswordResetNotificationEmail({
        email: emailToReset,
        displayName: null,
      });
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const details = await getAdditionalUserInfo(result);
      const isNewUser = details?.isNewUser;

      if (isNewUser) {
        // Create a document in the users collection with the user uid as the ID.
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date(),
          lastLogin: new Date(),
          isDeactivated: false,
          // Default values for new users
          settings: {
            bio: "",
            communityUpdates: true,
            darkMode: false,
            desiredWeight: 165,
            emailNotifications: true,
            // firstName: "",
            fitnessGoal: "Lose Weight",
            // isDarkMode: false,
            isPublic: true,
            // lastName: "",
            measurements: "imperial",
            photoURL: "",
            pushNotifications: true,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            username: "",
          },
        });
        await sendAccountCreatedEmail(user);
      }
      return user;
    } catch (error) {
      throw error;
    }
  };

  const emailSignIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const emailSignUp = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: displayName || "",
        createdAt: new Date(),
        lastLogin: new Date(),
        isDeactivated: false,
        // Default values for new users
        settings: {
          bio: "",
          communityUpdates: true,
          darkMode: false,
          desiredWeight: 165,
          emailNotifications: true,
          // firstName: "",
          fitnessGoal: "Lose Weight",
          // isDarkMode: false,
          isPublic: true,
          // lastName: "",
          measurements: "imperial",
          photoURL: "",
          pushNotifications: true,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          username: "",
        },
      });

      await sendAccountCreatedEmail(user);

      return user;
    } catch (error) {
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        userData,
        loading,
        updateSettings,
        deleteAccount,
        deactivateAccount,
        reactivateAccount,
        resetPassword,
        googleSignIn,
        emailSignIn,
        emailSignUp,
      }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
export default UserProvider;
