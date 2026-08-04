/* =========================================
   COLOR MANAGER
   CONTROLADOR PRINCIPAL
========================================= */

import { db } from "./shared/firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


/* =========================================
   ESTADO
========================================= */

let eventos = [];

let eventoSeleccionadoId = null;


/* =========================================
   ELEMENTOS
========================================= */

const lista =
    document.getElementById("listaEventos");

const activo =
    document.getElementById("eventoActivo");

const colorHome =
    document.querySelector(".color-home");

const vistaEvento =
    document.getElementById("vistaEvento");

const tituloEvento =
    document.getElementById("tituloEvento");

const volverEventos =
    document.getElementById("volverEventos");

const contenidoManager =
    document.getElementById("contenidoManager");

const tabs =
    document.querySelectorAll(".tab-manager");


/* =========================================
   DATOS COMPARTIDOS CON OTROS SCRIPTS
========================================= */

window.contenidoManager =
    contenidoManager;

window.obtenerEventoSeleccionadoId =
    function () {

        return eventoSeleccionadoId;

    };


/* =========================================
   CARGAR EVENTOS DESDE FIRESTORE
========================================= */

async function cargarEventos() {

    mostrarCargandoEventos();

    try {

        const snapshot =
            await getDocs(
                collection(db, "eventos")
            );

        eventos =
            snapshot.docs.map((documento) => ({

                id: documento.id,

                ...documento.data()

            }));

        eventos.sort((a, b) => {

            const anioA =
                Number(a.anio) || 0;

            const anioB =
                Number(b.anio) || 0;

            return anioB - anioA;

        });

        renderEventos();

    } catch (error) {

        console.error(
            "Error al cargar eventos:",
            error
        );

        activo.textContent =
            "No fue posible cargar el evento activo.";

        lista.innerHTML = `
            <div class="sin-registros">

                <h3>
                    No fue posible cargar las ediciones
                </h3>

                <p>
                    Revisa la consola del navegador y las
                    reglas de Firestore.
                </p>

            </div>
        `;

    }

}


/* =========================================
   MOSTRAR ESTADO DE CARGA
========================================= */

function mostrarCargandoEventos() {

    activo.textContent =
        "Cargando evento activo...";

    lista.innerHTML = `
        <div class="sin-registros">

            <p>
                Cargando ediciones...
            </p>

        </div>
    `;

}


/* =========================================
   RENDERIZAR EVENTOS
========================================= */

function renderEventos() {

    const eventoActivo =
        eventos.find(
            (evento) =>
                evento.activo === true
        );

    activo.textContent =
        eventoActivo
            ? eventoActivo.nombre
            : "No hay evento activo.";

    lista.innerHTML = "";

    if (eventos.length === 0) {

        lista.innerHTML = `
            <div class="sin-registros">

                <h3>
                    No hay ediciones
                </h3>

                <p>
                    Crea la primera edición desde
                    Color Manager.
                </p>

            </div>
        `;

        return;

    }

    eventos.forEach((evento) => {

        const tarjeta =
            document.createElement("div");

        tarjeta.className =
            "evento";


        const informacion =
            document.createElement("div");


        const nombre =
            document.createElement("strong");

        nombre.textContent =
            evento.nombre || evento.id;


        const estado =
            document.createElement("small");

        estado.textContent =
            evento.activo === true
                ? "🟢 Activo"
                : "⚪ Inactivo";


        informacion.appendChild(nombre);
        informacion.appendChild(estado);


        const boton =
            document.createElement("button");

        boton.type =
            "button";

        boton.className =
            "abrirEvento";

        boton.dataset.id =
            evento.id;

        boton.textContent =
            "Abrir";


        tarjeta.appendChild(informacion);
        tarjeta.appendChild(boton);

        lista.appendChild(tarjeta);

    });

}


/* =========================================
   ABRIR EVENTO
========================================= */

function abrirEvento(eventoId) {

    const evento =
        eventos.find(
            (item) =>
                item.id === eventoId
        );

    if (!evento) {

        console.warn(
            "No se encontró el evento:",
            eventoId
        );

        return;

    }

    eventoSeleccionadoId =
        evento.id;

    tituloEvento.textContent =
        evento.nombre || evento.id;

    colorHome.hidden =
        true;

    vistaEvento.hidden =
        false;

    mostrarModulo("fechas");

}


/* =========================================
   CAMBIAR PESTAÑA
========================================= */

