import { getAllUsers, deleteUser } from "../../firebase/firebase-helper.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("Loading users management page...");

    const role = localStorage.getItem("role");
    if (!role || (role !== "admin" && role !== "instructor")) {
      console.warn("Unauthorized access");
      window.location.href = "/index.html";
      return;
    }

    const tbody = document.querySelector("tbody");
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-gray-500"><i class="fa-solid fa-spinner fa-spin mr-2"></i>Loading users...</td></tr>`;

    const data = await getAllUsers();
    if (!data || !data.users || !data.users.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-gray-500">No users found.</td></tr>`;
      return;
    }

    renderUsers(data.users);
  } catch (error) {
    console.error(error);
    const tbody = document.querySelector("tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-red-500"><i class="fa-solid fa-exclamation-triangle mr-2"></i>Failed to load users. Please try again.</td></tr>`;
    }
  }
});

function renderUsers(users) {
  const tbody = document.querySelector("tbody");
  if (!tbody) return;

  tbody.innerHTML = users
    .map(
      (user) => `
    <tr class="border-b border-gray-200 hover:bg-gray-50 block md:table-row p-3 md:p-0" data-user-id="${
      user.id
    }">
      <td class="px-4 py-3 block md:table-cell"><span class="font-semibold md:hidden">Name: </span>${
        user.name || "N/A"
      }</td>
      <td class="px-4 py-3 block md:table-cell"><span class="font-semibold md:hidden">Email: </span>${
        user.email || "N/A"
      }</td>
      <td class="px-4 py-3 block md:table-cell"><span class="font-semibold md:hidden">Role: </span>${
        user.role || "N/A"
      }</td>
      <td class="px-4 py-3 flex justify-center md:table-cell md:text-center">
        <button class="delete-btn" data-user-id="${
          user.id
        }"><i class="fa-solid fa-trash text-red-600 text-lg cursor-pointer"></i></button>
        <button class="update-btn ml-2" data-user-id="${
          user.id
        }"><i class="fa-solid fa-pen text-blue-600 text-lg cursor-pointer"></i></button>
      </td>
    </tr>
  `
    )
    .join("");

  attachDeleteHandlers();
}

function attachDeleteHandlers() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const userId = btn.dataset.userId;
      const row = btn.closest("tr");
      const userName = row
        .querySelector("td:first-child")
        .textContent.replace("Name: ", "")
        .trim();

      if (
        !userId ||
        !confirm(`Are you sure you want to delete user "${userName}"?`)
      )
        return;

      try {
        btn.disabled = true;
        btn.innerHTML =
          '<i class="fa-solid fa-spinner fa-spin text-gray-400"></i>';

        const success = await deleteUser(userId);
        if (success) {
          row.style.opacity = "0";
          row.style.transition = "opacity 0.3s";
          setTimeout(() => {
            row.remove();
            if (!document.querySelector("tbody").children.length) {
              document.querySelector(
                "tbody"
              ).innerHTML = `<tr><td colspan="4" class="px-4 py-8 text-center text-gray-500">No users found.</td></tr>`;
            }
          }, 300);
          alert("User deleted successfully!");
        }
      } catch (err) {
        console.error(err);
        alert("Failed to delete user. Try again.");
        btn.disabled = false;
        btn.innerHTML =
          '<i class="fa-solid fa-trash text-red-600 text-lg cursor-pointer"></i>';
      }
    });
  });
}

export { renderUsers };
