const eventosDemo = [

    {
        id: "2026",
        nombre: "Together Together Tour México 2026",
        activo: true
    },

    {
        id: "2028",
        nombre: "Harry Styles México 2028",
        activo: false
    }

];

const lista =
    document.getElementById("listaEventos");

const activo =
    document.getElementById("eventoActivo");

const vistaEvento =
    document.getElementById("vistaEvento");

const colorHome =
    document.querySelector(".color-home");

const tituloEvento =
    document.getElementById("tituloEvento");

const volverEventos =
    document.getElementById("volverEventos");


/* =========================================
   CARGAR EVENTOS
========================================= */

function cargarEventos() {

    const eventoActivo =
        eventosDemo.find(
            evento => evento.activo
        );

    if (eventoActivo) {

        activo.textContent =
            eventoActivo.nombre;

    } else {

        activo.textContent =
            "No hay evento activo.";

    }

    lista.innerHTML = "";

    eventosDemo.forEach(evento => {

        lista.innerHTML += `

        <div class="evento">

            <div>

                <strong>
                    ${evento.nombre}
                </strong>

                <br>

                <small>
                    ${
                        evento.activo
                        ? "🟢 Activo"
                        : "⚪ Inactivo"
                    }
                </small>

            </div>

            <button
                class="abrirEvento"
                data-id="${evento.id}"
            >
                Abrir
            </button>

        </div>

        `;

    });

}


/* =========================================
   ABRIR EVENTO
========================================= */

document.addEventListener("click", (e) => {

    if (
        !e.target.classList.contains(
            "abrirEvento"
        )
    ) {
        return;
    }

    const id =
        e.target.dataset.id;

    const evento =
        eventosDemo.find(
            ev => ev.id === id
        );

    if (!evento) return;

    tituloEvento.textContent =
        evento.nombre;

    colorHome.hidden = true;

    vistaEvento.hidden = false;

});


/* =========================================
   VOLVER
========================================= */

volverEventos.addEventListener("click", () => {

    vistaEvento.hidden = true;

    colorHome.hidden = false;

});


/* =========================================
   INICIO
========================================= */

cargarEventos();
