/* ========================================
   COLOR MANAGER
   ACCIONES DE EVENTOS
   ======================================== */

import {

  crearEvento,

  editarEvento,

  activarEvento,

  eliminarEvento

} from "./api.js";


// ========================================
// GUARDAR
// ========================================

export async function guardarEdicion({

  formulario,

  api,

  datos,

  esNuevo

}) {

  if (esNuevo) {

    await crearEvento({

      eventoId:
        datos.id,

      datos

    });

  }

  else {

    await editarEvento({

      eventoId:
        datos.id,

      datos

    });

  }

}


// ========================================
// ACTIVAR
// ========================================

export async function activarEdicion({

  eventoId,

  eventos

}) {

  await activarEvento({

    eventoId,

    eventos

  });

}


// ========================================
// ELIMINAR
// ========================================

export async function eliminarEdicion({

  eventoId

}) {

  await eliminarEvento(

    eventoId

  );

}
