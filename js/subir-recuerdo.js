import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    db
} from "../admin/js/shared/firebase.js";


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const CLOUD_NAME = "qol8atlh";
const UPLOAD_PRESET = "recuerdos_hsmx";

const MAX_FOTOS = 3;
const MAX_MB_POR_FOTO = 8;
const MAX_BYTES_POR_FOTO =
    MAX_MB_POR_FOTO * 1024 * 1024;

const TIPOS_PERMITIDOS = [
    "image/jpeg",
    "image/png",
    "image/webp"
];


/* =========================================================
   ELEMENTOS
   ========================================================= */

const form =
    document.getElementById("formRecuerdo");

const inputFotos =
    document.getElementById("fotos");

const vistaPrevia =
    document.getElementById("vistaPreviaFotos");

const mensaje =
    document.getElementById("mensaje");

const contadorMensaje =
    document.getElementById("contadorMensaje");

const botonEnviar =
    document.getElementById("botonEnviarRecuerdo");

const estadoEnvio =
    document.getElementById("estadoEnvio");

const formularioCard =
    document.querySelector(".recuerdo-formulario-card");

const mensajeExito =
    document.getElementById("mensajeExito");


/* =========================================================
   ESTADO LOCAL
   ========================================================= */

let fotosSeleccionadas = [];
let enviando = false;


/* =========================================================
   CONTADOR DEL MENSAJE
   ========================================================= */

if (mensaje && contadorMensaje) {

    mensaje.addEventListener("input", () => {

        contadorMensaje.textContent =
            `${mensaje.value.length} / 500`;

    });

}


/* =========================================================
   SELECCIÓN DE FOTOGRAFÍAS
   ========================================================= */

if (inputFotos) {

    inputFotos.addEventListener("change", () => {

        const nuevasFotos =
            Array.from(inputFotos.files || []);

        if (!nuevasFotos.length) {
            return;
        }

        const resultado =
            validarNuevasFotos(nuevasFotos);

        if (!resultado.valido) {

            mostrarEstado(
                resultado.mensaje,
                "error"
            );

            inputFotos.value = "";

            return;
        }

        fotosSeleccionadas = [
            ...fotosSeleccionadas,
            ...nuevasFotos
        ];

        inputFotos.value = "";

        mostrarEstado("");
        renderizarVistaPrevia();

    });

}


/* =========================================================
   VALIDACIÓN DE FOTOGRAFÍAS
   ========================================================= */

function validarNuevasFotos(nuevasFotos) {

    const total =
        fotosSeleccionadas.length +
        nuevasFotos.length;

    if (total > MAX_FOTOS) {

        return {
            valido: false,
            mensaje:
                `Puedes seleccionar un máximo de ${MAX_FOTOS} fotografías.`
        };

    }

    for (const foto of nuevasFotos) {

        if (!TIPOS_PERMITIDOS.includes(foto.type)) {

            return {
                valido: false,
                mensaje:
                    `El archivo "${foto.name}" no tiene un formato permitido.`
            };

        }

        if (foto.size > MAX_BYTES_POR_FOTO) {

            return {
                valido: false,
                mensaje:
                    `La fotografía "${foto.name}" supera los ${MAX_MB_POR_FOTO} MB.`
            };

        }

        const yaExiste =
            fotosSeleccionadas.some(
                existente =>
                    existente.name === foto.name &&
                    existente.size === foto.size &&
                    existente.lastModified ===
                        foto.lastModified
            );

        if (yaExiste) {

            return {
                valido: false,
                mensaje:
                    `La fotografía "${foto.name}" ya fue seleccionada.`
            };

        }

    }

    return {
        valido: true,
        mensaje: ""
    };

}


/* =========================================================
   VISTA PREVIA
   ========================================================= */

function renderizarVistaPrevia() {

    if (!vistaPrevia) return;

    vistaPrevia.innerHTML = "";

    fotosSeleccionadas.forEach(
        (foto, indice) => {

            const contenedor =
                document.createElement("div");

            contenedor.className =
                "foto-previa";

            const imagen =
                document.createElement("img");

            imagen.alt =
                `Vista previa de ${foto.name}`;

            const urlTemporal =
                URL.createObjectURL(foto);

            imagen.src = urlTemporal;

            imagen.addEventListener(
                "load",
                () => {
                    URL.revokeObjectURL(
                        urlTemporal
                    );
                },
                { once: true }
            );

            const botonEliminar =
                document.createElement("button");

            botonEliminar.type = "button";

            botonEliminar.setAttribute(
                "aria-label",
                `Eliminar ${foto.name}`
            );

            botonEliminar.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';

            botonEliminar.addEventListener(
                "click",
                () => {

                    fotosSeleccionadas.splice(
                        indice,
                        1
                    );

                    mostrarEstado("");
                    renderizarVistaPrevia();

                }
            );

            contenedor.append(
                imagen,
                botonEliminar
            );

            vistaPrevia.appendChild(
                contenedor
            );

        }
    );

}


/* =========================================================
   ENVÍO DEL FORMULARIO
   ========================================================= */

