const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmA9mpebsNjPcTYMsklHNKShcPVEdU_xTkn-oHVjqil9SP1KrjPO8V1lEqxqnY-dna2IJY0BOUvg-/pub?gid=77234656&single=true&output=csv";

const parametros = new URLSearchParams(window.location.search);
const idBuscado = parametros.get("id");
const resultado = document.getElementById("resultado");

function volver() {
    window.location.href = "index.html";
}

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
        } else if (caracter === "," && !dentroComillas) {
            fila.push(campo);
            campo = "";
        } else if (
            (caracter === "\n" || caracter === "\r") &&
            !dentroComillas
        ) {
            if (caracter === "\r" && texto[i + 1] === "\n") {
                i++;
            }

            fila.push(campo);

            if (fila.some(valor => valor.trim() !== "")) {
                filas.push(fila);
            }

            fila = [];
            campo = "";
        } else {
            campo += caracter;
        }
    }

    fila.push(campo);

    if (fila.some(valor => valor.trim() !== "")) {
        filas.push(fila);
    }

    return filas;
}

async function cargarRepresentante() {
    if (!idBuscado) {
        resultado.innerHTML = `
            <h2>No se ingresó ningún ID</h2>
            <p>Regresa e intenta nuevamente.</p>
        `;
        return;
    }

    try {
        const respuesta = await fetch(SHEET_URL);

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar la hoja.");
        }

        const csv = await respuesta.text();
        const filas = parseCSV(csv);

        /*
        Según tu hoja:

        A = ID
        B = FECHA
        C = ZONA
        D = NOMBRE
        E = USUARIO IG
        */

        const representante = filas.find((fila) =>
            fila[0] &&
            fila[0].trim().toUpperCase() === idBuscado.trim().toUpperCase()
        );

        if (!representante) {
            resultado.innerHTML = `
                <h2>Representante no encontrado</h2>

                <p>
                    No encontramos el ID
                    <strong>${idBuscado}</strong>.
                </p>

                <p>
                    Verifica que esté escrito correctamente.
                </p>
            `;

            return;
        }

        const id = representante[0] || "—";
        const fecha = representante[1] || "—";
        const zona = representante[2] || "—";
        const nombre = representante[3] || "—";
        const instagram = representante[4] || "—";

        resultado.innerHTML = `
            <div class="ficha-representante">

                <h2>${nombre}</h2>

                <div class="dato">
                    <span>ID</span>
                    <strong>${id}</strong>
                </div>

                <div class="dato">
                    <span>Zona</span>
                    <strong>${zona}</strong>
                </div>

                <div class="dato">
                    <span>Fecha</span>
                    <strong>${fecha}</strong>
                </div>

               <div class="dato">
    <span>Instagram</span>
    <a
        class="instagram"
        href="https://www.instagram.com/${instagram.replace("@", "").trim()}/"
        target="_blank"
        rel="noopener noreferrer"
    >
        ${instagram}
    </a>
</div>

            </div>
        `;

    } catch (error) {

        console.error(error);

        resultado.innerHTML = `
            <h2>Ups 😭</h2>

            <p>
                No pudimos consultar la información en este momento.
            </p>

            <p>
                Intenta nuevamente más tarde.
            </p>
        `;
    }
}

cargarRepresentante();
