/* ========================================
   COLOR MANAGER
   CONTROLADOR DE EVENTOS
   ======================================== */

import {
  listarEventos,
  crearEvento,
  editarEvento,
  activarEvento,
  eliminarEvento
} from "./api.js";

import {
  mostrarCargaEventos,
  mostrarErrorEventos,
  renderizarEventos
} from "./render.js";

import {
  crearFormularioEvento,
  obtenerDatosEvento,
  validarDatosEvento,
  crearIdEvento
} from "./formulario.js";

import {
  abrirModalCompartido,
  cerrarModalCompartido,
  bloquearModalCompartido,
  cambiarTextoGuardar
} from "../shared/modal.js";


// ========================================
// ESTADO DEL MÓDULO
// ========================================

const estadoEventos = {

  eventos:
    [],

  cargando:
    false,

  guardando:
    false,

  eliminando:
    false,

  elementos:
    null,

  mostrarToast:
    mensaje => {
      console.log(
        mensaje
      );
    },

  alAbrirEvento:
    null

};


// ========================================
// OBTENER EVENTO POR ID
// ========================================

function obtenerEventoPorId(
  eventoId
) {

  return estadoEventos.eventos.find(
    evento =>
      evento.id === eventoId
  ) || null;

}


// ========================================
// OBTENER TODOS LOS EVENTOS
// ========================================

export function obtenerEventos() {

  return [
    ...estadoEventos.eventos
  ];

}


// ========================================
// CARGAR EVENTOS
// ========================================

export async function cargarEventos() {

  if (
    estadoEventos.cargando
  ) {

    return;

  }


  estadoEventos.cargando =
    true;


  mostrarCargaEventos({

    cargandoEventos:
      estadoEventos.elementos.cargandoEventos,

    sinEventos:
      estadoEventos.elementos.sinEventos,

    listaEventos:
      estadoEventos.elementos.listaEventos

  });


  try {

    estadoEventos.eventos =
      await listarEventos();


    renderizarEventos({

      eventos:
        estadoEventos.eventos,

      eventoActivo:
        estadoEventos.elementos.eventoActivo,

      cargandoEventos:
        estadoEventos.elementos.cargandoEventos,

      sinEventos:
        estadoEventos.elementos.sinEventos,

      listaEventos:
        estadoEventos.elementos.listaEventos

    });

  }

  catch (error) {

    console.error(
      "Error al cargar las ediciones:",
      error
    );


    mostrarErrorEventos({

      eventoActivo:
        estadoEventos.elementos.eventoActivo,

      cargandoEventos:
        estadoEventos.elementos.cargandoEventos,

      sinEventos:
        estadoEventos.elementos.sinEventos,

      listaEventos:
        estadoEventos.elementos.listaEventos

    });


    estadoEventos.mostrarToast(
      "No se pudieron cargar las ediciones"
    );

  }

  finally {

    estadoEventos.cargando =
      false;

  }

}


// ========================================
// CREAR ID ÚNICO
// ========================================

function obtenerIdDisponible(
  datos
) {

  const idBase =
    crearIdEvento(
      datos
    );


  const existe =
    estadoEventos.eventos.some(
      evento =>
        evento.id === idBase
    );


  if (
    !existe
  ) {

    return idBase;

  }


  return (
    `${idBase}-${Date.now()}`
  );

}


// ========================================
// ABRIR MODAL NUEVO
// ========================================

function abrirNuevoEvento() {

  abrirFormularioEvento({
    evento:
      null
  });

}


// ========================================
// ABRIR MODAL EDITAR
// ========================================

function abrirEditarEvento(
  eventoId
) {

  const evento =
    obtenerEventoPorId(
      eventoId
    );


  if (
    !evento
  ) {

    estadoEventos.mostrarToast(
      "No se encontró la edición"
    );

    return;

  }


  abrirFormularioEvento({
    evento
  });

}


// ========================================
// ABRIR FORMULARIO
// ========================================

function abrirFormularioEvento({
  evento
}) {

  const esEdicion =
    Boolean(
      evento
    );


  abrirModalCompartido({

    titulo:
      esEdicion
        ? "Editar edición"
        : "Crear nueva edición",

    contenido:
      crearFormularioEvento(
        evento || {}
      ),

    textoGuardar:
      esEdicion
        ? "Guardar cambios"
        : "Guardar edición",

    selectorFocus:
      "#nombreEventoModulo",

    alGuardar:
      async ({
        formulario
      }) => {

        await guardarFormularioEvento({

          formulario,

          eventoOriginal:
            evento,

          esEdicion

        });

      }

  });

}


// ========================================
// GUARDAR EVENTO
// ========================================

