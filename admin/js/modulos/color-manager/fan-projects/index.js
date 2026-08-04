/* ========================================
   COLOR MANAGER
   MÓDULO FAN PROJECTS
   ======================================== */

import {
  listarFanProjects,
  guardarFanProject,
  eliminarFanProject
} from "./api.js";

import {
  abrirModalCompartido,
  cerrarModalCompartido,
  bloquearModalCompartido,
  cambiarTextoGuardar
} from "../shared/modal.js";

import {
  crearVistaFanProjects,
  mostrarCargaFanProjects,
  mostrarErrorFanProjects,
  renderizarFanProjects
} from "./render.js";

import {
  crearFormularioFanProject,
  activarSlugAutomatico,
  obtenerDatosFanProject,
  validarDatosFanProject
} from "./formulario.js";


// ========================================
// ESTADO
// ========================================

const estadoFanProjects = {

  eventoId:
    null,

  contenedor:
    null,

  lista:
    null,

  botonNuevo:
    null,

  fanProjects:
    [],

  fanProjectEditando:
    null,

  cargando:
    false,

  guardando:
    false,

  eliminando:
    false,

  mostrarToast:
    mensaje => {

      console.log(
        mensaje
      );

    },

  alAbrirColores:
    null

};


// ========================================
// CARGAR FAN PROJECTS
// ========================================

async function cargarFanProjects() {

  if (
    estadoFanProjects.cargando
  ) {

    return;

  }


  estadoFanProjects.cargando =
    true;


  mostrarCargaFanProjects(
    estadoFanProjects.lista
  );


  try {

    estadoFanProjects.fanProjects =
      await listarFanProjects(
        estadoFanProjects.eventoId
      );


    pintarFanProjects();

  }

  catch (error) {

    console.error(
      "Error cargando Fan Projects:",
      error
    );


    mostrarErrorFanProjects(
      estadoFanProjects.lista
    );


    estadoFanProjects.mostrarToast(
      "No se pudieron cargar los Fan Projects"
    );

  }

  finally {

    estadoFanProjects.cargando =
      false;

  }

}


// ========================================
// PINTAR FAN PROJECTS
// ========================================

function pintarFanProjects() {

  renderizarFanProjects({

    lista:
      estadoFanProjects.lista,

    fanProjects:
      estadoFanProjects.fanProjects,

    alEditar:
      abrirModalEditarFanProject,

    alEliminar:
      procesarEliminacion,

    alAbrirColores:
      abrirColoresFanProject

  });

}


// ========================================
// ABRIR NUEVO FAN PROJECT
// ========================================

function abrirModalNuevoFanProject() {

  estadoFanProjects.fanProjectEditando =
    null;


  abrirModalFanProject({

    nombre:
      "",

    slug:
      "",

    orden:
      estadoFanProjects.fanProjects.length + 1,

    icono:
      "",

    descripcion:
      "",

    activo:
      true

  });

}


// ========================================
// ABRIR EDICIÓN
// ========================================

function abrirModalEditarFanProject(
  fanProject
) {

  estadoFanProjects.fanProjectEditando =
    fanProject;


  abrirModalFanProject(
    fanProject
  );

}


// ========================================
// ABRIR MODAL
// ========================================

function abrirModalFanProject(
  fanProject
) {

  const esEdicion =
    Boolean(
      estadoFanProjects.fanProjectEditando
    );


  const resultadoModal =
    abrirModalCompartido({

      titulo:
        esEdicion
          ? "Editar Fan Project"
          : "Nuevo Fan Project",

      contenido:
        crearFormularioFanProject(
          fanProject
        ),

      textoGuardar:
        esEdicion
          ? "Guardar cambios"
          : "Guardar Fan Project",

      selectorFocus:
        "#nombreFanProject",

      alCerrar:
        () => {

          estadoFanProjects.fanProjectEditando =
            null;

        },

      alGuardar:
        async ({
          formulario
        }) => {

          await guardarFormularioFanProject({

            formulario,

            esEdicion

          });

        }

    });


  activarSlugAutomatico(
    resultadoModal.formulario,
    esEdicion
  );

}


// ========================================
// GUARDAR FAN PROJECT
// ========================================

