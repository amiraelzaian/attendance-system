import { activeCurrentPage } from "./header";

document.addEventListener("DOMContentLoaded", () => {
  const sidebarEl = document.querySelector("#sidebar");
  if (!sidebarEl) return;

  const role = localStorage.getItem("role"); // "student" or "instructor"

  // STUDENT SIDEBAR
  const studentSidebar = `
    <aside class="hidden lg:block col-span-0 lg:col-span-1 bg-white px-6 py-8">
      <nav class="flex flex-col gap-6">

        <div>
          <h3 class="text-xs text-gray-500 tracking-widest font-semibold mb-2">TRACK</h3>
          <a href="../../Pages/student/attendace.html" class="attendace-btn flex items-center gap-3 text-[#012970] py-2 hover:text-[#001334] transition-all duration-300">
            <i class="fa-solid fa-table-list"></i>
            Attendance Sheet
          </a>
        </div>

        <div>
          <h3 class="text-xs text-gray-500 tracking-widest font-semibold mb-2">ANALYZE</h3>
          <a href="../../Pages/student/dashboard.html" class="dashboard-btn flex items-center gap-3 text-[#012970] py-2 hover:text-[#001334] transition-all duration-300">
            <i class="fa-solid fa-chart-pie"></i>
            Dashboard
          </a>
        </div>

        <div>
          <h3 class="text-xs text-gray-500 tracking-widest font-semibold mb-2">MANAGE</h3>
          <a href="../../Pages/student/studentProfile.html" class="studentProfile-btn flex items-center gap-3 text-[#012970] py-2 hover:text-[#001334] transition-all duration-300">
            <i class="fa-regular fa-user"></i>
            Student
          </a>
        </div>

        <a href="../../../index.html" class="flex items-center gap-3 text-red-600 py-2 hover:text-red-900 transition-all duration-300">
          <i class="fa-solid fa-right-from-bracket"></i>
          Logout
        </a>
      </nav>
    </aside>
  `;

  // INSTRUCTOR SIDEBAR
  const instructorSidebar = `
    <aside class="hidden lg:block col-span-0 lg:col-span-1 bg-white px-6 py-8">
      <nav class="flex flex-col gap-6">

        <a href="../../Pages/student/dashboard.html" class="flex items-center gap-3 text-[#012970] py-2 hover:text-[#001334]">
          <i class="fa-solid fa-chart-line"></i> Dashboard
        </a>

        <a href="../../Pages/instructor/instructor-courses.html" class="flex items-center gap-3 text-[#012970] py-2 hover:text-[#001334]">
          <i class="fa-solid fa-book"></i> My Courses
        </a>

        <a href="../../Pages/instructor/mark-attendance.html" class="flex items-center gap-3 text-[#012970] py-2 hover:text-[#001334]">
          <i class="fa-solid fa-clipboard-check"></i> Mark Attendance
        </a>

        <a href="../../Pages/instructor/edit-attendance.html" class="flex items-center gap-3 text-[#012970] py-2 hover:text-[#001334]">
          <i class="fa-solid fa-pen-to-square"></i> Edit Attendance
        </a>

        <a href="../../Pages/instructor/course-reports.html" class="flex items-center gap-3 text-[#012970] py-2 hover:text-[#001334]">
          <i class="fa-solid fa-chart-pie"></i> Course Reports
        </a>

        <a href="../../../index.html" class="flex items-center gap-3 text-red-600 py-2 hover:text-red-900">
          <i class="fa-solid fa-right-from-bracket"></i>
          Logout
        </a>
      </nav>
    </aside>
  `;

  // RENDER SIDEBAR
  sidebarEl.innerHTML =
    role === "instructor" ? instructorSidebar : studentSidebar;

  activeCurrentPage();
});