async function guardarFormularioEvento({

  formulario,

  eventoOriginal,

  esEdicion

}) {

  if (
    estadoEventos.guardando
  ) {

    return;

  }


  const datos =
    obtenerDatosEvento(
      formulario
    );


  try {

    validarDatosEvento(
      datos
    );

  }

  catch (error) {

    estadoEventos.mostrarToast(
      error.message
    );

    return;

  }


  estadoEventos.guardando =
    true;


  bloquearModalCompartido(
    true
  );


  cambiarTextoGuardar(
    esEdicion
      ? "Guardando cambios..."
      : "Creando edición..."
  );


  try {

    const eventoId =
      esEdicion
        ? eventoOriginal.id
        : obtenerIdDisponible(
            datos
          );


    if (
      esEdicion
    ) {

      await editarEvento({

        eventoId,

        datos

      });

    }

    else {

      await crearEvento({

        eventoId,

        datos

      });

    }


    if (
      datos.activo === true
    ) {

      await activarEvento({

        eventoId,

        eventos:
          estadoEventos.eventos

      });

    }


    estadoEventos.mostrarToast(
      esEdicion
        ? "Edición actualizada"
        : "Edición creada"
    );


    bloquearModalCompartido(
      false
    );

    cerrarModalCompartido();


    await cargarEventos();

  }

  catch (error) {

    console.error(
      "Error al guardar la edición:",
      error
    );


    estadoEventos.mostrarToast(
      error.message ||
      "No se pudo guardar la edición"
    );

  }

  finally {

    estadoEventos.guardando =
      false;


    bloquearModalCompartido(
      false
    );


    cambiarTextoGuardar(
      esEdicion
        ? "Guardar cambios"
        : "Guardar edición"
    );

  }

}


// ========================================
// ACTIVAR EDICIÓN
// ========================================

async function procesarActivacion(
  eventoId
) {

  const evento =
    obtenerEventoPorId(
      eventoId
    );


  if (
    !evento
  ) {

    return;

  }


  const confirmar =
    window.confirm(
      `¿Marcar "${evento.nombre}" como evento activo?`
    );


  if (
    !confirmar
  ) {

    return;

  }


  try {

    await activarEvento({

      eventoId,

      eventos:
        estadoEventos.eventos

    });


    estadoEventos.mostrarToast(
      "Evento activo actualizado"
    );


    await cargarEventos();

  }

  catch (error) {

    console.error(
      "Error al activar la edición:",
      error
    );


    estadoEventos.mostrarToast(
      "No se pudo activar la edición"
    );

  }

}


// ========================================
// ELIMINAR EDICIÓN
// ========================================

async function procesarEliminacion(
  eventoId
) {

  if (
    estadoEventos.eliminando
  ) {

    return;

  }


  const evento =
    obtenerEventoPorId(
      eventoId
    );


  if (
    !evento
  ) {

    return;

  }


  if (
    evento.activo === true
  ) {

    estadoEventos.mostrarToast(
      "No puedes eliminar el evento activo"
    );

    return;

  }


  const confirmar =
    window.confirm(
      `¿Eliminar definitivamente "${evento.nombre}"?`
    );


  if (
    !confirmar
  ) {

    return;

  }


  estadoEventos.eliminando =
    true;


  try {

    await eliminarEvento(
      eventoId
    );


    estadoEventos.mostrarToast(
      "Edición eliminada"
    );


    await cargarEventos();

  }

  catch (error) {

    console.error(
      "Error al eliminar la edición:",
      error
    );


    estadoEventos.mostrarToast(
      "No se pudo eliminar la edición"
    );

  }

  finally {

    estadoEventos.eliminando =
      false;

  }

}


// ========================================
// ABRIR CONFIGURACIÓN DEL EVENTO
// ========================================

function procesarApertura(
  eventoId
) {

  const evento =
    obtenerEventoPorId(
      eventoId
    );


  if (
    !evento
  ) {

    estadoEventos.mostrarToast(
      "No se encontró la edición"
    );

    return;

  }


  if (
    typeof estadoEventos.alAbrirEvento ===
      "function"
  ) {

    estadoEventos.alAbrirEvento(
      evento
    );

  }

}


// ========================================
// MANEJAR CLIC EN TARJETAS
// ========================================

function manejarClickEventos(
  evento
) {

  const boton =
    evento.target.closest(
      "button[data-id]"
    );


  if (
    !boton
  ) {

    return;

  }


  const eventoId =
    boton.dataset.id;


  if (
    boton.classList.contains(
      "abrir-evento"
    )
  ) {

    procesarApertura(
      eventoId
    );

    return;

  }


  if (
    boton.classList.contains(
      "editar-evento"
    )
  ) {

    abrirEditarEvento(
      eventoId
    );

    return;

  }


  if (
    boton.classList.contains(
      "activar-evento"
    )
  ) {

    procesarActivacion(
      eventoId
    );

    return;

  }


  if (
    boton.classList.contains(
      "eliminar-evento"
    )
  ) {

    procesarEliminacion(
      eventoId
    );

  }

}


// ========================================
// EDITAR EVENTO DESDE VISTA INTERNA
// ========================================

export function editarEventoSeleccionado(
  eventoId
) {

  abrirEditarEvento(
    eventoId
  );

}


// ========================================
// REGISTRAR EVENTOS
// ========================================

function registrarEventos() {

  estadoEventos.elementos.btnCrearEvento.addEventListener(
    "click",
    abrirNuevoEvento
  );


  estadoEventos.elementos.listaEventos.addEventListener(
    "click",
    manejarClickEventos
  );


  estadoEventos.elementos.eventoActivo.addEventListener(
    "click",
    manejarClickEventos
  );

}


// ========================================
// INICIAR MÓDULO
// ========================================

export async function iniciarEventos({

  elementos,

  mostrarToast,

  alAbrirEvento

}) {

  if (
    !elementos
  ) {

    throw new Error(
      "No se recibieron los elementos de Ediciones."
    );

  }


  estadoEventos.elementos =
    elementos;


  if (
    typeof mostrarToast ===
    "function"
  ) {

    estadoEventos.mostrarToast =
      mostrarToast;

  }


  if (
    typeof alAbrirEvento ===
    "function"
  ) {

    estadoEventos.alAbrirEvento =
      alAbrirEvento;

  }


  registrarEventos();


  await cargarEventos();

}
