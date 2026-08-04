/* ========================================
   COLOR MANAGER
   API DE FAN PROJECTS
   ======================================== */

import {
  listar,
  guardar,
  eliminar
} from "../shared/crud-manager.js";


// ========================================
// CONFIGURACIÓN
// ========================================

const SUBCOLECCION =
  "fanProjects";


// ========================================
// LISTAR FAN PROJECTS
// ========================================

export async function listarFanProjects(
  eventoId
) {

  return await listar({

    eventoId,

    subcoleccion:
      SUBCOLECCION,

    ordenarPor:
      "orden"

  });

}


// ========================================
// GUARDAR FAN PROJECT
// ========================================

export async function guardarFanProject({

  eventoId,

  fanProjectId,

  datos,

  esNuevo = false

}) {

  if (
    !fanProjectId
  ) {

    throw new Error(
      "No se recibió el ID del Fan Project."
    );

  }


  await guardar({

    eventoId,

    subcoleccion:
      SUBCOLECCION,

    id:
      fanProjectId,

    datos,

    esNuevo

  });

}


// ========================================
// ELIMINAR FAN PROJECT
// ========================================

export async function eliminarFanProject({

  eventoId,

  fanProjectId

}) {

  if (
    !fanProjectId
  ) {

    throw new Error(
      "No se recibió el ID del Fan Project."
    );

  }


  await eliminar({

    eventoId,

    subcoleccion:
      SUBCOLECCION,

    id:
      fanProjectId

  });

}
