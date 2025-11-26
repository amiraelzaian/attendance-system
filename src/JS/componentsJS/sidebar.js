document.addEventListener("DOMContentLoaded", () => {
  const sidebarEl = document.querySelector("#sidebar");
  if (!sidebarEl) return;

  const design = detectSidebar();

  const c = `
      <aside class="hidden lg:block col-span-0 lg:col-span-1 bg-white px-6 py-8">
      ${design}
      </aside>
      `;
  sidebarEl.innerHTML = c;

  activeCurrentPage();
});

export const detectSidebar = function () {
  const role = localStorage.getItem("role"); // "student" or "instructor"

  // STUDENT SIDEBAR
  const studentSidebar = `
    
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
    
  `;

  // INSTRUCTOR SIDEBAR
  const instructorSidebar = `
         <nav class="flex flex-col gap-6">

        <a href="../../Pages/student/dashboard.html" class="dashboard-btn nav-link">
          <i class="fa-solid fa-chart-line"></i> Dashboard
        </a>

        <a href="../../Pages/instructor/instructorCourses.html" class="instructor-btn nav-link">
          <i class="fa-solid fa-book"></i> My Courses
        </a>

        <a href="../../Pages/instructor/markAttendance.html" class="mark-btn nav-link">
          <i class="fa-solid fa-clipboard-check"></i> Mark Attendance
        </a>

        <a href="../../Pages/instructor/courseReports.html" class="course-btn nav-link ">
          <i class="fa-solid fa-chart-pie"></i> Course Reports
        </a>

        <a href="../../../index.html" class="logout-link">
          <i class="fa-solid fa-right-from-bracket"></i>
          Logout
        </a>
      </nav>
    
  `;
  const adminSidebar = `
     
      <!-- Menu -->
      <nav class="space-y-2">
        <a href="../../Pages/student/dashboard.html"
          class="dashboard-btn nav-link">
          <i class="fa-solid fa-chart-line text-primary"></i>
          Dashboard
        </a>

        <a href="../../Pages/admin/users.html"
          class="nav-link">
          <i class="fa-solid fa-users text-primary"></i>
          Users
        </a>

        <a href="../../Pages/admin/departments.html"
          class="nav-link">
          <i class="fa-solid fa-building text-primary"></i>
          Departments
        </a>

        <a href="../../Pages/admin/courses.html"
          class="nav-link">
          <i class="fa-solid fa-book text-primary"></i>
          Courses
        </a>

        <a href="../../Pages/admin/schedules.html"
          class="nav-link">
          <i class="fa-solid fa-calendar-days text-primary"></i>
          Schedules
        </a>

        <a href="../../Pages/admin/attendanceReports.html"
          class="nav-link">
          <i class="fa-solid fa-file-export text-primary"></i>
          Attendance Reports
        </a>

        <a href="../../../index.html" class="logout-link">
          <i class="fa-solid fa-right-from-bracket "></i>
          Logout
        </a>
      </nav>
   

  `;
  // RENDER SIDEBAR
  const finalDesign =
    role === "instructor"
      ? instructorSidebar
      : role === "admin"
      ? adminSidebar
      : studentSidebar;

  return finalDesign;
};

export const activeCurrentPage = function () {
  const curPage = window.location.href;
  const pageMap = {
    attendace: ".attendace-btn",
    dashboard: ".dashboard-btn",
    notification: ".notification-btn",
    studentProfile: ".studentProfile-btn",
    courseReports: ".course-btn",
    instructorCourses: ".instructor-btn",
    markAttendance: ".mark-btn",
    users: "",
    departments: "",
    courses: "",
    schedules: "",
    attendanceReports: "",
  };
  for (const [key, value] of Object.entries(pageMap)) {
    if (curPage.includes(key)) {
      const btn = document.querySelector(value);
      btn?.classList.add("active");
      break;
    }
  }
};