function mostrarModulo(modulo) {

    tabs.forEach((tab) => {

        const seleccionada =
            tab.dataset.tab === modulo;

        tab.classList.toggle(
            "activa",
            seleccionada
        );

        tab.setAttribute(
            "aria-selected",
            seleccionada
                ? "true"
                : "false"
        );

    });


    switch (modulo) {

        case "fechas":

            if (
                typeof window.renderFechas ===
                "function"
            ) {

                window.renderFechas();

            } else {

                contenidoManager.innerHTML = `
                    <div class="sin-registros">

                        <h3>
                            No se pudo cargar Fechas
                        </h3>

                        <p>
                            Revisa la ruta del archivo fechas.js.
                        </p>

                    </div>
                `;

                console.error(
                    "renderFechas no está disponible."
                );

            }

            break;


        case "zonas":

            contenidoManager.innerHTML = `
                <div class="header-modulo">

                    <div>

                        <h3>
                            🪑 Zonas
                        </h3>

                        <p>
                            Administra las zonas y secciones
                            de esta edición.
                        </p>

                    </div>

                    <button
                        type="button"
                        class="btn-principal"
                        id="btnNuevaZona"
                    >
                        ＋ Nueva zona
                    </button>

                </div>

                <div class="sin-registros">

                    <p>
                        El módulo de zonas se conectará
                        a Firestore en el siguiente paso.
                    </p>

                </div>
            `;

            break;


        case "fanprojects":

            contenidoManager.innerHTML = `
                <div class="header-modulo">

                    <div>

                        <h3>
                            🌈 Fan Projects
                        </h3>

                        <p>
                            Administra los fan projects
                            de esta edición.
                        </p>

                    </div>

                    <button
                        type="button"
                        class="btn-principal"
                        id="btnNuevoFanProject"
                    >
                        ＋ Nuevo Fan Project
                    </button>

                </div>

                <div class="sin-registros">

                    <p>
                        El módulo de fan projects se conectará
                        después de Fechas y Zonas.
                    </p>

                </div>
            `;

            break;


        case "informacion":

            mostrarInformacionEvento();

            break;


        default:

            contenidoManager.innerHTML = `
                <div class="sin-registros">

                    <p>
                        Módulo no disponible.
                    </p>

                </div>
            `;

    }

}


/* =========================================
   INFORMACIÓN DEL EVENTO
========================================= */

function mostrarInformacionEvento() {

    const evento =
        eventos.find(
            (item) =>
                item.id === eventoSeleccionadoId
        );

    if (!evento) {

        contenidoManager.innerHTML = `
            <div class="sin-registros">

                <p>
                    No se encontró la información
                    del evento.
                </p>

            </div>
        `;

        return;

    }

    contenidoManager.innerHTML = `
        <h3>
            ⚙ Información
        </h3>

        <div class="informacion-evento">

            <p>
                <strong>Nombre:</strong>
                ${evento.nombre || "Sin nombre"}
            </p>

            <p>
                <strong>Año:</strong>
                ${evento.anio || "Sin definir"}
            </p>

            <p>
                <strong>Ciudad:</strong>
                ${evento.ciudad || "Sin definir"}
            </p>

            <p>
                <strong>País:</strong>
                ${evento.pais || "Sin definir"}
            </p>

            <p>
                <strong>Estado:</strong>
                ${
                    evento.activo === true
                        ? "Activo"
                        : "Inactivo"
                }
            </p>

        </div>
    `;

}


/* =========================================
   ABRIR DESDE LA LISTA
========================================= */

document.addEventListener(
    "click",
    (event) => {

        const botonAbrir =
            event.target.closest(
                ".abrirEvento"
            );

        if (!botonAbrir) {
            return;
        }

        abrirEvento(
            botonAbrir.dataset.id
        );

    }
);


/* =========================================
   VOLVER A EVENTOS
========================================= */

volverEventos.addEventListener(
    "click",
    () => {

        eventoSeleccionadoId =
            null;

        vistaEvento.hidden =
            true;

        colorHome.hidden =
            false;

        contenidoManager.innerHTML =
            "";

    }
);


/* =========================================
   CAMBIAR DE PESTAÑA
========================================= */

tabs.forEach((tab) => {

    tab.addEventListener(
        "click",
        () => {

            if (!eventoSeleccionadoId) {
                return;
            }

            mostrarModulo(
                tab.dataset.tab
            );

        }
    );

});


/* =========================================
   INICIO
========================================= */

cargarEventos();
