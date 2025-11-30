import "../style.css";
import { getAllUsers } from "./firebase/firebase-helper.js";

//Add export excel from student table
const exportBtn = document.getElementById("exportExcelBtn");
exportBtn.addEventListener("click", () => {
  const table = document.getElementById("attendanceTable");
  const workbook = XLSX.utils.table_to_book(table, { sheet: "Attendance" });
  XLSX.writeFile(workbook, "attendance-report.xlsx");
});
