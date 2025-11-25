document.addEventListener("DOMContentLoaded", () => {
  const sidebarEl = document.querySelector("#sidebar");
  if (!sidebarEl) return;

  const role = localStorage.getItem("role"); // "student" or "instructor"

  // STUDENT SIDEBAR
  const studentSidebar = `
    <aside class="hidden lg:block col-span-0 lg:col-span-1 bg-white px-6 py-8">
      <nav class="flex flex-col gap-6">

        <div>
          <h3 class="title-link">TRACK</h3>
          <a href="../../Pages/student/attendace.html" class="attendace-btn nav-link">
            <i class="fa-solid fa-table-list"></i>
            Attendance Sheet
          </a>
        </div>

        <div>
          <h3 class="title-link">ANALYZE</h3>
          <a href="../../Pages/student/dashboard.html" class="dashboard-btn nav-link">
            <i class="fa-solid fa-chart-pie"></i>
            Dashboard
          </a>
        </div>

        <div>
          <h3 class="title-link">MANAGE</h3>
          <a href="../../Pages/student/studentProfile.html" class="studentProfile-btn nav-link">
            <i class="fa-regular fa-user"></i>
            Student
          </a>
        </div>

        <a href="../../../index.html" class="logout-link">
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

        <a href="../../Pages/student/dashboard.html" class="nav-link">
          <i class="fa-solid fa-chart-line"></i> Dashboard
        </a>

        <a href="../../Pages/instructor/instructor-courses.html" class="nav-link">
          <i class="fa-solid fa-book"></i> My Courses
        </a>

        <a href="../../Pages/instructor/mark-attendance.html" class="nav-link">
          <i class="fa-solid fa-clipboard-check"></i> Mark Attendance
        </a>

        <a href="../../Pages/instructor/course-reports.html" class="nav-link ">
          <i class="fa-solid fa-chart-pie"></i> Course Reports
        </a>

        <a href="../../../index.html" class="logout-link">
          <i class="fa-solid fa-right-from-bracket"></i>
          Logout
        </a>
      </nav>
    </aside>
  `;
  const adminSidebar = `
  <aside
  class="hidden lg:block col-span-0 lg:col-span-1 bg-white px-6 py-8"
>
  <!-- Menu -->
  <nav class="space-y-2">
    <a href="admin-dashboard.html"
      class="nav-link">
      <i class="fa-solid fa-chart-line text-primary"></i>
      Dashboard
    </a>

    <a href="users.html"
      class="nav-link">
      <i class="fa-solid fa-users text-primary"></i>
      Users
    </a>

    <a href="departments.html"
      class="nav-link">
      <i class="fa-solid fa-building text-primary"></i>
      Departments
    </a>

    <a href="courses.html"
      class="nav-link">
      <i class="fa-solid fa-book text-primary"></i>
      Courses
    </a>

    <a href="schedules.html"
      class="nav-link">
      <i class="fa-solid fa-calendar-days text-primary"></i>
      Schedules
    </a>

    <a href="attendance-reports.html"
      class="nav-link">
      <i class="fa-solid fa-file-export text-primary"></i>
      Attendance Reports
    </a>

    <a href="#" class="logout-link">
      <i class="fa-solid fa-right-from-bracket "></i>
      Logout
    </a>
  </nav>
</aside>

  `;
  // RENDER SIDEBAR
  sidebarEl.innerHTML =
    role === "instructor"
      ? instructorSidebar
      : role === "admin"
      ? adminSidebar
      : studentSidebar;

  activeCurrentPage();
});

export const activeCurrentPage = function () {
  const curPage = window.location.href;
  const pageMap = {
    attendace: ".attendace-btn",
    dashboard: ".dashboard-btn",
    notification: ".notification-btn",
    studentProfile: ".studentProfile-btn",
  };
  for (const [key, value] of Object.entries(pageMap)) {
    if (curPage.includes(key)) {
      const btn = document.querySelector(value);
      btn?.classList.add("font-bold");
      break;
    }
  }
};
