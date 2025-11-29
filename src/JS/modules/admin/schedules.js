import { db } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

// DOM Elements
const addBtn = document.getElementById("addScheduleBtn");
const popup = document.getElementById("schedulePopup");
const closePopupBtn = document.getElementById("closePopup");
const saveBtn = document.getElementById("saveSchedule");
const scheduleNameInput = document.getElementById("scheduleName");
const scheduleImageInput = document.getElementById("scheduleImage");
const tbody = document.querySelector("tbody");

// Open / Close Popup
addBtn.addEventListener("click", () => popup.classList.remove("hidden"));
closePopupBtn.addEventListener("click", () => popup.classList.add("hidden"));

// Upload image to Cloudinary
async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "schedules"); // Your preset name

  // Cloudinary Cloud Name
  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dea11qjic/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("Cloudinary upload failed");
  }

  return data.secure_url; // URL to save in Firestore
}

// Firestore functions
async function addSchedule(name, imageUrl) {
  await addDoc(collection(db, "schedules"), {
    name,
    imageUrl,
    createdAt: new Date(),
  });
}

async function deleteSchedule(id) {
  await deleteDoc(doc(db, "schedules", id));
}

async function loadSchedules() {
  const snapshot = await getDocs(collection(db, "schedules"));
  const schedules = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  renderSchedules(schedules);
}

// Render schedules in table
function renderSchedules(schedules) {
  tbody.innerHTML = schedules
    .map(
      (s) => `
    <tr class="border-b">
      <td class="px-4 py-2">${s.name}</td>
      <td class="px-4 py-2"><img src="${s.imageUrl}" class="w-16 h-16 rounded" /></td>
      <td class="px-4 py-2">
        <button class="delete-btn" data-id="${s.id}">
          <i class="fa-solid fa-trash text-red-600 text-lg cursor-pointer"></i>
        </button>
      </td>
    </tr>
  `
    )
    .join("");

  // Attach delete handlers
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.onclick = async () => {
      if (confirm("Delete this schedule?")) {
        await deleteSchedule(btn.dataset.id);
        loadSchedules();
      }
    };
  });
}

// Save schedule
saveBtn.addEventListener("click", async () => {
  const name = scheduleNameInput.value.trim();
  const file = scheduleImageInput.files[0];

  if (!name || !file) return alert("Please provide name and image");

  const imageUrl = await uploadToCloudinary(file);
  await addSchedule(name, imageUrl);

  // Clear inputs and close popup
  scheduleNameInput.value = "";
  scheduleImageInput.value = "";
  popup.classList.add("hidden");

  loadSchedules();
});

// Load schedules on page load
document.addEventListener("DOMContentLoaded", loadSchedules);
