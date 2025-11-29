'use strict';
const addUserButton = document.querySelector(".admin--addUser");
const overlay = document.querySelector(".addUser-overlay");
const closePopUp = document.querySelector(".close-btn");
const submitButton = document.querySelector(".submit-button");
const popUp = document.querySelector(".popup");
const AddUserForm = document.querySelector(".add-user-form");



const checkBoxes = document.querySelectorAll(".course-checkbox");
const coursesHidden = document.getElementById("coursesHidden");

checkBoxes.forEach(cb => {
  cb.addEventListener("change", () => {
    const selected = [...checkBoxes]
      .filter(c => c.checked)
      .map(c => c.value);

    coursesHidden.value = selected.join(","); // store in hidden input
  });
});

// functions
function showPopup() {
    overlay.classList.remove("hidden");
    popUp.classList.remove("hidden")
}

function hidePopup() {
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
    // console.log("close button clicked");
    hidePopup();
});
addUserButton.addEventListener("click", function (){
    // console.log("add user clicked");
    showPopup();
});

overlay.addEventListener("click",()=>hidePopup());

// submitButton.addEventListener("click", ()=>{
//     console.log("submit button clicked");
//     submitForm();
// });
AddUserForm.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent reload

    const username = document.getElementById("username");
    const email = document.getElementById("email");

    if (!username.value.trim() || !email.value.trim()) {
        alert("Please fill in all required fields.");
        return;
    }

    if (!email.checkValidity()) {
        alert("Please enter a valid email.");
        return;
    }

    if (coursesHidden.value.trim() === "") {
    alert("Please select at least one course.");
    return;
}


    submitForm();
});



const dropdownBtn = document.getElementById("dropdownBtn");
const dropdownMenu = document.getElementById("dropdownMenu");
const selectedTags = document.getElementById("selectedTags");
const checkboxes = document.querySelectorAll(".course-checkbox");
const arrowIcon = document.getElementById("arrowIcon");
const dropdownLabel = document.getElementById("dropdownLabel");

// Toggle dropdown
dropdownBtn.addEventListener("click", () => {
  dropdownMenu.classList.toggle("hidden");

  // Rotate arrow
  arrowIcon.classList.toggle("rotate-180");
});

// Update selected tags
checkboxes.forEach(cb => {
  cb.addEventListener("change", () => {
    updateTags();
  });
});

function updateTags() {
  selectedTags.innerHTML = ""; // clear previous

  const selected = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => cb.value);

  // Update placeholder text
  dropdownLabel.textContent = selected.length
  ? `${selected.length} selected`
  : "Select courses";

  // Make tags
  selected.forEach(item => {
    const tag = document.createElement("span");
    tag.className =
      "bg-gray-200 px-2 py-1 rounded text-sm inline-flex items-center gap-1";

    tag.innerHTML = `
      ${item}
      <button class="text-red-500 font-bold remove-tag" data-value="${item}">×</button>
    `;
    selectedTags.appendChild(tag);
  });

  // Remove tag logic
  document.querySelectorAll(".remove-tag").forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.getAttribute("data-value");
      const checkbox = Array.from(checkboxes).find(cb => cb.value === value);
      checkbox.checked = false;
      updateTags();
    });
  });
}

// Close dropdown if clicking outside
window.addEventListener("click", (e) => {
  if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.add("hidden");
    arrowIcon.classList.remove("rotate-180");
  }
});


