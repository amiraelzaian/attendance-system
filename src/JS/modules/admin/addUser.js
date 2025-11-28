'use strict';
const addUserButton = document.querySelector(".admin--addUser");
const overlay = document.querySelector(".addUser-overlay");
const closePopUp = document.querySelector(".close-btn");
const submitButton = document.querySelector(".submit-button");
const popUp = document.querySelector(".popup");
const AddUserForm = document.querySelector(".add-user-form");

// functions
function showPopup() {
    overlay.classList.remove("hidden");
    popUp.classList.remove("hidden")
}

function hidePopup() {
    overlay.classList.add("hidden");
    popUp.classList.add("hidden");
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

overlay.addEventListener("click",()=>hidePopup());

submitButton.addEventListener("click", ()=>{
    console.log("submit button clicked");
    submitForm();
});