async function guardarFormularioFanProject({

  formulario,

  esEdicion

}) {

  if (
    estadoFanProjects.guardando
  ) {

    return;

  }


  const datos =
    obtenerDatosFanProject(
      formulario
    );


  try {

    validarDatosFanProject(
      datos
    );

  }

  catch (error) {

    estadoFanProjects.mostrarToast(
      error.message
    );

    return;

  }


  const idAnterior =
    estadoFanProjects
      .fanProjectEditando
      ?.id ||
    null;


  const nuevoId =
    datos.slug;


  const fanProjectDuplicado =
    estadoFanProjects.fanProjects.some(
      fanProject =>
        fanProject.id === nuevoId &&
        fanProject.id !== idAnterior
    );


  if (
    fanProjectDuplicado
  ) {

    estadoFanProjects.mostrarToast(
      "Ya existe un Fan Project con ese ID"
    );

    return;

  }


  estadoFanProjects.guardando =
    true;


  bloquearModalCompartido(
    true
  );


  cambiarTextoGuardar(
    esEdicion
      ? "Guardando cambios..."
      : "Guardando..."
  );


  try {

    const datosFirestore = {

      nombre:
        datos.nombre,

      slug:
        datos.slug,

      orden:
        datos.orden,

      icono:
        datos.icono,

      descripcion:
        datos.descripcion,

      activo:
        datos.activo

    };


    if (
      esEdicion &&
      idAnterior &&
      idAnterior !== nuevoId
    ) {

      await guardarFanProject({

        eventoId:
          estadoFanProjects.eventoId,

        fanProjectId:
          nuevoId,

        datos:
          datosFirestore,

        esNuevo:
          true

      });


      await eliminarFanProject({

        eventoId:
          estadoFanProjects.eventoId,

        fanProjectId:
          idAnterior

      });

    }

    else {

      await guardarFanProject({

        eventoId:
          estadoFanProjects.eventoId,

        fanProjectId:
          nuevoId,

        datos:
          datosFirestore,

        esNuevo:
          !esEdicion

      });

    }


    estadoFanProjects.mostrarToast(
      esEdicion
        ? "Fan Project actualizado"
        : "Fan Project creado"
    );


    bloquearModalCompartido(
      false
    );


    cerrarModalCompartido();


    estadoFanProjects.fanProjectEditando =
      null;


    await cargarFanProjects();

  }

  catch (error) {

    console.error(
      "Error guardando Fan Project:",
      error
    );


    estadoFanProjects.mostrarToast(
      error.message ||
      "No se pudo guardar el Fan Project"
    );

  }

  finally {

    estadoFanProjects.guardando =
      false;


    bloquearModalCompartido(
      false
    );


    cambiarTextoGuardar(
      esEdicion
        ? "Guardar cambios"
        : "Guardar Fan Project"
    );

  }

}


// ========================================
// ELIMINAR FAN PROJECT
// ========================================

async function procesarEliminacion(
  fanProject
) {

  if (
    estadoFanProjects.eliminando
  ) {

    return;

  }


  const confirmar =
    window.confirm(
      `¿Eliminar el Fan Project "${fanProject.nombre}"?`
    );


  if (
    !confirmar
  ) {

    return;

  }


  estadoFanProjects.eliminando =
    true;


  try {

    await eliminarFanProject({

      eventoId:
        estadoFanProjects.eventoId,

      fanProjectId:
        fanProject.id

    });


    estadoFanProjects.mostrarToast(
      "Fan Project eliminado"
    );


    await cargarFanProjects();

  }

  catch (error) {

    console.error(
      "Error eliminando Fan Project:",
      error
    );


    estadoFanProjects.mostrarToast(
      "No se pudo eliminar el Fan Project"
    );

  }

  finally {

    estadoFanProjects.eliminando =
      false;

  }

}


// ========================================
// ABRIR COLORES
// ========================================

function abrirColoresFanProject(
  fanProject
) {

  if (
    typeof estadoFanProjects.alAbrirColores ===
      "function"
  ) {

    estadoFanProjects.alAbrirColores(
      fanProject
    );

    return;

  }


  estadoFanProjects.mostrarToast(
    `Colores de ${fanProject.nombre}`
  );

}


// ========================================
// INICIAR MÓDULO
// ========================================

export async function renderFanProjects({

  eventoId,

  contenedor,

  mostrarToast,

  alAbrirColores

}) {

  if (
    !eventoId
  ) {

    throw new Error(
      "No se recibió el ID del evento."
    );

  }


  if (
    !contenedor
  ) {

    throw new Error(
      "No se recibió el contenedor de Fan Projects."
    );

  }


  estadoFanProjects.eventoId =
    eventoId;

  estadoFanProjects.contenedor =
    contenedor;

  estadoFanProjects.fanProjectEditando =
    null;


  if (
    typeof mostrarToast ===
    "function"
  ) {

    estadoFanProjects.mostrarToast =
      mostrarToast;

  }


  estadoFanProjects.alAbrirColores =
    typeof alAbrirColores ===
      "function"
      ? alAbrirColores
      : null;


  const vista =
    crearVistaFanProjects(
      contenedor
    );


  estadoFanProjects.lista =
    vista.lista;

  estadoFanProjects.botonNuevo =
    vista.botonNuevo;


  estadoFanProjects.botonNuevo.addEventListener(
    "click",
    abrirModalNuevoFanProject
  );


  await cargarFanProjects();

}