if (form) {

    form.addEventListener(
        "submit",
        async (evento) => {

            evento.preventDefault();

            if (enviando) return;

            if (!form.checkValidity()) {

                form.reportValidity();
                return;

            }

            if (
                fotosSeleccionadas.length < 1 ||
                fotosSeleccionadas.length > MAX_FOTOS
            ) {

                mostrarEstado(
                    "Selecciona entre 1 y 3 fotografías.",
                    "error"
                );

                return;

            }

            try {

                enviando = true;
                bloquearFormulario(true);

                mostrarEstado(
                    "Preparando tus fotografías..."
                );

                const fotosSubidas = [];

                for (
                    let indice = 0;
                    indice <
                        fotosSeleccionadas.length;
                    indice++
                ) {

                    mostrarEstado(
                        `Subiendo fotografía ${
                            indice + 1
                        } de ${
                            fotosSeleccionadas.length
                        }...`
                    );

                    const resultado =
                        await subirFotoCloudinary(
                            fotosSeleccionadas[
                                indice
                            ]
                        );

                    fotosSubidas.push(
                        resultado
                    );

                }

                mostrarEstado(
                    "Guardando tu recuerdo..."
                );

                const datos =
                    obtenerDatosFormulario();

                await addDoc(
                    collection(
                        db,
                        "recuerdos"
                    ),
                    {
                        nombre: datos.nombre,

                        instagram:
                            datos.instagram,

                        mensaje: datos.mensaje,

                        fechaConcierto:
                            datos.fechaConcierto,

                        zona: datos.zona,

                        fotos: fotosSubidas,

                        estado: "pendiente",

                        destacada: false,

                        fechaEnvio:
                            serverTimestamp(),

                        fechaRevision: null,

                        revisadoPor: "",

                        version: 1
                    }
                );

                mostrarExito();

            } catch (error) {

                console.error(
                    "Error al enviar el recuerdo:",
                    error
                );

                mostrarEstado(
                    obtenerMensajeError(error),
                    "error"
                );

            } finally {

                enviando = false;
                bloquearFormulario(false);

            }

        }
    );

}


/* =========================================================
   DATOS DEL FORMULARIO
   ========================================================= */

function obtenerDatosFormulario() {

    const nombre =
        document
            .getElementById("nombre")
            .value
            .trim();

    const instagram =
        document
            .getElementById("instagram")
            .value
            .trim()
            .replace(/^@+/, "");

    const fechaConcierto =
        document
            .getElementById(
                "fechaConcierto"
            )
            .value;

    const zona =
        document
            .getElementById("zona")
            .value
            .trim();

    const textoMensaje =
        mensaje.value.trim();

    return {
        nombre,
        instagram,
        fechaConcierto,
        zona,
        mensaje: textoMensaje
    };

}


/* =========================================================
   SUBIDA A CLOUDINARY
   ========================================================= */

async function subirFotoCloudinary(foto) {

    const endpoint =
        `https://api.cloudinary.com/v1_1/` +
        `${CLOUD_NAME}/image/upload`;

    const datos =
        new FormData();

    datos.append(
        "file",
        foto
    );

    datos.append(
        "upload_preset",
        UPLOAD_PRESET
    );

    const respuesta =
        await fetch(
            endpoint,
            {
                method: "POST",
                body: datos
            }
        );

    let resultado;

    try {

        resultado =
            await respuesta.json();

    } catch {

        throw new Error(
            "Cloudinary devolvió una respuesta inválida."
        );

    }

    if (!respuesta.ok) {

        const mensajeCloudinary =
            resultado?.error?.message;

        throw new Error(
            mensajeCloudinary ||
            "No fue posible subir una fotografía."
        );

    }

    if (
        !resultado.secure_url ||
        !resultado.public_id
    ) {

        throw new Error(
            "La fotografía se subió, pero faltan datos de Cloudinary."
        );

    }

    return {
        url: resultado.secure_url,

        publicId: resultado.public_id,

        ancho:
            Number(resultado.width) || null,

        alto:
            Number(resultado.height) || null,

        formato:
            resultado.format || "",

        bytes:
            Number(resultado.bytes) || 0
    };

}


/* =========================================================
   INTERFAZ DURANTE EL ENVÍO
   ========================================================= */

function bloquearFormulario(bloquear) {

    if (!form || !botonEnviar) return;

    const controles =
        form.querySelectorAll(
            "input, select, textarea, button"
        );

    controles.forEach(
        control => {

            control.disabled = bloquear;

        }
    );

    if (bloquear) {

        botonEnviar.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Enviando recuerdo...</span>
        `;

    } else {

        botonEnviar.innerHTML = `
            <span>Enviar recuerdo</span>
            <i class="fa-solid fa-arrow-right"></i>
        `;

    }

}


/* =========================================================
   MENSAJES
   ========================================================= */

function mostrarEstado(
    texto,
    tipo = ""
) {

    if (!estadoEnvio) return;

    estadoEnvio.textContent = texto;

    estadoEnvio.classList.remove(
        "error",
        "exito"
    );

    if (tipo) {
        estadoEnvio.classList.add(tipo);
    }

}


function obtenerMensajeError(error) {

    const mensajeError =
        String(
            error?.message || ""
        ).toLowerCase();

    if (
        mensajeError.includes(
            "missing or insufficient permissions"
        )
    ) {

        return (
            "Firestore rechazó el envío. " +
            "Todavía necesitamos configurar " +
            "las reglas de seguridad de Recuerdos."
        );

    }

    if (
        mensajeError.includes("failed to fetch") ||
        mensajeError.includes("network")
    ) {

        return (
            "No pudimos conectarnos. " +
            "Revisa tu conexión e inténtalo nuevamente."
        );

    }

    return (
        error?.message ||
        "Ocurrió un error al enviar tu recuerdo."
    );

}


/* =========================================================
   ÉXITO
   ========================================================= */

function mostrarExito() {

    mostrarEstado(
        "Recuerdo enviado correctamente.",
        "exito"
    );

    if (formularioCard) {
        formularioCard.hidden = true;
    }

    if (mensajeExito) {
        mensajeExito.hidden = false;
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}
