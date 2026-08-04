import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  db
} from "../../../shared/firebase.js";


// ========================================
// OBTENER REFERENCIA DE SUBCOLECCIÓN
// ========================================

function obtenerColeccion({
  eventoId,
  nombreSubcoleccion
}) {

  if (!eventoId) {

    throw new Error(
      "No se recibió el ID del evento."
    );

  }

  if (!nombreSubcoleccion) {

    throw new Error(
      "No se recibió la subcolección."
    );

  }

  return collection(
    db,
    "eventos",
    eventoId,
    nombreSubcoleccion
  );

}


// ========================================
// LISTAR DOCUMENTOS
// ========================================

export async function listarDocumentos({
  eventoId,
  nombreSubcoleccion
}) {

  const snapshot =
    await getDocs(
      obtenerColeccion({
        eventoId,
        nombreSubcoleccion
      })
    );

  return snapshot.docs.map(
    documento => ({
      id: documento.id,
      ...documento.data()
    })
  );

}


// ========================================
// GUARDAR DOCUMENTO
// ========================================

export async function guardarDocumento({
  eventoId,
  nombreSubcoleccion,
  documentoId,
  datos,
  esNuevo = false
}) {

  if (!documentoId) {

    throw new Error(
      "No se recibió el ID del documento."
    );

  }

  const referencia =
    doc(
      db,
      "eventos",
      eventoId,
      nombreSubcoleccion,
      documentoId
    );

  const datosFinales = {
    ...datos,

    fechaActualizacion:
      serverTimestamp()
  };

  if (esNuevo) {

    datosFinales.fechaCreacion =
      serverTimestamp();

  }

  await setDoc(
    referencia,
    datosFinales,
    {
      merge: true
    }
  );

}


// ========================================
// ELIMINAR DOCUMENTO
// ========================================

export async function eliminarDocumento({
  eventoId,
  nombreSubcoleccion,
  documentoId
}) {

  if (!documentoId) {

    throw new Error(
      "No se recibió el ID del documento."
    );

  }

  await deleteDoc(
    doc(
      db,
      "eventos",
      eventoId,
      nombreSubcoleccion,
      documentoId
    )
  );

}
