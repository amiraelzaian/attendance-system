document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  if (role !== "instructor") return;

  const content = document.querySelector("#dashboardContent");

  content.innerHTML = `
    <h1 class="text-2xl text-[#012970] font-semibold mb-4">Instructor Dashboard</h1>
    
    <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-5 rounded-xl shadow border border-gray-100">
        <small class="text-gray-500">Courses</small>
        <div class="text-2xl font-bold mt-2">5</div>
      </div>

      <div class="bg-white p-5 rounded-xl shadow border border-gray-100">
        <small class="text-gray-500">Attendance Marked Today</small>
        <div class="text-2xl font-bold mt-2">3</div>
      </div>

      <div class="bg-white p-5 rounded-xl shadow border border-gray-100">
        <small class="text-gray-500">Pending Reports</small>
        <div class="text-2xl font-bold mt-2">2</div>
      </div>
    </section>
  `;
});
