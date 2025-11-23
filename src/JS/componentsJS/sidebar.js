document.addEventListener("DOMContentLoaded", () => {
  const sidebarEl = document.querySelector("#sidebar");

  if (sidebarEl) {
    sidebarEl.innerHTML = `
    <section
    class="hidden lg:block col-span-0 lg:col-span-1 bg-white shadow-[2px_0_10px_rgba(0,0,0,0.05)] px-6 py-8"
    >
    <nav class="flex flex-col gap-6">
        <div>
        <h3 class="text-xs text-gray-500 tracking-widest font-semibold mb-2">
            TRACK
        </h3>
        <a
            href="#"
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
    </section>

  `;
  }
});
