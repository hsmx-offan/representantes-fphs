/* ========================================
   COLOR MANAGER
   COLORES POR FAN PROJECT
   ======================================== */

import {
  listar
} from "../../shared/crud-manager.js";

import {
  listarColores,
  guardarColores
} from "../colores-api.js";

import {
  crearVistaColores,
  mostrarCargaColores,
  mostrarErrorColores,
  renderizarColores,
  obtenerColoresFormulario
} from "./render.js";


// ========================================
// CONFIGURACIÓN
// ========================================

const SUBCOLECCION_ZONAS =
  "zonas";


// ========================================
// ESTADO
// ========================================

const estadoColores = {

  eventoId:
    null,

  fanProject:
    null,

  contenedor:
    null,

  lista:
    null,

  botonVolver:
    null,

  botonGuardar:
    null,

  zonas:
    [],

  colores:
    [],

  cargando:
    false,

  guardando:
    false,

  mostrarToast:
    mensaje => {

      console.log(
        mensaje
      );

    },

  alVolver:
    null

};


// ========================================
// CARGAR DATOS
// ========================================

async function cargarDatos() {

  if (
    estadoColores.cargando
  ) {

    return;

  }


  estadoColores.cargando =
    true;


  mostrarCargaColores(
    estadoColores.lista
  );


  try {

    const [
      zonas,
      colores
    ] =
      await Promise.all([

        listar({

          eventoId:
            estadoColores.eventoId,

          subcoleccion:
            SUBCOLECCION_ZONAS,

          ordenarPor:
            "orden"

        }),

        listarColores({

          eventoId:
            estadoColores.eventoId,

          fanProjectId:
            estadoColores.fanProject.id

        })

      ]);


    estadoColores.zonas =
      zonas.filter(
        zona =>
          zona.activa !== false
      );


    estadoColores.colores =
      colores;


    renderizarColores({

      lista:
        estadoColores.lista,

      zonas:
        estadoColores.zonas,

      coloresGuardados:
        estadoColores.colores

    });

  }

  catch (error) {

    console.error(
      "Error cargando colores:",
      error
    );


    mostrarErrorColores(
      estadoColores.lista
    );


    estadoColores.mostrarToast(
      "No se pudieron cargar los colores"
    );

  }

  finally {

    estadoColores.cargando =
      false;

  }

}


// ========================================
// GUARDAR CONFIGURACIÓN
// ========================================

async function procesarGuardado() {

  if (
    estadoColores.guardando
  ) {

    return;

  }


  const colores =
    obtenerColoresFormulario(
      estadoColores.lista
    );


  const sinAsignar =
    colores.filter(
      color =>
        color.activo === true &&
        !color.colorId
    );


  if (
    sinAsignar.length > 0
  ) {

    const confirmar =
      window.confirm(
        `Hay ${sinAsignar.length} zona(s) activas sin color asignado. ¿Deseas guardar de todos modos?`
      );


    if (
      !confirmar
    ) {

      return;

    }

  }


  estadoColores.guardando =
    true;


  estadoColores.botonGuardar.disabled =
    true;

  estadoColores.botonVolver.disabled =
    true;

  estadoColores.botonGuardar.textContent =
    "Guardando...";


  try {

    await guardarColores({

      eventoId:
        estadoColores.eventoId,

      fanProjectId:
        estadoColores.fanProject.id,

      colores

    });


    estadoColores.colores =
      colores;


    estadoColores.mostrarToast(
      "Colores guardados"
    );


    estadoColores.botonGuardar.textContent =
      "Cambios guardados";


    setTimeout(
      () => {

        if (
          estadoColores.botonGuardar
        ) {

          estadoColores.botonGuardar.textContent =
            "Guardar colores";

        }

      },
      1400
    );

  }

  catch (error) {

    console.error(
      "Error guardando colores:",
      error
    );


    estadoColores.mostrarToast(
      error.message ||
      "No se pudieron guardar los colores"
    );


    estadoColores.botonGuardar.textContent =
      "Guardar colores";

  }

  finally {

    estadoColores.guardando =
      false;


    estadoColores.botonGuardar.disabled =
      false;

    estadoColores.botonVolver.disabled =
      false;

  }

}


// ========================================
// VOLVER
// ========================================

function volverAFanProjects() {

  if (
    estadoColores.guardando
  ) {

    return;

  }


  if (
    typeof estadoColores.alVolver ===
      "function"
  ) {

    estadoColores.alVolver();

  }

}


// ========================================
// INICIAR PANTALLA
// ========================================

export async function renderColoresFanProject({

  eventoId,

  fanProject,

  contenedor,

  mostrarToast,

  alVolver

}) {

  if (
    !eventoId
  ) {

    throw new Error(
      "No se recibió el ID del evento."
    );

  }


  if (
    !fanProject?.id
  ) {

    throw new Error(
      "No se recibió el Fan Project."
    );

  }


  if (
    !contenedor
  ) {

    throw new Error(
      "No se recibió el contenedor de colores."
    );

  }


  estadoColores.eventoId =
    eventoId;

  estadoColores.fanProject =
    fanProject;

  estadoColores.contenedor =
    contenedor;

  estadoColores.zonas =
    [];

  estadoColores.colores =
    [];


  estadoColores.mostrarToast =
    typeof mostrarToast ===
      "function"
      ? mostrarToast
      : mensaje => {

          console.log(
            mensaje
          );

        };


  estadoColores.alVolver =
    typeof alVolver ===
      "function"
      ? alVolver
      : null;


  const vista =
    crearVistaColores({

      contenedor,

      fanProject

    });


  estadoColores.lista =
    vista.lista;

  estadoColores.botonVolver =
    vista.botonVolver;

  estadoColores.botonGuardar =
    vista.botonGuardar;


  estadoColores.botonVolver.addEventListener(
    "click",
    volverAFanProjects
  );


  estadoColores.botonGuardar.addEventListener(
    "click",
    procesarGuardado
  );


  await cargarDatos();

}
