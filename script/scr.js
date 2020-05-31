const hamburger = document.querySelector(".hamburger");
const leftMenu = document.querySelector(".left-menu");

hamburger.addEventListener("click", () => {
    leftMenu.classList.toggle("openMenu");
    hamburger.classList.toggle("open");
});

leftMenu.addEventListener("click", event => {
    const target = event.target;
    const dropdown = target.closest(".dropdown");

    if (target.closest(".dropdown")) {
        dropdown.classList.toggle("active");
        leftMenu.classList.add("openMenu");
        hamburger.classList.add("open");
    }
});

document.body.addEventListener("click", event => {
    const target = event.target;

    if (!target.closest(".left-menu")) {
        leftMenu.classList.remove("openMenu");
        hamburger.classList.remove("open");
    }
});

