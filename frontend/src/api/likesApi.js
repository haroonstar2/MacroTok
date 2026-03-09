import { db, auth } from "../startFirebase";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
} from "firebase/firestore";

// Adds a recipe to the user's likedRecipes subcollection
export const likePost = async (recipe) => {
  const user = auth.currentUser;
  if (!user) return;
  await setDoc(doc(db, "users", user.uid, "likedRecipes", String(recipe.id)), {
    ...recipe,
    likedAt: Date.now(),
  });
};

// Removes a recipe from the subcollection
export const unlikePost = async (recipeId) => {
  const user = auth.currentUser;
  if (!user) return;
  await deleteDoc(doc(db, "users", user.uid, "likedRecipes", String(recipeId)));
};

// Gets all document IDs (recipe IDs) the user has liked
export const getLikedPostIds = async () => {
  const user = auth.currentUser;
  if (!user) return [];
  const querySnapshot = await getDocs(
    collection(db, "users", user.uid, "likedRecipes"),
  );
  return querySnapshot.docs.map((doc) => doc.id);
};
