/* ========================================
   MI COLOR
   API CON INDEXEDDB OFFLINE
   ======================================== */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  db
} from "../../admin/js/shared/firebase.js";

import {
  guardarDato,
  leerDato
} from "./offline.js";


// ========================================
// CLAVES OFFLINE
// ========================================

const CLAVES = {

  evento:
    "evento-activo",

  fechas:
    eventoId =>
      `fechas-${eventoId}`,

  zonas:
    eventoId =>
      `zonas-${eventoId}`,

  fanProjects:
    eventoId =>
      `fan-projects-${eventoId}`,

  colores:
    (
      eventoId,
      fanProjectId
    ) =>
      `colores-${eventoId}-${fanProjectId}`

};


// ========================================
// CONVERTIR SNAPSHOT
// ========================================

function convertirDocumentos(
  snapshot
) {

  return snapshot.docs.map(
    documento => ({

      id:
        documento.id,

      ...documento.data()

    })
  );

}


// ========================================
// LEER RESPALDO
// ========================================

async function obtenerRespaldo(
  clave
) {

  try {

    return (
      await leerDato(
        clave
      )
    ) ?? null;

  }

  catch (
    error
  ) {

    console.warn(
      "No se pudo leer IndexedDB:",
      error
    );

    return null;

  }

}


// ========================================
// GUARDAR RESPALDO
// ========================================

async function guardarRespaldo(
  clave,
  valor
) {

  try {

    await guardarDato(
      clave,
      valor
    );

  }

  catch (
    error
  ) {

    console.warn(
      "No se pudo guardar en IndexedDB:",
      error
    );

  }

}


// ========================================
// ERROR OFFLINE
// ========================================

function crearErrorOffline() {

  return new Error(
    "No fue posible cargar la configuración. Abre la app una vez con internet antes del concierto."
  );

}


// ========================================
// EVENTO ACTIVO
// ========================================

export async function obtenerEventoActivo() {

  try {

    const consulta =
      query(

        collection(
          db,
          "eventos"
        ),

        where(
          "activo",
          "==",
          true
        ),

        limit(
          1
        )

      );


    const snapshot =
      await getDocs(
        consulta
      );


    if (
      snapshot.empty
    ) {

      throw new Error(
        "No existe un evento activo."
      );

    }


    const evento = {

      id:
        snapshot.docs[0].id,

      ...snapshot.docs[0].data()

    };


    await guardarRespaldo(
      CLAVES.evento,
      evento
    );


    return evento;

  }

  catch (
    error
  ) {

    console.warn(
      "No se pudo consultar el evento en Firebase:",
      error
    );


    const eventoGuardado =
      await obtenerRespaldo(
        CLAVES.evento
      );


    if (
      eventoGuardado
    ) {

      return eventoGuardado;

    }


    throw crearErrorOffline();

  }

}


// ========================================
// FECHAS
// ========================================

export async function listarFechas(
  eventoId
) {

  const clave =
    CLAVES.fechas(
      eventoId
    );


  try {

    const consulta =
      query(

        collection(
          db,
          "eventos",
          eventoId,
          "fechas"
        ),

        orderBy(
          "fecha"
        )

      );


    const snapshot =
      await getDocs(
        consulta
      );


    const fechas =
      convertirDocumentos(
        snapshot
      );


    await guardarRespaldo(
      clave,
      fechas
    );


    return fechas;

  }

  catch (
    error
  ) {

    console.warn(
      "No se pudieron consultar las fechas:",
      error
    );


    const fechasGuardadas =
      await obtenerRespaldo(
        clave
      );


    if (
      Array.isArray(
        fechasGuardadas
      )
    ) {

      return fechasGuardadas;

    }


    throw crearErrorOffline();

  }

}


// ========================================
// ZONAS
// ========================================

