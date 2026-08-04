/* ========================================
   COLOR MANAGER
   MÓDULO ZONAS
   ======================================== */

import {
  crearCrudModule
} from "../shared/crud-module.js";


// ========================================
// CONFIGURACIÓN DEL MÓDULO
// ========================================

const moduloZonas =
  crearCrudModule({

    titulo:
      "🪑 Zonas",

    subcoleccion:
      "zonas"

  });


// ========================================
// FUNCIÓN PÚBLICA
// ========================================

export async function renderZonas({

  eventoId,

  contenedor,

  mostrarToast

}) {

  await moduloZonas.iniciar({

    eventoId,

    contenedor,

    mostrarToast

  });

}
