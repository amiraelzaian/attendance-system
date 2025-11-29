import {
  createDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from "../../firebase/firebase-helper.js";

const addDepartmentButton = document.querySelector(".admin--addDepartment");
const overlay = document.querySelector(".addDepartment-overlay");
const closePopUp = document.querySelector(".close-btn");
const popUp = document.querySelector(".popup");
const addDepartmentForm = document.querySelector(".add-Department-form");
const departmentInput = document.getElementById("department");
const tableBody = document.querySelector("tbody");

let editingDeptId = null; // Track if we're editing

// --- Functions ---

// Show popup
function showPopup() {
  overlay.classList.remove("hidden");
  popUp.classList.remove("hidden");
}

// Hide popup
function hidePopup() {
  overlay.classList.add("hidden");
  popUp.classList.add("hidden");
  addDepartmentForm.reset();
  editingDeptId = null;
  addDepartmentForm.querySelector("button[type=submit]").textContent = "Add";
}

// Add or update department in table
function addDepartmentToTable(deptName, deptId) {
  // Check if department already exists in table (update)
  const existingRow = tableBody.querySelector(`tr[data-id="${deptId}"]`);
  if (existingRow) {
    existingRow.querySelector("td").textContent = deptName;
    return;
  }

  const tr = document.createElement("tr");
  tr.classList.add("border-b", "border-gray-200");
  tr.dataset.id = deptId;
  tr.innerHTML = `
    <td class="px-4 py-3">${deptName}</td>
    <td class="px-4 py-3 flex items-center justify-center gap-2">
      <button class="edit-btn text-blue-600 cursor-pointer"><i class="fa-solid fa-pen"></i></button>
      <button class="delete-btn text-red-600 cursor-pointer"><i class="fa-solid fa-trash"></i></button>
    </td>
  `;

  // Edit button
  const editBtn = tr.querySelector(".edit-btn");
  editBtn.addEventListener("click", () => {
    departmentInput.value = deptName;
    editingDeptId = deptId;
    addDepartmentForm.querySelector("button[type=submit]").textContent =
      "Update";
    showPopup();
  });

  // Delete button
  const deleteBtn = tr.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", async () => {
    if (confirm(`Are you sure you want to delete "${deptName}"?`)) {
      const success = await deleteDepartment(deptId);
      if (success) tr.remove();
      else alert("Failed to delete department.");
    }
  });

  tableBody.appendChild(tr);
}

// Submit form
async function submitForm() {
  const deptName = departmentInput.value.trim();
  if (!deptName) return;

  try {
    if (editingDeptId) {
      // Update existing
      const success = await updateDepartment(editingDeptId, {
        dName: deptName,
      });
      if (success) addDepartmentToTable(deptName, editingDeptId);
      else alert("Failed to update department.");
    } else {
      // Add new
      const deptId = await createDepartment(null, { dName: deptName });
      if (deptId) addDepartmentToTable(deptName, deptId);
      else alert("Failed to add department.");
    }

    hidePopup();
  } catch (error) {
    console.error(error);
    alert("Error saving department.");
  }
}

// --- Event Listeners ---
addDepartmentButton.addEventListener("click", showPopup);
closePopUp.addEventListener("click", (e) => {
  e.preventDefault();
  hidePopup();
});
overlay.addEventListener("click", hidePopup);

addDepartmentForm.addEventListener("submit", (e) => {
  e.preventDefault();
  submitForm();
});

// Load existing departments
window.addEventListener("DOMContentLoaded", async () => {
  const departments = await getAllDepartments();
  departments.forEach((dept) => addDepartmentToTable(dept.dName, dept.id));
});
