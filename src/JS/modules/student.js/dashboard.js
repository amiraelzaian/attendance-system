// Implement chart js
import Chart from "chart.js/auto";
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

