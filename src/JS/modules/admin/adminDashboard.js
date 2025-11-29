import { getAllUsers, deleteUser } from "../../firebase/firebase-helper.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("Loading users management page...");

    // 1️⃣ Get user role from localStorage
    const role = localStorage.getItem("role");
    if (!role || (role !== "admin" && role !== "instructor")) {
      console.warn("You are not authorized to view this page.");
      window.location.href = "/index.html"; // Redirect to login
      return;
    }

    // 2️⃣ Get table tbody element
    const tbody = document.querySelector("tbody");
    if (!tbody) {
      console.error("Table body not found");
      return;
    }

    // Show loading state
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-8 text-center text-gray-500">
          <i class="fa-solid fa-spinner fa-spin mr-2"></i>Loading users...
        </td>
      </tr>
    `;

    // 3️⃣ Fetch all users from Firebase
    console.log("Fetching users from Firebase...");
    const data = await getAllUsers();
    console.log("Data received:", data);

    // 4️⃣ Check if data exists
    if (!data || !data.users || data.users.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="px-4 py-8 text-center text-gray-500">
            No users found.
          </td>
        </tr>
      `;
      return;
    }

    const users = data.users;
    console.log(`Found ${users.length} users`);

    // 5️⃣ Render users in table
    renderUsers(users);

    console.log("Users table rendered successfully!");
  } catch (error) {
    console.error("Error loading users:", error);
    const tbody = document.querySelector("tbody");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="px-4 py-8 text-center text-red-500">
            <i class="fa-solid fa-exclamation-triangle mr-2"></i>
            Failed to load users. Please try again.
          </td>
        </tr>
      `;
    }
  }
});

// Function to render users in table
function renderUsers(users) {
  const tbody = document.querySelector("tbody");
  if (!tbody) return;

  tbody.innerHTML = users
    .map(
      (user) => `
      <tr class="border-b border-gray-200 hover:bg-gray-50 block md:table-row p-3 md:p-0" data-user-id="${
        user.id
      }">
        <td class="px-4 py-3 block md:table-cell">
          <span class="font-semibold md:hidden">Name: </span>${
            user.name || "N/A"
          }
        </td>
        <td class="px-4 py-3 block md:table-cell">
          <span class="font-semibold md:hidden">Email: </span>${
            user.email || "N/A"
          }
        </td>
        <td class="px-4 py-3 block md:table-cell">
          <span class="font-semibold md:hidden">Role: </span>${
            user.role || "N/A"
          }
        </td>
        <td class="px-4 py-3 flex justify-center md:table-cell md:text-center">
          <button class="delete-btn" data-user-id="${user.id}">
            <i class="fa-solid fa-trash text-red-600 text-lg cursor-pointer"></i>
          </button>
        </td>
      </tr>
    `
    )
    .join("");

  // Attach delete handlers after rendering
  attachDeleteHandlers();
}

// Function to handle delete buttons
function attachDeleteHandlers() {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();

      const userId = btn.getAttribute("data-user-id");
      const row = btn.closest("tr");
      const userName = row
        .querySelector("td:first-child")
        .textContent.replace("Name: ", "")
        .trim();

      const confirmDelete = confirm(
        `Are you sure you want to delete user "${userName}"?`
      );

      if (confirmDelete && userId) {
        try {
          console.log(`Deleting user: ${userId}`);

          // Disable button during delete
          btn.disabled = true;
          btn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin text-gray-400"></i>';

          // Delete from Firebase
          const success = await deleteUser(userId);

          if (success) {
            // Remove row from table with animation
            row.style.opacity = "0";
            row.style.transition = "opacity 0.3s";

            setTimeout(() => {
              row.remove();

              // Check if table is empty
              const tbody = document.querySelector("tbody");
              if (!tbody.children.length) {
                tbody.innerHTML = `
                  <tr>
                    <td colspan="4" class="px-4 py-8 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                `;
              }
            }, 300);

            alert("User deleted successfully!");
          } else {
            throw new Error("Delete operation failed");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          alert("Failed to delete user. Please try again.");

          // Re-enable button
          btn.disabled = false;
          btn.innerHTML =
            '<i class="fa-solid fa-trash text-red-600 text-lg cursor-pointer"></i>';
        }
      }
    });
  });
}
