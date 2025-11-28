import { getAuth } from "firebase/auth";
import { getDoc } from "firebase/firestore";
import Chart from "chart.js/auto";
import { getUser, getCourse } from "../../firebase/firebase-helper";

// Check if is a student and render dashboard
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  console.log("Current role:", role);

  if (role !== "student") {
    console.log("Not a student, showing instructor dashboard");
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

    // Wait a bit for DOM to be ready, then implement chart
    setTimeout(implementChart, 100);
  }
});

const implementChart = function () {
  const lineCtx = document.getElementById("lineChart");
  if (!lineCtx) {
    console.error("Canvas element not found");
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

// Load user profile data - SEPARATE DOMContentLoaded
let authListenerAttached = false;

document.addEventListener("DOMContentLoaded", async () => {
  // Prevent multiple listeners
  if (authListenerAttached) return;
  authListenerAttached = true;

  const auth = getAuth();

  // Wait for auth state to be ready
  auth.onAuthStateChanged(async (currentUser) => {
    console.log("=== AUTH STATE CHANGED ===");
    console.log("Current user:", currentUser);

    if (!currentUser) {
      console.error("No authenticated user found!");
      // Don't redirect immediately, give it a moment
      setTimeout(() => {
        if (!getAuth().currentUser) {
          window.location.href = "/login.html";
        }
      }, 1000);
      return;
    }

    const userId = currentUser.uid;
    console.log("Authenticated user ID:", userId);
    console.log("User email:", currentUser.email);

    let coursesNames = [];

    try {
      console.log("Fetching user data...");
      const user = await getUser(userId);
      console.log("User data received:", user);

      if (user) {
        // Fill basic user info
        const usernameElements = document.querySelectorAll(".username");
        console.log("Found username elements:", usernameElements.length);
        usernameElements.forEach((el) => {
          el.textContent = user.name || "User";
        });

        const profileName = document.getElementById("profile-name");
        const profileEmail = document.getElementById("profile-email");
        const profileDepartment = document.getElementById("profile-department");
        const profileRole = document.getElementById("profile-role");
        const profileCourses = document.getElementById("profile-courses");
        let enrolledmentsFragment = document.createDocumentFragment();
        if (profileName) profileName.textContent = user.name || "John Doe";
        if (profileEmail)
          profileEmail.textContent = user.email || currentUser.email || "N/A";
        if (profileDepartment)
          profileDepartment.textContent = user.department || "N/A";
        if (profileRole) profileRole.textContent = user.role || "N/A";

        // ✅ Handle DocumentReference objects from CourseId
        if (user.CourseId && Array.isArray(user.CourseId)) {
          console.log("Processing", user.CourseId.length, "course references");

          for (let i = 0; i < user.CourseId.length; i++) {
            const courseRef = user.CourseId[i];
            console.log(`\nProcessing course ${i + 1}:`, courseRef);

            try {
              // Method 1: Extract ID from DocumentReference path
              if (courseRef && courseRef.path) {
                console.log("  Course path:", courseRef.path);

                // Extract the course ID from the path (e.g., "courses/ComputerArchitecture")
                const courseId = courseRef.path.split("/").pop();
                console.log("  Extracted ID:", courseId);

                const courseData = await getCourse(courseId);
                console.log("  Course data:", courseData);

                if (courseData && courseData.Name) {
                  coursesNames.push(courseData.Name);
                  console.log("  ✓ Added course:", courseData.Name);
                } else {
                  console.warn(
                    "  ✗ Course not found or missing Name:",
                    courseId
                  );
                }
              }
              // Method 2: Fallback - fetch directly using the reference
              else if (courseRef) {
                console.log("  Using fallback method - fetching directly");
                const courseSnap = await getDoc(courseRef);

                if (courseSnap.exists()) {
                  const courseData = courseSnap.data();
                  console.log("  Course data:", courseData);

                  if (courseData.Name) {
                    coursesNames.push(courseData.Name);
                    console.log("  ✓ Added course:", courseData.Name);
                  }
                } else {
                  console.warn("  ✗ Course document doesn't exist");
                }
              } else {
                console.warn("  ✗ Invalid course reference");
              }
            } catch (error) {
              console.error("  ✗ Error processing course:", error);
            }
          }

          console.log("\n=== FINAL COURSES ===");
          console.log("Loaded courses:", coursesNames);

          if (profileCourses) {
            profileCourses.textContent =
              coursesNames.length > 0 ? coursesNames.join(", ") : "N/A";
          }
          coursesNames.forEach((courseName) => {
            let div = document.createElement("div");
            div.className =
              "bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition";

            div.innerHTML = `
                      <p class="font-bold">${courseName}</p>
                      <p class="text-gray-500 text-sm">Instructor: Bob Johnson</p>
                    `;

            enrolledmentsFragment.appendChild(div);
          });

          document
            .querySelector(".enrolled-courses")
            .appendChild(enrolledmentsFragment);
        } else {
          console.warn("CourseId field is missing or not an array");
          if (profileCourses) {
            profileCourses.textContent = "N/A";
          }
        }

        console.log("✓ Profile data loaded successfully");
      } else {
        console.warn("User document not found in Firestore");
        throw new Error("User document not found");
      }
    } catch (error) {
      console.error("=== ERROR LOADING USER DATA ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);

      // Show user-friendly error
      alert(
        "Failed to load user data: " +
          error.message +
          "\n\nPlease try logging in again."
      );
    }
  });
});
