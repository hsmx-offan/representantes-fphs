/* =========================================================
   MI COLOR
   Flujo:
   Fecha → Zona → Fan Project → Color
   ========================================================= */

/* =========================================================
   DATOS PROVISIONALES
   Después se reemplazarán por datos del panel/Firebase
   ========================================================= */

const eventoActual = {
    id: "hsmx-2026",
    nombre: "Together, Together Tour México 2026",

    fechas: [
        {
            id: "2026-07-31",
            nombre: "31 de julio",
            noche: "Noche 1"
        },
        {
            id: "2026-08-01",
            nombre: "1 de agosto",
            noche: "Noche 2"
        },
        {
            id: "2026-08-04",
            nombre: "4 de agosto",
            noche: "Noche 3"
        },
        {
            id: "2026-08-07",
            nombre: "7 de agosto",
            noche: "Noche 4"
        },
        {
            id: "2026-08-08",
            nombre: "8 de agosto",
            noche: "Noche 5"
        },
        {
            id: "2026-08-10",
            nombre: "10 de agosto",
            noche: "Noche 6"
        }
    ],

    zonas: [
        {
            id: "pits",
            nombre: "PITS"
        },
        {
            id: "general-a",
            nombre: "General A"
        },
        {
            id: "general-b",
            nombre: "General B"
        },
        {
            id: "general-c",
            nombre: "General C"
        },
        {
            id: "gnp",
            nombre: "GNP"
        },
        {
            id: "na",
            nombre: "NA"
        },
        {
            id: "ve",
            nombre: "VE"
        }
    ],

    fanProjects: [
        {
            id: "aperture",
            nombre: "Aperture",
            icono: "fa-solid fa-sun",
            descripcion: "Fan project visual por zonas"
        },
        {
            id: "coming-up-roses",
            nombre: "Coming Up Roses",
            icono: "fa-solid fa-seedling",
            descripcion: "Fan project con rosas"
        }
    ],

    colores: {
        aperture: {
            pits: "#F8F8F8",
            "general-a": "#F8F8F8",
            "general-b": "#F8F8F8",
            "general-c": "#4C75FF",
            gnp: "#9B5DE5",
            na: "#173F7A",
            ve: "#7A1832"
        },

        "coming-up-roses": {
            pits: "#F6A8C0",
            "general-a": "#F6A8C0",
            "general-b": "#F6A8C0",
            "general-c": "#ED1E62",
            gnp: "#FFF3F5",
            na: "#F6A8C0",
            ve: "#ED1E62"
        }
    }
};


/* =========================================================
   ESTADO ACTUAL
   ========================================================= */

const estadoMiColor = {
    fechaId: null,
    zonaId: null
};


/* =========================================================
   ELEMENTOS
   ========================================================= */

const pasoFecha = document.getElementById("pasoFecha");
const pasoZona = document.getElementById("pasoZona");
const pasoProyecto = document.getElementById("pasoProyecto");

const listaFechas = document.getElementById("listaFechas");
const listaZonas = document.getElementById("listaZonas");
const listaProyectos = document.getElementById("listaProyectos");

const resumenFecha = document.getElementById("resumenFecha");
const resumenZona = document.getElementById("resumenZona");

const editarSeleccion = document.getElementById("editarSeleccion");
const botonesRegresar = document.querySelectorAll("[data-regresar]");

const pantallaColor = document.getElementById("pantallaColor");
const colorProyecto = document.getElementById("colorProyecto");
const colorZona = document.getElementById("colorZona");
const colorFecha = document.getElementById("colorFecha");
const volverProyectos = document.getElementById("volverProyectos");

const mensajeMiColor = document.getElementById("mensajeMiColor");


/* =========================================================
   UTILIDADES
   ========================================================= */

function obtenerFecha(id) {
    return eventoActual.fechas.find(fecha => fecha.id === id);
}

function obtenerZona(id) {
    return eventoActual.zonas.find(zona => zona.id === id);
}

function obtenerProyecto(id) {
    return eventoActual.fanProjects.find(
        proyecto => proyecto.id === id
    );
}

