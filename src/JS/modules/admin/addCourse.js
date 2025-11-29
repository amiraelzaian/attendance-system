'use strict';
const addCourseButton = document.querySelector(".admin--addCourse");
const overlay = document.querySelector(".addCourse-overlay");
const closePopUp = document.querySelector(".close-btn");
const submitButton = document.querySelector(".submit-button");
const popUp = document.querySelector(".popup");
const addCourseForm = document.querySelector(".add-Course-form");


// functions
function showPopup() {
    overlay.classList.remove("hidden");
    popUp.classList.remove("hidden")
}

function hidePopup() {
    overlay.classList.add("hidden");
    popUp.classList.add("hidden");
    addCourseForm.reset();

}

function submitForm() {
    const department = document.getElementById('department').value;
    const courseName = document.getElementById('course-name').value;
    const courseID = document.getElementById('course-id').value;
   

    // Handle form submission logic here
    console.log('Departement Added:', { department ,courseName ,courseID });

    // Close the popup after submission
    hidePopup();
}

// event handle
closePopUp.addEventListener("click", ()=>{
    // console.log("close button clicked");
    hidePopup();
});
addCourseButton.addEventListener("click", function (){
     console.log("add department clicked");
    showPopup();
});

overlay.addEventListener("click",()=>hidePopup());

// submitButton.addEventListener("click", ()=>{
//     console.log("submit button clicked");
//     submitForm();
// });
addCourseForm.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent reload

    const department = document.getElementById("department");
    if (!department.value.trim()) {
        alert("Please Enter the department.");
        return;
    }

    submitForm();
});



