import { detectSidebar } from "./sidebar";
import { activeCurrentPage } from "./sidebar";
document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.querySelector("#header");
  const navSide = detectSidebar();
  if (headerEl) {
    headerEl.innerHTML = `
    <header
    class="w-full bg-[#FFFFFF] h-16 px-8 py-4 flex items-center justify-between shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
  >
    <a href="#" class="text-xl text-primary font-semibold italic">Attendify</a>
    <!-- Header icons -->
    <div class="icons-sec flex items-center gap-4">
      <a href="../../Pages/student/notification.html" class="notification-btn"><i class="fa-regular fa-bell text-lg text-primary"></i></a>
      <a href=""><i class="fa-regular fa-message text-lg text-primary"></i></a>
      <a href="../../Pages/student/studentProfile.html" class="hidden lg:flex items-center gap-1">
        <img
          src="../../../public/images/user-image.webp"
          alt="userImage"
          class="w-8 rounded-full"
        />
        <h4 class="text-primary text-lg font-medium">Batoul</h4>
      </a>
      <button id="menu-btn" class="text-primary lg:hidden">
        <i class="fa-solid fa-bars text-lg"></i>
      </button>
    </div>
  </header>

  <div
    id="side-bar"
    class="fixed top-0 right-0 w-64 h-full bg-white shadow-lg translate-x-full transform transition-transform duration-300 z-50 px-6 py-8"
  >
    <div class="mb-4 border-b border-gray-300 pb-5 ">
      <a href="../../Pages/student/studentProfile.html" class="flex items-center gap-2">
        <img
          src="../../../public/images/user-image.webp"
          alt="userImage"
          class="w-12 rounded-full"
        />
        <h4
          class="text-primary font-medium text-xl"
        >
          Batoul
        </h4>
      </a>
    </div>
    ${navSide}
  </div>
    `;
    const menuBtn = document.getElementById("menu-btn");
    const sidebar = document.getElementById("side-bar");
    const overlay = document.getElementById("overlay");
    const iconsSec = document.querySelector(".icons-sec");
    menuBtn.addEventListener("click", () => {
      sidebar?.classList.remove("translate-x-full");
      overlay?.classList.remove("hidden");
    });

    //Implement auto close for menue
    overlay?.addEventListener("click", function (e) {
      sidebar?.classList.add("translate-x-full");
      overlay?.classList.add("hidden");
    });
    //Edit header view in login page
    const curPage = document.getElementById("loginPage");
    if (curPage) {
      iconsSec?.classList.add("hidden");
    }
  }
  activeCurrentPage();
});
