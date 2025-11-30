import { getAuth } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import Chart from "chart.js/auto";
import { getUserById, getCourse } from "../../firebase/firebase-helper";
import {
  getCurrentUser,
  initAuthState,
  isUserLoggedIn,
} from "../../firebase/auth-state.js";

console.log("📍 Dashboard.js loaded");

// ✅ Check authentication
const checkAuth = () => {
  const user = getCurrentUser();
  console.log("🔍 Checking auth - User data:", user);

  if (!user.uid || user.uid === "null" || user.uid === "") {
    console.warn("⚠️ No user logged in, redirecting...");
    window.location.href = "../../../index.html";
    return false;
  }

  console.log("✅ User authenticated:", user.name);
  return true;
};

// Check auth on page load
if (!checkAuth()) {
  throw new Error("Not authenticated");
}

// Initialize auth state listener
initAuthState();

// Check if is a student and render dashboard
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = getCurrentUser();
  const role = currentUser.role;

  console.log("👤 Current user:", currentUser);
  console.log("🎭 Current role:", role);

  if (role !== "student") {
    console.log("ℹ️ Not a student role");
    return;
  }

  const dashboardContent = document.querySelector("#dashboardContent");
  if (dashboardContent) {
    dashboardContent.innerHTML = `
      <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white p-5 rounded-xl shadow border border-gray-100">
          <small class="text-gray-500">Present | Today</small>
          <div class="text-2xl font-bold mt-2" id="presentToday">145</div>
          <div class="text-green-600 text-sm mt-1">▲ 12% increase</div>
        </div>
        <div class="bg-white p-5 rounded-xl shadow border border-gray-100">
          <small class="text-gray-500">Absent | Today</small>
          <div class="text-2xl font-bold mt-2" id="absentToday">12</div>
          <div class="text-red-600 text-sm mt-1">▼ 3% decrease</div>
        </div>
        <div class="bg-white p-5 rounded-xl shadow border border-gray-100">
          <small class="text-gray-500">Attendance | This Month</small>
          <div class="text-2xl font-bold mt-2" id="monthPercent">92%</div>
          <div class="text-green-600 text-sm mt-1">▲ 5% better</div>
        </div>
      </section>
      <!-- Main Chart -->
      <div class="mt-10 bg-white p-8 rounded-xl shadow-md">
        <h3 class="text-md lg:text-lg text-[#012970] font-bold mb-4">
          Reports | Today
        </h3>
        <canvas id="lineChart" class="w-full h-64"></canvas>
      </div>
    `;

    setTimeout(implementChart, 100);
  }
});

const implementChart = function () {
  const lineCtx = document.getElementById("lineChart");
  if (!lineCtx) {
    console.error("❌ Canvas element not found");
    return;
  }

  new Chart(lineCtx, {
    type: "line",
    data: {
      labels: ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00"],
      datasets: [
        {
          label: "Present",
          data: [20, 30, 35, 40, 50, 80],
          borderWidth: 1,
          fill: true,
          tension: 0.4,
        },
        {
          label: "Absent",
          data: [5, 7, 10, 8, 12, 6],
          borderWidth: 1,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top" } },
    },
  });
};

// Load user profile data
document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = getCurrentUser();

  console.log("📥 Loading profile data for:", currentUser.uid);

  if (currentUser.uid) {
    try {
      const user = await getUserById(currentUser.uid);
      console.log("✅ User data received:", user);

      if (user) {
        // Fill username in header/sidebar
        const usernameElements = document.querySelectorAll(".username");
        console.log(`📝 Found ${usernameElements.length} username elements`);
        usernameElements.forEach((el) => {
          el.textContent = user.name || currentUser.name || "User";
        });

        // Fill profile info
        const profileName = document.getElementById("profile-name");
        const profileEmail = document.getElementById("profile-email");
        const profileDepartment = document.getElementById("profile-department");
        const profileRole = document.getElementById("profile-role");
        const profileCourses = document.getElementById("profile-courses");

        if (profileName) profileName.textContent = user.name || "N/A";
        if (profileEmail)
          profileEmail.textContent = user.email || currentUser.email || "N/A";
        if (profileDepartment)
          profileDepartment.textContent = user.department || "N/A";
        if (profileRole)
          profileRole.textContent = user.role || currentUser.role || "N/A";

        // Handle courses
        let coursesNames = [];
        let enrolledmentsFragment = document.createDocumentFragment();

        if (user.CourseId && Array.isArray(user.CourseId)) {
          console.log(`📚 Processing ${user.CourseId.length} courses`);

          for (let courseRef of user.CourseId) {
            try {
              if (courseRef && courseRef.path) {
                const courseId = courseRef.path.split("/").pop();
                const courseData = await getCourse(courseId);

                if (courseData && courseData.Name) {
                  coursesNames.push(courseData.Name);
                  console.log(`  ✓ Loaded course: ${courseData.Name}`);

                  let div = document.createElement("div");
                  div.className =
                    "bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition";
                  div.innerHTML = `
                    <p class="font-bold">${courseData.Name}</p>
                    <p class="text-gray-500 text-sm">Course ID: ${
                      courseData.CId || "N/A"
                    }</p>
                  `;
                  enrolledmentsFragment.appendChild(div);
                }
              }
            } catch (error) {
              console.error("❌ Error processing course:", error);
            }
          }

          if (profileCourses) {
            profileCourses.textContent =
              coursesNames.length > 0 ? coursesNames.join(", ") : "N/A";
          }

          const enrolledCoursesContainer =
            document.querySelector(".enrolled-courses");
          if (enrolledCoursesContainer) {
            enrolledCoursesContainer.appendChild(enrolledmentsFragment);
          }

          console.log(`✅ Loaded ${coursesNames.length} courses successfully`);
        } else {
          console.warn("⚠️ No courses found for user");
          if (profileCourses) profileCourses.textContent = "N/A";
        }

        console.log("✅ Profile data loaded successfully");
      }
    } catch (error) {
      console.error("❌ Error loading user data:", error);
      alert("Failed to load profile data. Please try logging in again.");
    }
  } else {
    console.error("❌ No user ID in localStorage");
    window.location.href = "../../../index.html";
  }
});
