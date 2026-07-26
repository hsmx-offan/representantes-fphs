function buscarRepresentante() {
    const id = document.getElementById("buscar").value.trim();

    if (id === "") {
        alert("Ingresa el ID del representante.");
        return;
    }

    window.location.href = "representante.html?id=" + encodeURIComponent(id);
}
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const abierto = navLinks.classList.toggle("activo");

        menuToggle.setAttribute(
            "aria-expanded",
            abierto ? "true" : "false"
        );

        menuToggle.innerHTML = abierto
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    navLinks.querySelectorAll("a").forEach((enlace) => {

        enlace.addEventListener("click", () => {

            navLinks.classList.remove("activo");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.innerHTML =
                '<i class="fa-solid fa-bars"></i>';
        });

    });

}
