import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// Firebase Auth Functions
// sign up
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};
// sign in
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.log("Error signing in:", error);
    throw error;
  }
};
// log out
export const logOut = async () => {
  try {
    signOut(auth);
  } catch (error) {
    console.log("Error signing out:", error);
    throw error;
  }
};
// get current user
export const getCurrentUser = async () => {
  return auth.currentUser;
};
