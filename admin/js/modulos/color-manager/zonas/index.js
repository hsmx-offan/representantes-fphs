/* ========================================
   COLOR MANAGER
   MÓDULO ZONAS
   ======================================== */

import {
  listar,
  guardar,
  eliminar
} from "../shared/crud-manager.js";

import {
  abrirModalCompartido,
  cerrarModalCompartido,
  bloquearModalCompartido,
  cambiarTextoGuardar
} from "../shared/modal.js";

import {
  crearVistaZonas,
  mostrarCargaZonas,
  mostrarErrorZonas,
  renderizarZonas
} from "./render.js";

import {
  crearFormularioZona,
  activarSlugAutomatico,
  obtenerDatosZona,
  validarDatosZona
} from "./formulario.js";


// ========================================
// CONFIGURACIÓN
// ========================================

const SUBCOLECCION =
  "zonas";


// ========================================
// ESTADO
// ========================================

const estadoZonas = {

  eventoId:
    null,

  contenedor:
    null,

  lista:
    null,

  botonNueva:
    null,

  zonas:
    [],

  zonaEditando:
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

    }

};


// ========================================
// CARGAR ZONAS
// ========================================

async function cargarZonas() {

  if (
    estadoZonas.cargando
  ) {

    return;

  }


  estadoZonas.cargando =
    true;


  mostrarCargaZonas(
    estadoZonas.lista
  );


  try {

    estadoZonas.zonas =
      await listar({

        eventoId:
          estadoZonas.eventoId,

        subcoleccion:
          SUBCOLECCION,

        ordenarPor:
          "orden"

      });


    pintarZonas();

  }

  catch (error) {

    console.error(
      "Error cargando zonas:",
      error
    );


    mostrarErrorZonas(
      estadoZonas.lista
    );


    estadoZonas.mostrarToast(
      "No se pudieron cargar las zonas"
    );

  }

  finally {

    estadoZonas.cargando =
      false;

  }

}


// ========================================
// PINTAR ZONAS
// ========================================

function pintarZonas() {

  renderizarZonas({

    lista:
      estadoZonas.lista,

    zonas:
      estadoZonas.zonas,

    alEditar:
      abrirModalEditarZona,

    alEliminar:
      procesarEliminacion

  });

}


// ========================================
// ABRIR NUEVA ZONA
// ========================================

function abrirModalNuevaZona() {

  estadoZonas.zonaEditando =
    null;


  abrirModalZona({

    nombre:
      "",

    slug:
      "",

    orden:
      estadoZonas.zonas.length + 1,

    descripcion:
      "",

    activa:
      true

  });

}


// ========================================
// ABRIR EDICIÓN
// ========================================

function abrirModalEditarZona(
  zona
) {

  estadoZonas.zonaEditando =
    zona;


  abrirModalZona(
    zona
  );

}


// ========================================
// ABRIR MODAL
// ========================================

function abrirModalZona(
  zona
) {

  const esEdicion =
    Boolean(
      estadoZonas.zonaEditando
    );


  const resultadoModal =
    abrirModalCompartido({

      titulo:
        esEdicion
          ? "Editar zona"
          : "Nueva zona",

      contenido:
        crearFormularioZona(
          zona
        ),

      textoGuardar:
        esEdicion
          ? "Guardar cambios"
          : "Guardar zona",

      selectorFocus:
        "#nombreZona",

      alCerrar:
        () => {

          estadoZonas.zonaEditando =
            null;

        },

      alGuardar:
        async ({
          formulario
        }) => {

          await guardarZona({

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
// GUARDAR ZONA
// ========================================

async function guardarZona({

  formulario,

  esEdicion

}) {

  if (
    estadoZonas.guardando
  ) {

    return;

  }


  const datos =
    obtenerDatosZona(
      formulario
    );


  try {

    validarDatosZona(
      datos
    );

  }

  catch (error) {

    estadoZonas.mostrarToast(
      error.message
    );

    return;

  }


  const idAnterior =
    estadoZonas.zonaEditando?.id ||
    null;


  const nuevoId =
    datos.slug;


  const zonaDuplicada =
    estadoZonas.zonas.some(
      zona =>
        zona.id === nuevoId &&
        zona.id !== idAnterior
    );


  if (
    zonaDuplicada
  ) {

    estadoZonas.mostrarToast(
      "Ya existe una zona con ese ID"
    );

    return;

  }


  estadoZonas.guardando =
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

      descripcion:
        datos.descripcion,

      activa:
        datos.activa

    };


    if (
      esEdicion &&
      idAnterior &&
      idAnterior !== nuevoId
    ) {

      await guardar({

        eventoId:
          estadoZonas.eventoId,

        subcoleccion:
          SUBCOLECCION,

        id:
          nuevoId,

        datos:
          datosFirestore,

        esNuevo:
          true

      });


      await eliminar({

        eventoId:
          estadoZonas.eventoId,

        subcoleccion:
          SUBCOLECCION,

        id:
          idAnterior

      });

    }

    else {

      await guardar({

        eventoId:
          estadoZonas.eventoId,

        subcoleccion:
          SUBCOLECCION,

        id:
          nuevoId,

        datos:
          datosFirestore,

        esNuevo:
          !esEdicion

      });

    }


    estadoZonas.mostrarToast(
      esEdicion
        ? "Zona actualizada"
        : "Zona creada"
    );


    bloquearModalCompartido(
      false
    );


    cerrarModalCompartido();


    estadoZonas.zonaEditando =
      null;


    await cargarZonas();

  }

  catch (error) {

    console.error(
      "Error guardando zona:",
      error
    );


    estadoZonas.mostrarToast(
      error.message ||
      "No se pudo guardar la zona"
    );

  }

  finally {

    estadoZonas.guardando =
      false;


    bloquearModalCompartido(
      false
    );


    cambiarTextoGuardar(
      esEdicion
        ? "Guardar cambios"
        : "Guardar zona"
    );

  }

}


// ========================================
// ELIMINAR ZONA
// ========================================

async function procesarEliminacion(
  zona
) {

  if (
    estadoZonas.eliminando
  ) {

    return;

  }


  const confirmar =
    window.confirm(
      `¿Eliminar la zona "${zona.nombre}"?`
    );


  if (
    !confirmar
  ) {

    return;

  }


  estadoZonas.eliminando =
    true;


  try {

    await eliminar({

      eventoId:
        estadoZonas.eventoId,

      subcoleccion:
        SUBCOLECCION,

      id:
        zona.id

    });


    estadoZonas.mostrarToast(
      "Zona eliminada"
    );


    await cargarZonas();

  }

  catch (error) {

    console.error(
      "Error eliminando zona:",
      error
    );


    estadoZonas.mostrarToast(
      "No se pudo eliminar la zona"
    );

  }

  finally {

    estadoZonas.eliminando =
      false;

  }

}


// ========================================
// INICIAR MÓDULO
// ========================================

export async function renderZonas({

  eventoId,

  contenedor,

  mostrarToast

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
      "No se recibió el contenedor de Zonas."
    );

  }


  estadoZonas.eventoId =
    eventoId;

  estadoZonas.contenedor =
    contenedor;

  estadoZonas.zonaEditando =
    null;


  if (
    typeof mostrarToast ===
    "function"
  ) {

    estadoZonas.mostrarToast =
      mostrarToast;

  }


  const vista =
    crearVistaZonas(
      contenedor
    );


  estadoZonas.lista =
    vista.lista;

  estadoZonas.botonNueva =
    vista.botonNueva;


  estadoZonas.botonNueva.addEventListener(
    "click",
    abrirModalNuevaZona
  );


  await cargarZonas();

}
