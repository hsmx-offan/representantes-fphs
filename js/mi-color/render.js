/* ========================================
   MI COLOR
   RENDER
   ======================================== */

import {
  obtenerColorPorId
} from "../../admin/js/modulos/color-manager/shared/colores.js";


// ========================================
// LLENAR SELECT
// ========================================

export function llenarSelect(
  select,
  datos,
  texto,
  valor = "id",
  etiqueta = "nombre"
) {

  select.innerHTML =
    "";


  const opcionInicial =
    document.createElement(
      "option"
    );


  opcionInicial.value =
    "";

  opcionInicial.textContent =
    texto;


  select.appendChild(
    opcionInicial
  );


  for (
    const item
    of datos
  ) {

    const opcion =
      document.createElement(
        "option"
      );


    opcion.value =
      item[valor];

    opcion.textContent =
      item[etiqueta];


    select.appendChild(
      opcion
    );

  }


  select.disabled =
    false;

}


// ========================================
// MOSTRAR COLOR
// ========================================

export function mostrarColor({

  resultado,

  sinColor,

  contenido,

  nombre,

  cancionResultado,

  zonaResultado,

  color,

  cancion,

  zona

}) {

  if (
    !color ||
    color.activo === false
  ) {

    resultado.hidden =
      true;

    contenido.hidden =
      false;

    sinColor.hidden =
      false;

    document.body.style.overflow =
      "";

    return;

  }


  const datosColor =
    obtenerColorPorId(
      color.colorId
    );


  if (
    !datosColor
  ) {

    resultado.hidden =
      true;

    contenido.hidden =
      false;

    sinColor.hidden =
      false;

    document.body.style.overflow =
      "";

    return;

  }


  sinColor.hidden =
    true;

  contenido.hidden =
    true;

  resultado.hidden =
    false;


  resultado.style.background =
    datosColor.hex;


  cancionResultado.textContent =
    `🎵 ${cancion}`;


  nombre.textContent =
    datosColor.nombre;


  zonaResultado.textContent =
    `📍 ${zona}`;


  document.body.style.overflow =
    "hidden";


  if (
    "vibrate" in navigator
  ) {

    navigator.vibrate(
      45
    );

  }

}


// ========================================
// LIMPIAR RESULTADO
// ========================================

export function limpiarResultado({

  resultado,

  sinColor,

  contenido

}) {

  resultado.hidden =
    true;

  sinColor.hidden =
    true;


  if (
    contenido
  ) {

    contenido.hidden =
      false;

  }


  document.body.style.overflow =
    "";

}


// ========================================
// CERRAR PANTALLA DE COLOR
// ========================================

export function cerrarPantallaColor({

  resultado,

  contenido

}) {

  resultado.hidden =
    true;

  contenido.hidden =
    false;

  document.body.style.overflow =
    "";

}


// ========================================
// CARGANDO
// ========================================

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


// ========================================
// ERROR
// ========================================

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


// ========================================
// CONTENIDO
// ========================================

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
