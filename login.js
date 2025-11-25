import { signIn } from "./src/JS/firebase/auth.js";
import { getUser } from "./src/JS/firebase/firebase-helper.js";

let loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginForm["email"].value;
  const password = loginForm["password"].value;

  try {
    const user = await signIn(email, password);
    console.log("User signed in:", user);

    const userData = await getUser(user.uid);
    console.log("Fetched user data:", userData);

    if (!userData) {
      alert("لا توجد بيانات لهذا المستخدم في قاعدة البيانات.");
      return;
    }

    window.location.href = "./src/Pages/student/dashboard.html";
  } catch (error) {
    console.error("Error during sign-in:", error);
    alert("فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مرة أخرى.");
  }
});
