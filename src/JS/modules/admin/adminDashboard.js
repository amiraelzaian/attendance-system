import { getAllUsers } from "../../firebase/firebase-helper.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1️⃣ Get user role from localStorage
    const role = localStorage.getItem("role");
    if (!role || (role !== "admin" && role !== "instructor")) {
      console.warn("You are not authorized to view this page.");
      return;
    }

    // 2️⃣ Get dashboard container
    const content = document.querySelector("#dashboardContent");
    if (!content) return;

    // 3️⃣ Fetch all users
    const data = await getAllUsers();
    if (!data || !data.users || data.users.length === 0) {
      content.innerHTML = `<p class="text-center text-gray-500">No users found.</p>`;
      return;
    }

    const users = data.users;

    // 4️⃣ Compute stats
    const totalStudents = users.filter((u) => u.role === "student").length;
    const totalInstructors = users.filter(
      (u) => u.role === "instructor"
    ).length;
    const totalDepartments = 12; // Adjust based on actual data
    const totalCourses = 87; // Adjust based on actual data

    // 5️⃣ Render dashboard
    content.innerHTML = `
      <main class="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Stats Cards -->
        <div class="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <i class="fa-solid fa-users text-[#012970] text-3xl"></i>
          <div>
            <p class="text-sm text-gray-500">Total Students</p>
            <p class="text-xl font-bold">${totalStudents}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <i class="fa-solid fa-chalkboard-user text-green-600 text-3xl"></i>
          <div>
            <p class="text-sm text-gray-500">Instructors</p>
            <p class="text-xl font-bold">${totalInstructors}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <i class="fa-solid fa-building text-purple-600 text-3xl"></i>
          <div>
            <p class="text-sm text-gray-500">Departments</p>
            <p class="text-xl font-bold">${totalDepartments}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow flex items-center gap-4">
          <i class="fa-solid fa-book text-orange-600 text-3xl"></i>
          <div>
            <p class="text-sm text-gray-500">Courses</p>
            <p class="text-xl font-bold">${totalCourses}</p>
          </div>
        </div>

        <!-- Users Table -->
        <section class="bg-white rounded-xl shadow p-6 lg:col-span-4 mt-6">
          <h2 class="text-xl font-semibold mb-4">All Users</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full text-left table-auto">
              <thead class="bg-blue-50 text-primary">
                <tr>
                  <th class="px-4 py-3">Name</th>
                  <th class="px-4 py-3">Email</th>
                  <th class="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody>
                ${users
                  .map(
                    (u) => `
                  <tr class="border-b border-gray-200">
                    <td class="px-4 py-3">${u.Name || "N/A"}</td>
                    <td class="px-4 py-3">${u.email || "N/A"}</td>
                    <td class="px-4 py-3">${u.role || "N/A"}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    `;
  } catch (error) {
    console.error("Error loading admin dashboard:", error);
    const content = document.querySelector("#dashboardContent");
    if (content)
      content.innerHTML = `<p class="text-center text-red-500">Failed to load dashboard.</p>`;
  }
});
