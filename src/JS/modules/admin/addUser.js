"use strict";

import {
  createUser,
  getAllUsers,
  updateUser,
  getAllDepartments,
  getAllCourses,
  getUserById,
} from "../../firebase/firebase-helper.js";
import { renderUsers } from "./adminDashboard.js";

console.log("✅ addUser.js loaded");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ DOM Content Loaded");

  const addUserButton = document.querySelector(".admin--addUser");
  const overlay = document.querySelector(".addUser-overlay");
  const closePopUp = document.querySelector(".close-btn");
  const popUp = document.querySelector(".popup");
  const AddUserForm = document.querySelector(".add-user-form");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const departmentSelect = document.getElementById("departmentSelect");
  const coursesSelect = document.getElementById("coursesSelect");
  const submitBtn = document.querySelector(".submit-button");

  if (!addUserButton || !overlay || !popUp) return;

  function showPopup() {
    overlay.classList.remove("hidden");
    popUp.classList.remove("hidden");
  }

  function hidePopup() {
    overlay.classList.add("hidden");
    popUp.classList.add("hidden");
    AddUserForm.reset();
    delete AddUserForm.dataset.updateUserId;
  }

  async function loadDepartments() {
    const departments = await getAllDepartments();
    departmentSelect.innerHTML =
      `<option value="">Select department</option>` +
      departments
        .map((d) => `<option value="${d.id}">${d.dName}</option>`)
        .join("");
  }

  async function loadCourses() {
    const courses = await getAllCourses();
    coursesSelect.innerHTML = courses
      .map((c) => `<option value="${c.id}">${c.Name}</option>`)
      .join("");
  }

  await loadDepartments();
  await loadCourses();

  addUserButton.addEventListener("click", showPopup);
  closePopUp.addEventListener("click", (e) => {
    e.preventDefault();
    hidePopup();
  });
  overlay.addEventListener("click", hidePopup);

  function attachUpdateButtons() {
    document.querySelectorAll(".update-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const tr = e.target.closest("tr");
        const userId = tr.dataset.userId;
        const user = await getUserById(userId);

        showPopup();
        usernameInput.value = user.name;
        emailInput.value = user.email;
        passwordInput.value = "";
        departmentSelect.value = user.department || "";

        Array.from(coursesSelect.options).forEach((opt) => {
          opt.selected = user.courses.includes(opt.value);
        });

        AddUserForm.dataset.updateUserId = userId;
      });
    });
  }

  attachUpdateButtons();

  AddUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const department = departmentSelect.value;
    const courses = Array.from(coursesSelect.selectedOptions).map(
      (o) => o.value
    );

    if (
      !username ||
      !email ||
      (!password && !AddUserForm.dataset.updateUserId)
    ) {
      alert("⚠️ Please fill required fields.");
      return;
    }

    const originalText = submitBtn.textContent;
    submitBtn.textContent = AddUserForm.dataset.updateUserId
      ? "Updating..."
      : "Creating...";
    submitBtn.disabled = true;

    try {
      if (AddUserForm.dataset.updateUserId) {
        const userId = AddUserForm.dataset.updateUserId;
        const updateData = { name: username, department, courses };
        if (password) updateData.password = password;
        await updateUser(userId, updateData);
        alert("✅ User updated successfully!");
      } else {
        await createUser({
          name: username,
          email,
          password,
          department,
          courses,
        });
        alert("✅ User created successfully!");
      }

      hidePopup();
      const data = await getAllUsers();
      if (data && data.users) {
        renderUsers(data.users);
        attachUpdateButtons();
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error submitting form");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
});
