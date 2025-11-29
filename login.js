import { signIn } from "./src/JS/firebase/auth.js";
import { getUserById } from "./src/JS/firebase/firebase-helper.js";
import { saveUserData } from "./src/JS/firebase/auth-state.js";
import { auth } from "./src/JS/firebase/firebase.js";

let loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm["email"].value;
  const password = loginForm["password"].value;
  const role = loginForm["role"].value;

  console.log("🔵 Starting login process...");
  console.log("Email:", email);
  console.log("Role:", role);

  try {
    // 1. Sign in with Firebase Auth
    const user = await signIn(email, password);
    console.log("✅ Firebase Auth successful, UID:", user.uid);

    // 2. Get user data from Firestore
    const userData = await getUserById(user.uid);
    console.log("✅ User data fetched:", userData);

    if (!userData) {
      alert("User data not found in database.");
      return;
    }

    if (!role) {
      alert("Please choose your role!");
      return;
    }

    // 3. Save to localStorage
    console.log("💾 Saving to localStorage...");

    saveUserData({
      uid: user.uid,
      name: userData.name,
      email: userData.email,
      role: userData.role,
    });

    // 4. Verify data was saved
    console.log("✅ Verification - Data in localStorage:");
    console.log("  uId:", localStorage.getItem("uId"));
    console.log("  name:", localStorage.getItem("name"));
    console.log("  email:", localStorage.getItem("email"));
    console.log("  role:", localStorage.getItem("role"));

    // 5. Redirect
    console.log("🔄 Redirecting to dashboard...");
    window.location.href = "./src/Pages/student/dashboard.html";
  } catch (error) {
    console.error("❌ Login failed:", error);
    alert("Failed to login: " + error.message);
  }
});

// Handle show password
const eyeIcon = document.getElementById("eye-icon");

if (eyeIcon) {
  eyeIcon.parentElement.addEventListener("click", function () {
    const passwordInput = document.getElementById("password");

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      // Change to eye-slash icon
      eyeIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      `;
    } else {
      passwordInput.type = "password";
      // Change back to eye icon
      eyeIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      `;
    }
  });
}
