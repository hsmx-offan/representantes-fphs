/* ========================================
   MI COLOR
   RENDER
   ======================================== */

import {

    obtenerColorPorId

} from "../modulos/color-manager/shared/colores.js";


/* ========================================
   LLENAR SELECT
   ======================================== */

export function llenarSelect(

    select,

    datos,

    texto,

    valor = "id",

    etiqueta = "nombre"

) {

    select.innerHTML = "";

    const opcionInicial =
        document.createElement(
            "option"
        );

    opcionInicial.value = "";

    opcionInicial.textContent =
        texto;

    select.appendChild(
        opcionInicial
    );

    datos.forEach(

        item => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                item[valor];

            option.textContent =
                item[etiqueta];

            select.appendChild(
                option
            );

        }

    );

    select.disabled =
        false;

}


/* ========================================
   MOSTRAR COLOR
   ======================================== */

export function mostrarColor({

    resultado,

    sinColor,

    muestra,

    nombre,

    detalle,

    color

}) {

    if (
        !color
    ) {

        resultado.hidden =
            true;

        sinColor.hidden =
            false;

        return;

    }

    const datos =
        obtenerColorPorId(
            color.colorId
        );

    if (
        !datos
    ) {

        resultado.hidden =
            true;

        sinColor.hidden =
            false;

        return;

    }

    sinColor.hidden =
        true;

    resultado.hidden =
        false;

    muestra.style.background =
        datos.hex;

    nombre.textContent =
        datos.nombre;

    detalle.textContent =
        "Color asignado para tu zona.";

}


/* ========================================
   LIMPIAR RESULTADO
   ======================================== */

export function limpiarResultado({

    resultado,

    sinColor

}) {

    resultado.hidden =
        true;

    sinColor.hidden =
        true;

}


/* ========================================
   CARGANDO
   ======================================== */

export function mostrarCarga({

    cargando,

    contenido,

    error

}) {

    cargando.hidden =
        false;

    contenido.hidden =
        true;

    error.hidden =
        true;

}


/* ========================================
   ERROR
   ======================================== */

export function mostrarError({

    cargando,

    contenido,

    error,

    mensaje,

    textoError

}) {

    cargando.hidden =
        true;

    contenido.hidden =
        true;

    error.hidden =
        false;

    textoError.textContent =
        mensaje;

}


/* ========================================
   CONTENIDO
   ======================================== */

export function mostrarContenido({

    cargando,

    contenido,

    error

}) {

    cargando.hidden =
        true;

    contenido.hidden =
        false;

    error.hidden =
        true;

}
