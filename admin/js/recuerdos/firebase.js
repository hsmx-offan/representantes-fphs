import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  db
} from "../shared/firebase.js";


const COLECCION_RECUERDOS =
  "recuerdos";


export async function obtenerRecuerdos() {

  const referencia =
    collection(
      db,
      COLECCION_RECUERDOS
    );

  const consulta =
    query(
      referencia,
      orderBy(
        "fechaEnvio",
        "desc"
      )
    );

  const resultado =
    await getDocs(
      consulta
    );

  return resultado.docs
    .map(documento => ({
      id: documento.id,
      ...documento.data()
    }))
    .filter(
      recuerdo =>
        recuerdo.temporal !== true
    );

}


export async function cambiarEstadoRecuerdo(
  recuerdoId,
  nuevoEstado,
  admin
) {

  const referencia =
    doc(
      db,
      COLECCION_RECUERDOS,
      recuerdoId
    );

  await updateDoc(
    referencia,
    {
      estado: nuevoEstado,

      fechaRevision:
        new Date(),

      revisadoPor:
        admin?.uid || "",

      revisadoPorNombre:
        admin?.nombre || ""
    }
  );

}


export async function cambiarDestacadoRecuerdo(
  recuerdoId,
  destacada,
  admin
) {

  const referencia =
    doc(
      db,
      COLECCION_RECUERDOS,
      recuerdoId
    );

  await updateDoc(
    referencia,
    {
      destacada,

      fechaDestacado:
        destacada
          ? new Date()
          : null,

      destacadoPor:
        destacada
          ? admin?.uid || ""
          : "",

      destacadoPorNombre:
        destacada
          ? admin?.nombre || ""
          : ""
    }
  );

}
