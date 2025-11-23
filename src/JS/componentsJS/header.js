fetch("../../components/header.html")
  .then((res) => res.text())
  .then((data) => {
    const headerEl = document.querySelector("#header");
    if (headerEl) {
      headerEl.innerHTML = data;
    }
    //Implement humburger icon toggle
    const menuBtn = document.getElementById("menu-btn");
    const sidebar = document.getElementById("sidebar");
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("translate-x-full");
    });
  });
