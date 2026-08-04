/* ========================================
   CRUD MANAGER
   ======================================== */

import {
  listarDocumentos,
  guardarDocumento,
  eliminarDocumento
} from "./crud-subcoleccion.js";


// ========================================
// LISTAR
// ========================================

export async function listar({

  eventoId,

  subcoleccion,

  ordenarPor

}) {

  let documentos =
    await listarDocumentos({

      eventoId,

      nombreSubcoleccion:
        subcoleccion

    });


  if (ordenarPor) {

    documentos.sort(
      (a, b) => {

        const valorA =
          a[ordenarPor];

        const valorB =
          b[ordenarPor];


        if (
          typeof valorA ===
            "number" &&
          typeof valorB ===
            "number"
        ) {

          return valorA - valorB;

        }


        return String(
          valorA ?? ""
        ).localeCompare(
          String(
            valorB ?? ""
          ),
          "es",
          {
            sensitivity:
              "base"
          }
        );

      }
    );

  }

  return documentos;

}


// ========================================
// GUARDAR
// ========================================

export async function guardar({

  eventoId,

  subcoleccion,

  id,

  datos,

  esNuevo = false

}) {

  await guardarDocumento({

    eventoId,

    nombreSubcoleccion:
      subcoleccion,

    documentoId:
      id,

    datos,

    esNuevo

  });

}


// ========================================
// ELIMINAR
// ========================================

export async function eliminar({

  eventoId,

  subcoleccion,

  id

}) {

  await eliminarDocumento({

    eventoId,

    nombreSubcoleccion:
      subcoleccion,

    documentoId:
      id

  });

}
