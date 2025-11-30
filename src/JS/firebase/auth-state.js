// src/JS/firebase/auth-state.js
import { auth } from "./firebase.js";
import { getUserById } from "./firebase-helper.js";

// Get current user data from localStorage
export const getCurrentUser = () => {
  return {
    uid: localStorage.getItem("uId"),
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
    role: localStorage.getItem("role"),
  };
};

// Save user data to localStorage
export const saveUserData = (userData) => {
  localStorage.setItem("uId", userData.uid || "");
  localStorage.setItem("name", userData.name || "");
  localStorage.setItem("email", userData.email || "");
  localStorage.setItem("role", userData.role || "");

  console.log("💾 User data saved:", {
    uid: userData.uid,
    name: userData.name,
    email: userData.email,
    role: userData.role,
  });
};

// Clear user data from localStorage
export const clearUserData = () => {
  localStorage.removeItem("uId");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("role");

  console.log("🗑️ User data cleared");
};

// Check if user is logged in
export const isUserLoggedIn = () => {
  const uid = localStorage.getItem("uId");
  const isLoggedIn = uid !== null && uid !== "" && uid !== "null";
  console.log("🔍 Check login status:", isLoggedIn, "UID:", uid);
  return isLoggedIn;
};

// Initialize auth state listener
export const initAuthState = () => {
  console.log("🔄 Initializing auth state listener...");

  auth.onAuthStateChanged(async (user) => {
    console.log("🔔 Auth state changed:", user ? "User logged in" : "No user");

    if (user) {
      try {
        console.log("📥 Fetching user data for UID:", user.uid);
        const userData = await getUserById(user.uid);

        if (userData) {
          saveUserData({
            uid: user.uid,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          });

          console.log("✅ User authenticated successfully");
        } else {
          console.warn("⚠️ User data not found in Firestore");
        }
      } catch (error) {
        console.error("❌ Error loading user data:", error);
      }
    } else {
      // ⚠️ IMPORTANT: Only clear and redirect if we're NOT on the login page
      const currentPath = window.location.pathname;
      const isLoginPage =
        currentPath.includes("index.html") ||
        currentPath === "/" ||
        currentPath.endsWith("/");

      if (!isLoginPage) {
        console.log("🚪 User logged out - clearing data");
        clearUserData();
        console.log("↩️ Redirecting to login...");
        window.location.href = "../../../index.html";
      } else {
        console.log("ℹ️ Already on login page, no action needed");
      }
    }
  });
};

// Protect page - redirect if not logged in
export const protectPage = () => {
  console.log("🛡️ Checking page protection...");

  if (!isUserLoggedIn()) {
    console.warn("⚠️ No user logged in - redirecting to login");

    // Handle different page locations
    const currentPath = window.location.pathname;
    console.log("Current path:", currentPath);

    if (currentPath.includes("/Pages/")) {
      window.location.href = "../../../index.html";
    } else {
      window.location.href = "/index.html";
    }

    return false;
  }

  console.log("✅ User authorized to view page");
  return true;
};

// Logout function
export const logout = async () => {
  try {
    console.log("👋 Logging out...");
    await auth.signOut();
    clearUserData();
    console.log("✅ Logout successful");
    window.location.href = "../../../index.html";
  } catch (error) {
    console.error("❌ Logout error:", error);
    alert("Error logging out. Please try again.");
  }
};
