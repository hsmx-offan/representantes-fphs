let modal;
let imagen;
let nombre;
let instagram;
let estado;
let mensaje;
let fecha;
let zona;
let cantidad;

let botonCerrar;
let fondo;

let recuerdoActual = null;
let indiceFoto = 0;


export function iniciarModalRecuerdo() {

    modal =
        document.getElementById(
            "modalRecuerdo"
        );

    if (!modal) return;

    imagen =
        document.getElementById(
            "modalRecuerdoImagen"
        );

    nombre =
        document.getElementById(
            "modalRecuerdoNombre"
        );

    instagram =
        document.getElementById(
            "modalRecuerdoInstagram"
        );

    estado =
        document.getElementById(
            "modalRecuerdoEstado"
        );

    mensaje =
        document.getElementById(
            "modalRecuerdoMensaje"
        );

    fecha =
        document.getElementById(
            "modalRecuerdoFecha"
        );

    zona =
        document.getElementById(
            "modalRecuerdoZona"
        );

    cantidad =
        document.getElementById(
            "modalRecuerdoCantidad"
        );

    botonCerrar =
        document.getElementById(
            "cerrarModalRecuerdo"
        );

    fondo =
        modal.querySelector(
            "[data-cerrar-modal]"
        );

    botonCerrar?.addEventListener(
        "click",
        cerrarModalRecuerdo
    );

    fondo?.addEventListener(
        "click",
        cerrarModalRecuerdo
    );

    document.addEventListener(
        "keydown",
        evento => {

            if (
                evento.key === "Escape"
            ) {

                cerrarModalRecuerdo();

            }

        }
    );

}


export function abrirModalRecuerdo(
    recuerdo
) {

    recuerdoActual =
        recuerdo;

    indiceFoto = 0;

    nombre.textContent =
        recuerdo.nombre || "Sin nombre";

    instagram.textContent =
        recuerdo.instagram
            ? "@" + recuerdo.instagram.replace(/^@/, "")
            : "Sin Instagram";

    mensaje.textContent =
        recuerdo.mensaje || "Sin mensaje";

    fecha.textContent =
        recuerdo.fechaConcierto || "-";

    zona.textContent =
        recuerdo.zona || "-";

    cantidad.textContent =
        Array.isArray(recuerdo.fotos)
            ? recuerdo.fotos.length
            : 0;

    estado.textContent =
        recuerdo.estado;

    actualizarFoto();

    modal.classList.add(
        "abierto"
    );

    document.body.classList.add(
        "modal-abierto"
    );

}


function actualizarFoto() {

    const fotos =
        Array.isArray(
            recuerdoActual.fotos
        )
            ? recuerdoActual.fotos
            : [];

    if (!fotos.length) {

        imagen.removeAttribute(
            "src"
        );

        return;

    }

    imagen.src =
        fotos[indiceFoto].url;

}


export function cerrarModalRecuerdo() {

    modal.classList.remove(
        "abierto"
    );

    document.body.classList.remove(
        "modal-abierto"
    );

}