function mostrarPaso(nombrePaso) {
    pasoFecha.hidden = nombrePaso !== "fecha";
    pasoZona.hidden = nombrePaso !== "zona";
    pasoProyecto.hidden = nombrePaso !== "proyecto";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function mostrarMensaje(texto) {
    mensajeMiColor.textContent = texto;
    mensajeMiColor.hidden = false;
}

function ocultarMensaje() {
    mensajeMiColor.hidden = true;
    mensajeMiColor.textContent = "";
}


/* =========================================================
   GUARDADO LOCAL
   ========================================================= */

function guardarSeleccion() {
    try {
        localStorage.setItem(
            "miColorSeleccion",
            JSON.stringify({
                eventoId: eventoActual.id,
                fechaId: estadoMiColor.fechaId,
                zonaId: estadoMiColor.zonaId
            })
        );
    } catch (error) {
        console.warn(
            "No se pudo guardar la selección:",
            error
        );
    }
}

function cargarSeleccionGuardada() {
    try {
        const guardado = localStorage.getItem(
            "miColorSeleccion"
        );

        if (!guardado) return false;

        const seleccion = JSON.parse(guardado);

        if (seleccion.eventoId !== eventoActual.id) {
            return false;
        }

        const fechaExiste = obtenerFecha(
            seleccion.fechaId
        );

        const zonaExiste = obtenerZona(
            seleccion.zonaId
        );

        if (!fechaExiste || !zonaExiste) {
            return false;
        }

        estadoMiColor.fechaId = seleccion.fechaId;
        estadoMiColor.zonaId = seleccion.zonaId;

        return true;

    } catch (error) {
        console.warn(
            "No se pudo recuperar la selección:",
            error
        );

        return false;
    }
}

function borrarSeleccionGuardada() {
    try {
        localStorage.removeItem("miColorSeleccion");
    } catch (error) {
        console.warn(
            "No se pudo borrar la selección:",
            error
        );
    }
}


/* =========================================================
   GENERAR FECHAS
   ========================================================= */

function renderizarFechas() {
    listaFechas.innerHTML = "";

    eventoActual.fechas.forEach((fecha) => {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "opcion-mi-color";

        boton.innerHTML = `
            <span>${fecha.noche}</span>
            <strong>${fecha.nombre}</strong>
            <small>Ciudad de México</small>
        `;

        boton.addEventListener("click", () => {
            ocultarMensaje();

            estadoMiColor.fechaId = fecha.id;
            estadoMiColor.zonaId = null;

            renderizarZonas();
            mostrarPaso("zona");
        });

        listaFechas.appendChild(boton);
    });
}


/* =========================================================
   GENERAR ZONAS
   ========================================================= */

function renderizarZonas() {
    listaZonas.innerHTML = "";

    eventoActual.zonas.forEach((zona) => {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "opcion-mi-color";

        boton.innerHTML = `
            <span>ZONA</span>
            <strong>${zona.nombre}</strong>
            <small>Toca para seleccionar</small>
        `;

        boton.addEventListener("click", () => {
            ocultarMensaje();

            estadoMiColor.zonaId = zona.id;

            guardarSeleccion();
            actualizarResumen();
            renderizarProyectos();
            mostrarPaso("proyecto");
        });

        listaZonas.appendChild(boton);
    });
}


/* =========================================================
   GENERAR FAN PROJECTS
   ========================================================= */

function renderizarProyectos() {
    listaProyectos.innerHTML = "";

    eventoActual.fanProjects.forEach((proyecto) => {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "proyecto-color-boton";

        boton.innerHTML = `
            <i class="${proyecto.icono}" aria-hidden="true"></i>

            <span>FAN PROJECT</span>

            <strong>${proyecto.nombre}</strong>

            <small>${proyecto.descripcion}</small>
        `;

        boton.addEventListener("click", () => {
            mostrarColor(proyecto.id);
        });

        listaProyectos.appendChild(boton);
    });
}


/* =========================================================
   RESUMEN
   ========================================================= */

function actualizarResumen() {
    const fecha = obtenerFecha(
        estadoMiColor.fechaId
    );

    const zona = obtenerZona(
        estadoMiColor.zonaId
    );

    resumenFecha.textContent =
        fecha ? fecha.nombre : "—";

    resumenZona.textContent =
        zona ? zona.nombre : "—";
}


/* =========================================================
   MOSTRAR COLOR
   ========================================================= */

function mostrarColor(proyectoId) {
    const fecha = obtenerFecha(
        estadoMiColor.fechaId
    );

    const zona = obtenerZona(
        estadoMiColor.zonaId
    );

    const proyecto = obtenerProyecto(
        proyectoId
    );

    if (!fecha || !zona || !proyecto) {
        mostrarMensaje(
            "No pudimos encontrar tu selección. Elige nuevamente tu fecha y zona."
        );

        mostrarPaso("fecha");
        return;
    }

    const coloresProyecto =
        eventoActual.colores[proyectoId];

    const color =
        coloresProyecto?.[zona.id];

    if (!color) {
        mostrarMensaje(
            "Todavía no hay un color configurado para esta combinación."
        );

        return;
    }

    pantallaColor.style.background = color;

    colorProyecto.textContent = proyecto.nombre;
    colorZona.textContent = zona.nombre;
    colorFecha.textContent = fecha.nombre;

    aplicarColorDeTexto(color);

    pantallaColor.hidden = false;
    document.body.style.overflow = "hidden";
}


/* =========================================================
   CONTRASTE DEL TEXTO
   ========================================================= */

function aplicarColorDeTexto(hex) {
    const limpio = hex.replace("#", "");

    const r = parseInt(limpio.substring(0, 2), 16);
    const g = parseInt(limpio.substring(2, 4), 16);
    const b = parseInt(limpio.substring(4, 6), 16);

    const luminosidad =
        (r * 299 + g * 587 + b * 114) / 1000;

    const textoOscuro = luminosidad > 160;

    pantallaColor.style.color =
        textoOscuro ? "#111111" : "#FFFFFF";

    volverProyectos.style.borderColor =
        textoOscuro
            ? "rgba(0, 0, 0, 0.20)"
            : "rgba(255, 255, 255, 0.35)";

    volverProyectos.style.background =
        textoOscuro
            ? "rgba(255, 255, 255, 0.35)"
            : "rgba(0, 0, 0, 0.18)";
}


/* =========================================================
   EVENTOS
   ========================================================= */

volverProyectos.addEventListener("click", () => {
    pantallaColor.hidden = true;
    document.body.style.overflow = "";
});

editarSeleccion.addEventListener("click", () => {
    estadoMiColor.fechaId = null;
    estadoMiColor.zonaId = null;

    borrarSeleccionGuardada();

    mostrarPaso("fecha");
});

botonesRegresar.forEach((boton) => {
    boton.addEventListener("click", () => {

        const destino = boton.dataset.regresar;

        if (destino === "fecha") {
            estadoMiColor.fechaId = null;
            estadoMiColor.zonaId = null;

            mostrarPaso("fecha");
        }
    });
});


/* =========================================================
   INICIO
   ========================================================= */

function iniciarMiColor() {
    renderizarFechas();

    const tieneSeleccion =
        cargarSeleccionGuardada();

    if (tieneSeleccion) {
        actualizarResumen();
        renderizarProyectos();
        mostrarPaso("proyecto");

        return;
    }

    mostrarPaso("fecha");
}

iniciarMiColor();
