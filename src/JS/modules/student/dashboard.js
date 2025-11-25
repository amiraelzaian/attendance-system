// Implement chart js
import Chart from "chart.js/auto";

// localStorage.setItem("role", "instructor"); // ❌ امسحي السطر ده!

// check if is a student
document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem("role");
  console.log("Current role:", role); // للتأكد من الـ role

  if (role !== "student") {
    console.log("Not a student, showing instructor dashboard");
    return;
  }

  document.querySelector("#dashboardContent").innerHTML = `
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
  implementChart();
});

const implementChart = function () {
  const lineCtx = document.getElementById("lineChart");
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
