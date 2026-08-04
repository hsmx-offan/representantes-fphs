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
      `No se pudo leer el respaldo "${clave}":`,
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
      `No se pudo guardar el respaldo "${clave}":`,
      error
    );

  }

}


// ========================================
// VALIDAR LISTA
// ========================================

function esListaValida(
  lista
) {

  return (
    Array.isArray(
      lista
    ) &&
    lista.length > 0
  );

}


// ========================================
// VALIDAR COLORES
// ========================================

function hayColores(
  colores
) {

  return (
    colores &&
    typeof colores === "object" &&
    Object.keys(
      colores
    ).length > 0
  );

}


// ========================================
// ERROR OFFLINE
// ========================================

function crearErrorOffline(
  recurso
) {

  return new Error(
    `No fue posible cargar ${recurso}. Abre la app una vez con internet antes del concierto.`
  );

}


// ========================================
// EVENTO ACTIVO
// ========================================

export async function obtenerEventoActivo() {

  /*
   * Si no hay internet, leemos directamente
   * el evento guardado sin intentar Firebase.
   */

  if (
    navigator.onLine === false
  ) {

    const eventoGuardado =
      await obtenerRespaldo(
        CLAVES.evento
      );


    if (
      eventoGuardado
    ) {

      return eventoGuardado;

    }


    throw crearErrorOffline(
      "el evento"
    );

  }


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
        "Firebase no devolvió un evento activo."
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


    throw crearErrorOffline(
      "el evento"
    );

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


  if (
    navigator.onLine === false
  ) {

    const fechasGuardadas =
      await obtenerRespaldo(
        clave
      );


    if (
      esListaValida(
        fechasGuardadas
      )
    ) {

      return fechasGuardadas;

    }


    throw crearErrorOffline(
      "las fechas"
    );

  }


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


    /*
     * Nunca guardamos un arreglo vacío,
     * porque podría reemplazar una copia
     * offline correcta.
     */

    if (
      !esListaValida(
        fechas
      )
    ) {

      throw new Error(
        "Firebase no devolvió fechas."
      );

    }


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
      esListaValida(
        fechasGuardadas
      )
    ) {

      return fechasGuardadas;

    }


    throw crearErrorOffline(
      "las fechas"
    );

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


  if (
    navigator.onLine === false
  ) {

    const zonasGuardadas =
      await obtenerRespaldo(
        clave
      );


    if (
      esListaValida(
        zonasGuardadas
      )
    ) {

      return zonasGuardadas;

    }


    throw crearErrorOffline(
      "las zonas"
    );

  }


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


    if (
      !esListaValida(
        zonas
      )
    ) {

      throw new Error(
        "Firebase no devolvió zonas."
      );

    }


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
      esListaValida(
        zonasGuardadas
      )
    ) {

      return zonasGuardadas;

    }


    throw crearErrorOffline(
      "las zonas"
    );

  }

}


// ========================================
// DESCARGAR COLORES
// ========================================

async function descargarColores({

  eventoId,

  fanProjectId

}) {

  const clave =
    CLAVES.colores(
      eventoId,
      fanProjectId
    );


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


  /*
   * No reemplazamos una copia válida
   * con un objeto vacío.
   */

  if (
    !hayColores(
      colores
    )
  ) {

    throw new Error(
      `Firebase no devolvió colores para ${fanProjectId}.`
    );

  }


  await guardarRespaldo(
    clave,
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


  if (
    navigator.onLine === false
  ) {

    const fanProjectsGuardados =
      await obtenerRespaldo(
        clave
      );


    if (
      esListaValida(
        fanProjectsGuardados
      )
    ) {

      return fanProjectsGuardados;

    }


    throw crearErrorOffline(
      "las canciones"
    );

  }


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


    if (
      !esListaValida(
        fanProjects
      )
    ) {

      throw new Error(
        "Firebase no devolvió canciones."
      );

    }


    await guardarRespaldo(
      clave,
      fanProjects
    );


    /*
     * Descargamos anticipadamente todos
     * los colores para el modo offline.
     */

    const resultados =
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


    for (
      const resultado
      of resultados
    ) {

      if (
        resultado.status ===
        "rejected"
      ) {

        console.warn(
          "No se pudieron guardar algunos colores:",
          resultado.reason
        );

      }

    }


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
      esListaValida(
        fanProjectsGuardados
      )
    ) {

      return fanProjectsGuardados;

    }


    throw crearErrorOffline(
      "las canciones"
    );

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
    !hayColores(
      colores
    )
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
