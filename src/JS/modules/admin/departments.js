import {
  getAllDepartments,
  createDepartment,
  deleteDepartment,
} from "../../firebase/firebase-helper.js";

// Elements
const addBtn = document.querySelector("button.bg-primary");
const modal = document.getElementById("addDeptModal");
const closeModal = document.getElementById("closeDeptModal");
const saveBtn = document.getElementById("saveDeptBtn");
const deptNameInput = document.getElementById("deptNameInput");
const tableBody = document.querySelector("tbody");

// Open Modal
addBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// Close Modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  deptNameInput.value = "";
});

// Load Departments
async function loadDepartments() {
  tableBody.innerHTML = "";

  const departments = await getAllDepartments();

  departments.forEach((dept) => {
    const row = document.createElement("tr");
    row.className = "border-b border-gray-200";

    row.innerHTML = `
      <td class="px-4 py-3">${dept.dName}</td>
      <td class="px-4 py-3 flex items-center justify-center">
        <button data-id="${dept.departmentId}" class="delete-btn">
          <i class="fa-solid fa-trash text-red-600 text-lg cursor-pointer"></i>
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  bindDeleteButtons();
}

// Save Department
saveBtn.addEventListener("click", async () => {
  const name = deptNameInput.value.trim();

  if (!name) {
    alert("Please enter a department name");
    return;
  }

  const id = await createDepartment(null, { dName: name });

  if (id) {
    alert("Department added successfully");
    modal.classList.add("hidden");
    deptNameInput.value = "";
    loadDepartments();
  }
});

// Delete Department
function bindDeleteButtons() {
  const deleteBtns = document.querySelectorAll(".delete-btn");

  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");

      if (!confirm("Are you sure you want to delete this department?")) return;

      await deleteDepartment(id);
      loadDepartments();
    });
  });
}

// Initial Load
loadDepartments();
