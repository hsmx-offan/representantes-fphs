/* ========================================
   COLOR MANAGER
   API DE EVENTOS
   ======================================== */

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  db
} from "../../../shared/firebase.js";


// ========================================
// LISTAR EVENTOS
// ========================================

export async function listarEventos() {

  const snapshot =
    await getDocs(
      collection(
        db,
        "eventos"
      )
    );


  return snapshot.docs
    .map(
      documento => ({

        id:
          documento.id,

        ...documento.data()

      })
    )
    .filter(
      evento =>
        evento.archivado !== true
    )
    .sort(
      (a, b) =>
        Number(
          b.anio || 0
        ) -
        Number(
          a.anio || 0
        )
    );

}


// ========================================
// CREAR EVENTO
// ========================================

export async function crearEvento({
  eventoId,
  datos
}) {

  if (
    !eventoId
  ) {

    throw new Error(
      "No se recibió el ID de la edición."
    );

  }


  await setDoc(
    doc(
      db,
      "eventos",
      eventoId
    ),
    {

      nombre:
        datos.nombre,

      anio:
        datos.anio,

      ciudad:
        datos.ciudad,

      pais:
        datos.pais,

      activo:
        datos.activo === true,

      archivado:
        false,

      fechaCreacion:
        serverTimestamp(),

      fechaActualizacion:
        serverTimestamp()

    }
  );

}


// ========================================
// EDITAR EVENTO
// ========================================

export async function editarEvento({
  eventoId,
  datos
}) {

  if (
    !eventoId
  ) {

    throw new Error(
      "No se recibió el ID de la edición."
    );

  }


  await updateDoc(
    doc(
      db,
      "eventos",
      eventoId
    ),
    {

      nombre:
        datos.nombre,

      anio:
        datos.anio,

      ciudad:
        datos.ciudad,

      pais:
        datos.pais,

      activo:
        datos.activo === true,

      fechaActualizacion:
        serverTimestamp()

    }
  );

}


// ========================================
// ACTIVAR UN SOLO EVENTO
// ========================================

export async function activarEvento({
  eventoId,
  eventos = []
}) {

  if (
    !eventoId
  ) {

    throw new Error(
      "No se recibió la edición que se activará."
    );

  }


  const ids =
    new Set(
      [
        ...eventos.map(
          evento =>
            evento.id
        ),

        eventoId
      ]
        .filter(
          Boolean
        )
    );


  const batch =
    writeBatch(
      db
    );


  for (
    const id
    of ids
  ) {

    batch.set(
      doc(
        db,
        "eventos",
        id
      ),
      {

        activo:
          id === eventoId,

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


// ========================================
// DESACTIVAR EVENTO
// ========================================

export async function desactivarEvento(
  eventoId
) {

  if (
    !eventoId
  ) {

    throw new Error(
      "No se recibió el ID de la edición."
    );

  }


  await updateDoc(
    doc(
      db,
      "eventos",
      eventoId
    ),
    {

      activo:
        false,

      fechaActualizacion:
        serverTimestamp()

    }
  );

}


// ========================================
// ELIMINAR EVENTO
// ========================================

export async function eliminarEvento(
  eventoId
) {

  if (
    !eventoId
  ) {

    throw new Error(
      "No se recibió el ID de la edición."
    );

  }


  await deleteDoc(
    doc(
      db,
      "eventos",
      eventoId
    )
  );

}
