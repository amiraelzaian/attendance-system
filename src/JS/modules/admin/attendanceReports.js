// JS/modules/admin/attendanceReports.js

import { getAllCourses, getAllUsers } from "../../firebase/firebase-helper.js";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase.js";

// Utility function to format date
const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";

  if (timestamp.toDate) {
    return timestamp.toDate().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  return "N/A";
};

// Resolve course name
const resolveCourseName = async (courseRef, coursesCache) => {
  if (!courseRef) return "Unknown Course";

  if (typeof courseRef === "string") {
    const course = coursesCache.find((c) => c.id === courseRef);
    return course ? course.Name : "Unknown Course";
  }

  if (courseRef.id) {
    const course = coursesCache.find((c) => c.id === courseRef.id);
    return course ? course.Name : "Unknown Course";
  }

  return "Unknown Course";
};

// Resolve student name
const resolveStudentName = async (studentRef, usersCache) => {
  if (!studentRef) return "Unknown Student";

  if (typeof studentRef === "string") {
    const user = usersCache.find((u) => u.id === studentRef);
    return user ? user.name : "Unknown Student";
  }

  if (studentRef.id) {
    const user = usersCache.find((u) => u.id === studentRef.id);
    return user ? user.name : "Unknown Student";
  }

  return "Unknown Student";
};

// FIXED → Correct Firestore Import
const getAllAttendance = async () => {
  try {
    const snapshot = await getDocs(collection(db, "attendance"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all attendance:", error);
    return [];
  }
};

// Load attendance reports
const loadAttendanceReports = async () => {
  const tbody = document.querySelector("tbody");
  const exportBtn = document.querySelector(".bg-green-600");

  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="4" class="px-4 py-8 text-center text-gray-500">
        <i class="fa-solid fa-spinner fa-spin mr-2"></i>
        Loading attendance reports...
      </td>
    </tr>
  `;

  try {
    const [coursesResult, usersResult, attendanceRecords] = await Promise.all([
      getAllCourses(),
      getAllUsers(1000),
      getAllAttendance(),
    ]);

    const courses = coursesResult || [];
    const users = usersResult.users || [];

    if (attendanceRecords.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="px-4 py-8 text-center text-gray-500">
            <i class="fa-solid fa-inbox mr-2"></i>
            No attendance records found
          </td>
        </tr>
      `;
      return;
    }

    const rows = await Promise.all(
      attendanceRecords.map(async (record) => {
        const studentName = await resolveStudentName(record.student, users);
        const courseName = await resolveCourseName(record.course, courses);
        const date = formatDate(record.date);
        const status = record.status || "Unknown";

        const statusClass =
          status.toLowerCase() === "present"
            ? "text-green-600"
            : status.toLowerCase() === "absent"
            ? "text-red-600"
            : "text-yellow-600";

        return {
          html: `
            <tr class="border-b border-gray-200 hover:bg-gray-50">
              <td class="px-4 py-3 text-center">${studentName}</td>
              <td class="px-4 py-3 text-center">${courseName}</td>
              <td class="px-4 py-3 text-center">${date}</td>
              <td class="px-4 py-3 text-center ${statusClass} font-semibold capitalize">
                ${status}
              </td>
            </tr>
          `,
          data: {
            studentName,
            courseName,
            date,
            status,
          },
        };
      })
    );

    rows.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));

    tbody.innerHTML = rows.map((r) => r.html).join("");

    if (exportBtn) {
      exportBtn.onclick = () => exportToExcel(rows.map((r) => r.data));
    }
  } catch (error) {
    console.error("Error loading attendance reports:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-8 text-center text-red-500">
          <i class="fa-solid fa-exclamation-triangle mr-2"></i>
          Error loading attendance reports. Please try again.
        </td>
      </tr>
    `;
  }
};

// Export to CSV
const exportToExcel = (data) => {
  if (data.length === 0) return alert("No data to export");

  const headers = ["Student", "Course", "Date", "Status"];
  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [
        `"${row.studentName}"`,
        `"${row.courseName}"`,
        row.date,
        row.status,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `attendance_report_${
    new Date().toISOString().split("T")[0]
  }.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();
};

// Filters UI
const setupFilters = () => {
  const container = document.querySelector("main.p-0");
  if (!container) return;

  const filterHTML = `
    <div class="bg-white rounded-xl shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
          <select id="courseFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Courses</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select id="statusFilter" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="">All Status</option>
            <option value="present">Present</option>
            <option value="absent">Absent</option>
            <option value="late">Late</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Search Student</label>
          <input type="text" id="studentSearch" placeholder="Search by name..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  `;

  const exportBtn = container.querySelector(".bg-green-600");
  if (exportBtn) {
    exportBtn.insertAdjacentHTML("afterend", filterHTML);

    document
      .getElementById("courseFilter")
      ?.addEventListener("change", applyFilters);
    document
      .getElementById("statusFilter")
      ?.addEventListener("change", applyFilters);
    document
      .getElementById("studentSearch")
      ?.addEventListener("input", applyFilters);
  }
};

// Apply filters
const applyFilters = () => {
  const courseFilter = document
    .getElementById("courseFilter")
    ?.value.toLowerCase();
  const statusFilter = document
    .getElementById("statusFilter")
    ?.value.toLowerCase();
  const studentSearch = document
    .getElementById("studentSearch")
    ?.value.toLowerCase();

  const rows = document.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const student = row.cells[0]?.textContent.toLowerCase();
    const course = row.cells[1]?.textContent.toLowerCase();
    const status = row.cells[3]?.textContent.toLowerCase();

    const matchCourse = !courseFilter || course.includes(courseFilter);
    const matchStatus = !statusFilter || status.includes(statusFilter);
    const matchStudent = !studentSearch || student.includes(studentSearch);

    row.style.display =
      matchCourse && matchStatus && matchStudent ? "" : "none";
  });
};

// Load course filter
const loadCourseFilter = async () => {
  try {
    const courses = await getAllCourses();
    const select = document.getElementById("courseFilter");

    if (select && courses.length > 0) {
      courses.forEach((course) => {
        const option = document.createElement("option");
        option.value = course.Name.toLowerCase();
        option.textContent = course.Name;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.error("Error loading course filter:", error);
  }
};

// Init
document.addEventListener("DOMContentLoaded", async () => {
  await loadAttendanceReports();
  setupFilters();
  await loadCourseFilter();
});
