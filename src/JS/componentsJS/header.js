document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.querySelector("#header");
  if (headerEl) {
    headerEl.innerHTML = `
    <header
  class="w-full bg-[#FFFFFF] h-16 px-8 py-4 flex items-center justify-between shadow-[0_4px_15px_rgba(0,0,0,0.05)]"
>
  <a href="#" class="text-xl text-[#012970] font-semibold italic">Attendify</a>
  <!-- Header icons -->
  <div class="flex items-center gap-4">
    <a href=""><i class="fa-regular fa-bell text-lg"></i></a>
    <a href=""><i class="fa-regular fa-message text-lg"></i></a>
    <a href="" class="hidden lg:flex items-center gap-1">
      <img
        src="../../../public/images/user-image.webp"
        alt="userImage"
        class="w-6 rounded-full"
      />
      <h4 class="text-[#012970]">Batoul</h4>
    </a>
    <button id="menu-btn" class="lg:hidden">
      <i class="fa-solid fa-bars text-lg"></i>
    </button>
  </div>
</header>
<div
  id="side-bar"
  class="fixed top-0 right-0 w-64 h-full bg-white shadow-lg translate-x-full transform transition-transform duration-300 z-50 px-6 py-9"
>
  <nav class="flex flex-col gap-6">
    <div>
      <a href="" class="flex items-center gap-2">
        <img
          src="../../../public/images/user-image.webp"
          alt="userImage"
          class="w-8 rounded-full"
        />
        <h4
          class="text-[#012970] hover:text-[#001334] transition-all duration-300"
        >
          Batoul
        </h4>
      </a>
    </div>

    <div>
      <h3 class="text-xs text-gray-500 tracking-widest font-semibold mb-2">
        TRACK
      </h3>
      <a
        href="../../Pages/student/attendace.html"
        class="flex items-center gap-3 text-[#012970] py-2 hover:text-[#001334] transition-all duration-300"
      >
        <i class="fa-solid fa-table-list"></i>
        Attendance Sheet
      </a>
    </div>

    <div>
      <h3 class="text-xs text-gray-500 tracking-widest font-semibold mb-2">
        ANALYZE
      </h3>
      <a
        href="#"
        class="flex items-center gap-3 text-[#001334] py-2 font-semibold transition-all duration-300"
      >
        <i class="fa-solid fa-chart-pie"></i>
        Dashboard
      </a>
    </div>

    <div>
      <h3 class="text-xs text-gray-500 tracking-widest font-semibold mb-2">
        MANAGE
      </h3>

      <a
        href="#"
        class="flex items-center gap-3 text-[#012970] py-2 hover:text-[#001334] transition-all duration-300"
      >
        <i class="fa-regular fa-user"></i>
        Student
      </a>
    </div>

    <a
      href="#"
      class="flex items-center gap-3 text-red-600 py-2 hover:text-red-900 transition-all duration-300"
    >
      <i class="fa-solid fa-right-from-bracket"></i>
      Logout
    </a>
  </nav>
</div>
    `;
    const menuBtn = document.getElementById("menu-btn");
    const sidebar = document.getElementById("side-bar");
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("translate-x-full");
    });
  }
});
