const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmA9mpebsNjPcTYMsklHNKShcPVEdU_xTkn-oHVjqil9SP1KrjPO8V1lEqxqnY-dna2IJY0BOUvg-/pub?gid=77234656&single=true&output=csv";

const parametros = new URLSearchParams(window.location.search);
const idBuscado = parametros.get("id");
const resultado = document.getElementById("resultado");


function volver() {
    window.location.href = "index.html";
}


/* =========================================================
   LEER CSV
   ========================================================= */

function parseCSV(texto) {

    const filas = [];

    let fila = [];
    let campo = "";
    let dentroComillas = false;

    for (let i = 0; i < texto.length; i++) {

        const caracter = texto[i];

        if (caracter === '"') {

            if (dentroComillas && texto[i + 1] === '"') {
                campo += '"';
                i++;
            } else {
                dentroComillas = !dentroComillas;
            }

        } else if (
            caracter === "," &&
            !dentroComillas
        ) {

            fila.push(campo);
            campo = "";

        } else if (
            (caracter === "\n" || caracter === "\r") &&
            !dentroComillas
        ) {

            if (
                caracter === "\r" &&
                texto[i + 1] === "\n"
            ) {
                i++;
            }

            fila.push(campo);

            if (
                fila.some(
                    valor => valor.trim() !== ""
                )
            ) {
                filas.push(fila);
            }

            fila = [];
            campo = "";

        } else {

            campo += caracter;

        }
    }

    fila.push(campo);

    if (
        fila.some(
            valor => valor.trim() !== ""
        )
    ) {
        filas.push(fila);
    }

    return filas;
}


/* =========================================================
   ESCAPAR TEXTO
   ========================================================= */

function escaparHTML(texto) {

    return String(texto ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   CARGAR REPRESENTANTE
   ========================================================= */

async function cargarRepresentante() {

    if (!idBuscado) {

        resultado.innerHTML = `
            <h2>No se ingresó ningún ID</h2>

            <p>
                Regresa e intenta nuevamente.
            </p>
        `;

        return;
    }


    try {

        const respuesta = await fetch(SHEET_URL);

        if (!respuesta.ok) {
            throw new Error(
                "No se pudo consultar la hoja."
            );
        }


        const csv = await respuesta.text();

        const filas = parseCSV(csv);


        /*
        ESTRUCTURA DE LA HOJA:

        A = ID
        B = FECHA
        C = ZONA
        D = NOMBRE
        E = USUARIO IG
        */


        /* =================================================
           BUSCAR TODAS LAS FILAS DEL MISMO ID
           ================================================= */

        const coincidencias = filas.filter((fila) =>

            fila[0] &&

            fila[0]
                .trim()
                .toUpperCase() ===

            idBuscado
                .trim()
                .toUpperCase()

        );


        /* =================================================
           ID NO ENCONTRADO
           ================================================= */

        if (coincidencias.length === 0) {

            resultado.innerHTML = `
                <h2>Representante no encontrado</h2>

                <p>
                    No encontramos el ID
                    <strong>${escaparHTML(idBuscado)}</strong>.
                </p>

                <p>
                    Verifica que esté escrito correctamente.
                </p>
            `;

            return;
        }


        /* =================================================
           DATOS PRINCIPALES
           ================================================= */

        const primeraFila = coincidencias[0];

        const id =
            primeraFila[0] || "—";

        const nombre =
            primeraFila[3] || "—";

        const instagram =
            primeraFila[4] || "—";


        /* =================================================
           CREAR ASIGNACIONES
           ================================================= */

        /*
        Evitamos mostrar dos veces exactamente la misma
        combinación de fecha + zona.
        */

        const asignacionesUnicas = [];

        const registrosVistos = new Set();


        coincidencias.forEach((fila) => {

            const fecha =
                (fila[1] || "—").trim();

            const zona =
                (fila[2] || "—").trim();

            const clave =
                `${fecha.toUpperCase()}|${zona.toUpperCase()}`;


            if (!registrosVistos.has(clave)) {

                registrosVistos.add(clave);

                asignacionesUnicas.push({
                    fecha,
                    zona
                });
            }

        });


        /* =================================================
           TÍTULO SINGULAR / PLURAL
           ================================================= */

        const tituloAsignaciones =
            asignacionesUnicas.length === 1
                ? "FECHA ASIGNADA"
                : `FECHAS ASIGNADAS · ${asignacionesUnicas.length}`;


        /* =================================================
           CREAR TARJETAS
           ================================================= */

        const tarjetasAsignaciones =
            asignacionesUnicas
                .map((asignacion) => `

                    <div class="asignacion-card">

                        <span class="asignacion-fecha">
                            ${escaparHTML(asignacion.fecha)}
                        </span>

                        <span class="asignacion-zona-label">
                            ZONA
                        </span>

                        <strong class="asignacion-zona">
                            ${escaparHTML(asignacion.zona)}
                        </strong>

                    </div>

                `)
                .join("");


        /* =================================================
           INSTAGRAM
           ================================================= */

        const usuarioInstagram =
            instagram
                .replace("@", "")
                .trim();


        /* =================================================
           MOSTRAR FICHA
           ================================================= */

        resultado.innerHTML = `

            <div class="ficha-representante">

                <div class="verificado">
                    ♡ REPRESENTANTE OFICIAL · FAN PROJECT 2026
                </div>


                <h2>
                    ${escaparHTML(nombre)}
                </h2>


                <div class="datos-principales">

                    <div class="dato-principal">

                        <span>ID</span>

                        <strong>
                            ${escaparHTML(id)}
                        </strong>

                    </div>


                    <div class="dato-principal">

                        <span>INSTAGRAM</span>

                        <a
                            class="instagram"
                            href="https://www.instagram.com/${encodeURIComponent(usuarioInstagram)}/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ${escaparHTML(instagram)}
                        </a>

                    </div>

                </div>


                <div class="asignaciones">

                    <h3 class="titulo-asignaciones">
                        ${tituloAsignaciones}
                    </h3>

                    <div class="asignaciones-grid">
                        ${tarjetasAsignaciones}
                    </div>

                </div>

            </div>
        `;


    } catch (error) {

        console.error(error);

        resultado.innerHTML = `
            <h2>Ups 😭</h2>

            <p>
                No pudimos consultar la información
                en este momento.
            </p>

            <p>
                Intenta nuevamente más tarde.
            </p>
        `;
    }
}


cargarRepresentante();
