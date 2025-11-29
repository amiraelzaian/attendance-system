// instructorCourses.js
import { getUserById, getAllCourses } from "../../firebase/firebase-helper.js";
import { auth } from "../../firebase/firebase.js";
import { protectPage, initAuthState } from "../firebase/auth-state.js";

// حماية الصفحة
protectPage();

// تهيئة حالة المصادقة
initAuthState();
// Render courses to the DOM
const renderCourses = (courses) => {
  const coursesContainer = document.querySelector("section .grid");
  coursesContainer.innerHTML = ""; // Clear existing courses

  if (!courses.length) {
    coursesContainer.innerHTML = `<p class="text-gray-500 col-span-full">No courses assigned yet.</p>`;
    return;
  }

  courses.forEach((course) => {
    const courseDiv = document.createElement("div");
    courseDiv.className = "bg-white p-5 shadow rounded-xl";
    courseDiv.innerHTML = `
      <h3 class="font-semibold text-lg text-primary">${course.Name}</h3>
      <p class="text-gray-500">${course.studentsCount || 0} Students</p>
    `;
    coursesContainer.appendChild(courseDiv);
  });
};

// Fetch instructor courses
const loadInstructorCourses = async (userId) => {
  try {
    const user = await getUserById(userId);

    if (!user || !user.courses?.length) {
      renderCourses([]);
      return;
    }

    // Fetch all courses once
    const allCourses = await getAllCourses();

    // Filter only the courses assigned to the instructor
    const instructorCourses = allCourses.filter((course) =>
      user.courses.includes(course.id)
    );

    renderCourses(instructorCourses);
  } catch (error) {
    console.error("Error loading instructor courses:", error);
  }
};

// ✅ Put the auth state listener here
auth.onAuthStateChanged(async (user) => {
  if (user) {
    const role = localStorage.getItem("role");
    if (role === "instructor") {
      loadInstructorCourses(user.uid);
    } else {
      console.log("Logged in user is not an instructor");
      renderCourses([]); // optional: show empty if not instructor
    }
  } else {
    console.log("No logged-in user found.");
    renderCourses([]);
  }
});
