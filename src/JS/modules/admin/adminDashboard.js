document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  if (role !== "admin") return;

  const content = document.querySelector("#dashboardContent");

  content.innerHTML = `
  <main class="p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

    <!-- Stats Cards -->
    <div class="bg-white p-6 rounded-xl shadow flex items-center gap-4">
      <i class="fa-solid fa-users text-[#012970] text-3xl"></i>
      <div>
        <p class="text-sm text-gray-500">Total Students</p>
        <p class="text-xl font-bold">2,439</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow flex items-center gap-4">
      <i class="fa-solid fa-chalkboard-user text-green-600 text-3xl"></i>
      <div>
        <p class="text-sm text-gray-500">Instructors</p>
        <p class="text-xl font-bold">54</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow flex items-center gap-4">
      <i class="fa-solid fa-building text-purple-600 text-3xl"></i>
      <div>
        <p class="text-sm text-gray-500">Departments</p>
        <p class="text-xl font-bold">12</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow flex items-center gap-4">
      <i class="fa-solid fa-book text-orange-600 text-3xl"></i>
      <div>
        <p class="text-sm text-gray-500">Courses</p>
        <p class="text-xl font-bold">87</p>
      </div>
    </div>

    <!-- Recent Activity -->
    <section class="bg-white rounded-xl shadow p-6 lg:col-span-4">
      <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>

      <ul class="space-y-3">
        <li class="flex justify-between border-b border-gray-200 pb-2">
          <p>New student added: <span class="font-semibold">Ahmed Ali</span></p>
          <span class="text-gray-400 text-sm">2 hours ago</span>
        </li>

        <li class="flex justify-between border-b border-gray-200 pb-2">
          <p>Instructor updated schedule</p>
          <span class="text-gray-400 text-sm">5 hours ago</span>
        </li>

        <li class="flex justify-between">
          <p>New course created: <span class="font-semibold">Math 101</span></p>
          <span class="text-gray-400 text-sm">1 day ago</span>
        </li>
      </ul>
    </section>

  </main>
   
  `;
});