export async function listarZonas(
  eventoId
) {

  const clave =
    CLAVES.zonas(
      eventoId
    );


  try {

    const consulta =
      query(

        collection(
          db,
          "eventos",
          eventoId,
          "zonas"
        ),

        orderBy(
          "orden"
        )

      );


    const snapshot =
      await getDocs(
        consulta
      );


    const zonas =
      convertirDocumentos(
        snapshot
      );


    await guardarRespaldo(
      clave,
      zonas
    );


    return zonas;

  }

  catch (
    error
  ) {

    console.warn(
      "No se pudieron consultar las zonas:",
      error
    );


    const zonasGuardadas =
      await obtenerRespaldo(
        clave
      );


    if (
      Array.isArray(
        zonasGuardadas
      )
    ) {

      return zonasGuardadas;

    }


    throw crearErrorOffline();

  }

}


// ========================================
// DESCARGAR COLORES
// ========================================

async function descargarColores({

  eventoId,

  fanProjectId

}) {

  const snapshot =
    await getDocs(

      collection(
        db,
        "eventos",
        eventoId,
        "fanProjects",
        fanProjectId,
        "colores"
      )

    );


  const colores =
    {};


  for (
    const documento
    of snapshot.docs
  ) {

    colores[documento.id] = {

      id:
        documento.id,

      ...documento.data()

    };

  }


  await guardarRespaldo(

    CLAVES.colores(
      eventoId,
      fanProjectId
    ),

    colores

  );


  return colores;

}


// ========================================
// FAN PROJECTS
// ========================================

export async function listarFanProjects(
  eventoId
) {

  const clave =
    CLAVES.fanProjects(
      eventoId
    );


  try {

    const consulta =
      query(

        collection(
          db,
          "eventos",
          eventoId,
          "fanProjects"
        ),

        orderBy(
          "orden"
        )

      );


    const snapshot =
      await getDocs(
        consulta
      );


    const fanProjects =
      convertirDocumentos(
        snapshot
      );


    await guardarRespaldo(
      clave,
      fanProjects
    );


    /*
     * Descarga anticipadamente todos
     * los colores para usarlos offline.
     */

    await Promise.allSettled(

      fanProjects.map(
        fanProject =>
          descargarColores({

            eventoId,

            fanProjectId:
              fanProject.id

          })
      )

    );


    return fanProjects;

  }

  catch (
    error
  ) {

    console.warn(
      "No se pudieron consultar los Fan Projects:",
      error
    );


    const fanProjectsGuardados =
      await obtenerRespaldo(
        clave
      );


    if (
      Array.isArray(
        fanProjectsGuardados
      )
    ) {

      return fanProjectsGuardados;

    }


    throw crearErrorOffline();

  }

}


// ========================================
// COLOR GUARDADO
// ========================================

async function obtenerColorOffline({

  eventoId,

  fanProjectId,

  zonaId

}) {

  const colores =
    await obtenerRespaldo(

      CLAVES.colores(
        eventoId,
        fanProjectId
      )

    );


  if (
    !colores ||
    typeof colores !==
      "object"
  ) {

    return null;

  }


  return colores[zonaId] ||
    null;

}


// ========================================
// COLOR
// ========================================

export async function obtenerColor({

  eventoId,

  fanProjectId,

  zonaId

}) {

  /*
   * Cuando el navegador confirma que está
   * offline, no intentamos consultar Firebase.
   */

  if (
    navigator.onLine === false
  ) {

    return obtenerColorOffline({

      eventoId,

      fanProjectId,

      zonaId

    });

  }


  try {

    const referencia =
      doc(

        db,

        "eventos",

        eventoId,

        "fanProjects",

        fanProjectId,

        "colores",

        zonaId

      );


    const snapshot =
      await getDoc(
        referencia
      );


    if (
      !snapshot.exists()
    ) {

      return null;

    }


    const color = {

      id:
        snapshot.id,

      ...snapshot.data()

    };


    /*
     * Actualizamos también el conjunto
     * completo guardado del Fan Project.
     */

    const clave =
      CLAVES.colores(
        eventoId,
        fanProjectId
      );


    const coloresGuardados =
      (
        await obtenerRespaldo(
          clave
        )
      ) || {};


    coloresGuardados[zonaId] =
      color;


    await guardarRespaldo(
      clave,
      coloresGuardados
    );


    return color;

  }

  catch (
    error
  ) {

    console.warn(
      "No se pudo consultar el color en Firebase:",
      error
    );


    return obtenerColorOffline({

      eventoId,

      fanProjectId,

      zonaId

    });

  }

}
