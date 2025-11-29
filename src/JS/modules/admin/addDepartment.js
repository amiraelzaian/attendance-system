'use strict';
const addDepartmentButton = document.querySelector(".admin--addDepartment");
const overlay = document.querySelector(".addDepartment-overlay");
const closePopUp = document.querySelector(".close-btn");
const submitButton = document.querySelector(".submit-button");
const popUp = document.querySelector(".popup");
const addDepartmentForm = document.querySelector(".add-Department-form");


// functions
function showPopup() {
    overlay.classList.remove("hidden");
    popUp.classList.remove("hidden")
}

function hidePopup() {
    overlay.classList.add("hidden");
    popUp.classList.add("hidden");
    addDepartmentForm.reset();

}

function submitForm() {
    const department = document.getElementById('department').value;
   

    // Handle form submission logic here
    console.log('Departement Added:', { department });

    // Close the popup after submission
    hidePopup();
}

// event handle
closePopUp.addEventListener("click", ()=>{
    // console.log("close button clicked");
    hidePopup();
});
addDepartmentButton.addEventListener("click", function (){
     console.log("add department clicked");
    showPopup();
});

overlay.addEventListener("click",()=>hidePopup());

// submitButton.addEventListener("click", ()=>{
//     console.log("submit button clicked");
//     submitForm();
// });
addDepartmentForm.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent reload

    const department = document.getElementById("department");
    if (!department.value.trim()) {
        alert("Please Enter the department.");
        return;
    }

    submitForm();
});



