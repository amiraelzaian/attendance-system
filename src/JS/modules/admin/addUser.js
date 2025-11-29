"use strict";

// Import Firebase functions
import { createUser, getAllUsers } from "../../firebase/firebase-helper.js";
import { renderUsers } from "./adminDashboard.js";

console.log("✅ addUser.js loaded");

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ DOM Content Loaded");

  // DOM Elements
  const addUserButton = document.querySelector(".admin--addUser");
  const overlay = document.querySelector(".addUser-overlay");
  const closePopUp = document.querySelector(".close-btn");
  const popUp = document.querySelector(".popup");
  const AddUserForm = document.querySelector(".add-user-form");
  const coursesHidden = document.getElementById("coursesHidden");

  // Check if elements exist
  console.log("Elements found:", {
    addUserButton: !!addUserButton,
    overlay: !!overlay,
    closePopUp: !!closePopUp,
    popUp: !!popUp,
    AddUserForm: !!AddUserForm,
  });

  if (!addUserButton || !overlay || !popUp) {
    // ✅ بدون closePopUp
    console.error("❌ Required elements are missing!");
    return;
  }

  // Functions
  function showPopup() {
    console.log("🔵 showPopup called");
    overlay.classList.remove("hidden");
    popUp.classList.remove("hidden");
  }

  function hidePopup() {
    console.log("🔵 hidePopup called");
    overlay.classList.add("hidden");
    popUp.classList.add("hidden");
    AddUserForm.reset();

    // Reset dropdown
    checkboxes.forEach(cb => cb.checked = false); // uncheck all
    updateTags(); // clear selected tags and reset placeholder
    dropdownMenu.classList.add("hidden"); // close dropdown
    arrowIcon.classList.remove("rotate-180"); // reset arrow
}

function submitForm() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    // Handle form submission logic here
    console.log('User Added:', { username, email });

    // Close the popup after submission
    hidePopup();
}

// event handle
closePopUp.addEventListener("click", ()=>{
    console.log("close button clicked");
    hidePopup();
});
addUserButton.addEventListener("click", function (){
    // console.log("add user clicked");
    showPopup();
  });

  closePopUp.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("🔵 Close button clicked");
    hidePopup();
  });

  overlay.addEventListener("click", () => {
    console.log("🔵 Overlay clicked");
    hidePopup();
  });

  // Courses functionality
  const checkBoxes = document.querySelectorAll(".course-checkbox");
  const dropdownBtn = document.getElementById("dropdownBtn");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const selectedTags = document.getElementById("selectedTags");
  const arrowIcon = document.getElementById("arrowIcon");
  const dropdownLabel = document.getElementById("dropdownLabel");

  // Courses selection
  checkBoxes.forEach((cb) => {
    cb.addEventListener("change", () => {
      const selected = [...checkBoxes]
        .filter((c) => c.checked)
        .map((c) => c.value);
      coursesHidden.value = selected.join(",");
      updateTags();
    });
  });

  // Toggle dropdown
  if (dropdownBtn) {
    dropdownBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdownMenu.classList.toggle("hidden");
      arrowIcon.classList.toggle("rotate-180");
    });
  }

  // Update tags function
  function updateTags() {
    if (!selectedTags) return;

    selectedTags.innerHTML = "";
    const checkboxes = document.querySelectorAll(".course-checkbox");
    const selected = Array.from(checkboxes).filter((cb) => cb.checked);

    dropdownLabel.textContent = selected.length
      ? `${selected.length} selected`
      : "Select courses";

    selected.forEach((checkbox) => {
      const courseName = checkbox.value;
      const tag = document.createElement("span");
      tag.className =
        "bg-gray-200 px-2 py-1 rounded text-sm inline-flex items-center gap-1";
      tag.innerHTML = `
        ${courseName}
        <button type="button" class="text-red-500 font-bold remove-tag" data-value="${courseName}">×</button>
      `;
      selectedTags.appendChild(tag);
    });

    document.querySelectorAll(".remove-tag").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const value = btn.getAttribute("data-value");
        const checkbox = Array.from(checkboxes).find(
          (cb) => cb.value === value
        );
        if (checkbox) {
          checkbox.checked = false;
          const selected = [...checkboxes]
            .filter((c) => c.checked)
            .map((c) => c.value);
          coursesHidden.value = selected.join(",");
          updateTags();
        }
      });
    });
  }

  // Close dropdown when clicking outside
  window.addEventListener("click", (e) => {
    if (dropdownBtn && dropdownMenu && arrowIcon) {
      if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add("hidden");
        arrowIcon.classList.remove("rotate-180");
      }
    }
  });

  // Form submission
  if (AddUserForm) {
    AddUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("🔵 Form submitted");

      const username = document.getElementById("username");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const roleInput = document.querySelector('input[name="role"]:checked');
      const departmentInput = document.querySelector(
        'input[name="department"]:checked'
      );

      // Validation
      if (!username.value.trim()) {
        alert("⚠️ Please enter a username.");
        username.focus();
        return;
      }

      if (!email.value.trim() || !email.checkValidity()) {
        alert("⚠️ Please enter a valid email.");
        email.focus();
        return;
      }

      if (!password.value.trim()) {
        alert("⚠️ Please enter a password.");
        password.focus();
        return;
      }

      if (password.value.length < 6) {
        alert("⚠️ Password must be at least 6 characters.");
        password.focus();
        return;
      }

      if (!roleInput) {
        alert("⚠️ Please select a role.");
        return;
      }

      if (!departmentInput) {
        alert("⚠️ Please select a department.");
        return;
      }

      if (coursesHidden.value.trim() === "") {
        alert("⚠️ Please select at least one course.");
        return;
      }

      // Submit
      await submitForm();
    });
  }

  // Submit form function
  async function submitForm() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const roleInput = document.querySelector('input[name="role"]:checked');
    const role = roleInput ? roleInput.value : "student";
    const departmentInput = document.querySelector(
      'input[name="department"]:checked'
    );
    const department = departmentInput ? departmentInput.value : "";
    const courses = coursesHidden.value.split(",").filter((c) => c.trim());

    console.log("Creating user with data:", {
      name: username,
      email,
      role,
      department,
      courses,
    });

    const submitBtn = document.querySelector(".submit-button");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Creating...";
    submitBtn.disabled = true;

    try {
      const result = await createUser({
        name: username,
        email: email,
        password: password,
        role: role,
        department: department,
        courses: courses,
      });

      if (result.success) {
        alert("✅ User created successfully! They can now login.");
        hidePopup();

        // Refresh users UI in the table
        const data = await getAllUsers();

        if (data && data.users) {
          renderUsers(data.users); // ⬅️ تحديث الـ tbody فعلياً
        }
      } else {
        alert("❌ " + result.error);
      }
    } catch (error) {
      console.error("Error in submitForm:", error);
      alert("❌ An error occurred while creating the user.");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }
}); // End of DOMContentLoaded
