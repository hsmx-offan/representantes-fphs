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
/* =========================================================
   CUENTA REGRESIVA — TOGETHER, TOGETHER TOUR MÉXICO 2026
   ========================================================= */

const conciertos = [
    {
        nombre: "31 JUL · CIUDAD DE MÉXICO",
        fecha: "2026-07-31T21:00:00-06:00",
        fin: "2026-08-01T00:00:00-06:00"
    },
    {
        nombre: "01 AGO · CIUDAD DE MÉXICO",
        fecha: "2026-08-01T21:00:00-06:00",
        fin: "2026-08-02T00:00:00-06:00"
    },
    {
        nombre: "04 AGO · CIUDAD DE MÉXICO",
        fecha: "2026-08-04T21:00:00-06:00",
        fin: "2026-08-05T00:00:00-06:00"
    },
    {
        nombre: "07 AGO · CIUDAD DE MÉXICO",
        fecha: "2026-08-07T21:00:00-06:00",
        fin: "2026-08-08T00:00:00-06:00"
    },
    {
        nombre: "08 AGO · CIUDAD DE MÉXICO",
        fecha: "2026-08-08T21:00:00-06:00",
        fin: "2026-08-09T00:00:00-06:00"
    },
    {
        nombre: "10 AGO · CIUDAD DE MÉXICO",
        fecha: "2026-08-10T21:00:00-06:00",
        fin: "2026-08-11T00:00:00-06:00"
    }
];


function actualizarCountdown() {

    const countdown = document.querySelector(".countdown");

    if (!countdown) return;

    const ahora = new Date();

    const etiqueta =
        document.querySelector(".countdown-etiqueta");

    const titulo =
        document.getElementById("countdownFecha");

    const dias =
        document.getElementById("dias");

    const horas =
        document.getElementById("horas");

    const minutos =
        document.getElementById("minutos");

    const segundos =
        document.getElementById("segundos");


    /* =========================
       ¿HAY UNA NOCHE EN CURSO?
       ========================= */

    const conciertoEnCurso = conciertos.find(concierto => {

        const inicio = new Date(concierto.fecha);
        const fin = new Date(concierto.fin);

        return ahora >= inicio && ahora < fin;

    });


    if (conciertoEnCurso) {

        countdown.classList.add("en-curso");
        countdown.classList.remove("completado");

        etiqueta.textContent =
            "TOGETHER, TOGETHER TOUR · MÉXICO 2026";

        titulo.textContent =
            "NOCHE EN CURSO ♡";

        dias.textContent = "♡";
        horas.textContent = "♡";
        minutos.textContent = "♡";
        segundos.textContent = "♡";

        return;
    }


    /* =========================
       BUSCAR PRÓXIMO CONCIERTO
       ========================= */

    const proximo = conciertos.find(
        concierto => new Date(concierto.fecha) > ahora
    );


    /* =========================
       TOUR TERMINADO
       ========================= */

    if (!proximo) {

        countdown.classList.remove("en-curso");
        countdown.classList.add("completado");

        etiqueta.textContent =
            "TOGETHER, TOGETHER TOUR · MÉXICO 2026";

        titulo.textContent =
            "TOUR COMPLETADO ♡";

        dias.textContent = "♡";
        horas.textContent = "♡";
        minutos.textContent = "♡";
        segundos.textContent = "♡";

        return;
    }


    /* =========================
       CUENTA REGRESIVA
       ========================= */

    countdown.classList.remove(
        "en-curso",
        "completado"
    );

    etiqueta.textContent = "PRÓXIMA NOCHE";

    titulo.textContent = proximo.nombre;

    const fechaConcierto =
        new Date(proximo.fecha);

    const diferencia =
        fechaConcierto - ahora;

    const d = Math.floor(
        diferencia / (1000 * 60 * 60 * 24)
    );

    const h = Math.floor(
        (diferencia / (1000 * 60 * 60)) % 24
    );

    const m = Math.floor(
        (diferencia / (1000 * 60)) % 60
    );

    const s = Math.floor(
        (diferencia / 1000) % 60
    );

    dias.textContent =
        String(d).padStart(2, "0");

    horas.textContent =
        String(h).padStart(2, "0");

    minutos.textContent =
        String(m).padStart(2, "0");

    segundos.textContent =
        String(s).padStart(2, "0");
}


actualizarCountdown();

setInterval(actualizarCountdown, 1000);
