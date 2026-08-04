/* ========================================
   COLOR MANAGER
   API DE COLORES POR FAN PROJECT
   ======================================== */

import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  db
} from "../../../shared/firebase.js";


// ========================================
// REFERENCIA A COLORES
// ========================================

function obtenerColeccionColores({
  eventoId,
  fanProjectId
}) {

  if (
    !eventoId
  ) {

    throw new Error(
      "No se recibió el ID del evento."
    );

  }


  if (
    !fanProjectId
  ) {

    throw new Error(
      "No se recibió el ID del Fan Project."
    );

  }


  return collection(
    db,
    "eventos",
    eventoId,
    "fanProjects",
    fanProjectId,
    "colores"
  );

}


// ========================================
// LISTAR COLORES
// ========================================

export async function listarColores({

  eventoId,

  fanProjectId

}) {

  const snapshot =
    await getDocs(
      obtenerColeccionColores({
        eventoId,
        fanProjectId
      })
    );


  return snapshot.docs.map(
    documento => ({

      id:
        documento.id,

      ...documento.data()

    })
  );

}


// ========================================
// GUARDAR TODOS LOS COLORES
// ========================================

export async function guardarColores({

  eventoId,

  fanProjectId,

  colores

}) {

  if (
    !eventoId
  ) {

    throw new Error(
      "No se recibió el ID del evento."
    );

  }


  if (
    !fanProjectId
  ) {

    throw new Error(
      "No se recibió el ID del Fan Project."
    );

  }


  if (
    !Array.isArray(
      colores
    )
  ) {

    throw new Error(
      "No se recibió una lista válida de colores."
    );

  }


  const batch =
    writeBatch(
      db
    );


  for (
    const color
    of colores
  ) {

    if (
      !color.zonaId
    ) {

      continue;

    }


    const referencia =
      doc(
        db,
        "eventos",
        eventoId,
        "fanProjects",
        fanProjectId,
        "colores",
        color.zonaId
      );


    batch.set(
      referencia,
      {

        zonaId:
          color.zonaId,

        colorId:
          color.colorId || "",

        activo:
          color.activo !== false,

        fechaActualizacion:
          serverTimestamp()

      },
      {
        merge:
          true
      }
    );

  }


  await batch.commit();

}
