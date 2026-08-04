/* ========================================
   MI COLOR
   API CON RESPALDO DEFINITIVO

   ORDEN DE PRIORIDAD:
   1. FIREBASE
   2. INDEXEDDB
   3. CONFIGURACIÓN BASE
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

import {
  CONFIGURACION_BASE
} from "./configuracion-base.js";


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
// VALIDAR OBJETO DE COLORES
// ========================================

function hayColores(
  colores
) {

  return (
    colores &&
    typeof colores === "object" &&
    !Array.isArray(
      colores
    ) &&
    Object.keys(
      colores
    ).length > 0
  );

}


// ========================================
// LEER RESPALDO INDEXEDDB
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
// GUARDAR RESPALDO INDEXEDDB
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

    return true;

  }

  catch (
    error
  ) {

    console.warn(
      `No se pudo guardar el respaldo "${clave}":`,
      error
    );

    return false;

  }

}


// ========================================
// COPIAR DATOS BASE
// Evita modificar accidentalmente el objeto
// original de configuracion-base.js
// ========================================

function copiarDatoBase(
  valor
) {

  if (
    valor === undefined ||
    valor === null
  ) {

    return null;

  }


  return JSON.parse(
    JSON.stringify(
      valor
    )
  );

}


// ========================================
// ERROR FINAL
// ========================================

function crearErrorFinal(
  recurso
) {

  return new Error(
    `No fue posible cargar ${recurso}.`
  );

}


// ========================================
// OBTENER EVENTO DESDE RESPALDOS
// ========================================

async function obtenerEventoDeRespaldo() {

  const eventoGuardado =
    await obtenerRespaldo(
      CLAVES.evento
    );


  if (
    eventoGuardado
  ) {

    console.info(
      "Evento cargado desde IndexedDB."
    );

    return eventoGuardado;

  }


  const eventoBase =
    copiarDatoBase(
      CONFIGURACION_BASE.evento
    );


  if (
    eventoBase
  ) {

    console.info(
      "Evento cargado desde configuración base."
    );


    await guardarRespaldo(
      CLAVES.evento,
      eventoBase
    );


    return eventoBase;

  }


  throw crearErrorFinal(
    "el evento"
  );

}


// ========================================
// EVENTO ACTIVO
// ========================================

export async function obtenerEventoActivo() {

  /*
   * Sin conexión confirmada:
   * no intentamos Firebase.
   */

  if (
    navigator.onLine === false
  ) {

    return obtenerEventoDeRespaldo();

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


    return obtenerEventoDeRespaldo();

  }

}


// ========================================
// OBTENER FECHAS DESDE RESPALDOS
// ========================================

async function obtenerFechasDeRespaldo(
  eventoId
) {

  const clave =
    CLAVES.fechas(
      eventoId
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

    console.info(
      "Fechas cargadas desde IndexedDB."
    );

    return fechasGuardadas;

  }


  const fechasBase =
    copiarDatoBase(
      CONFIGURACION_BASE.fechas
    );


  if (
    esListaValida(
      fechasBase
    )
  ) {

    console.info(
      "Fechas cargadas desde configuración base."
    );


    await guardarRespaldo(
      clave,
      fechasBase
    );


    return fechasBase;

  }


  throw crearErrorFinal(
    "las fechas"
  );

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

    return obtenerFechasDeRespaldo(
      eventoId
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
     * No reemplazamos un respaldo válido
     * con una lista vacía.
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


    return obtenerFechasDeRespaldo(
      eventoId
    );

  }

}


// ========================================
// OBTENER ZONAS DESDE RESPALDOS
// ========================================

async function obtenerZonasDeRespaldo(
  eventoId
) {

  const clave =
    CLAVES.zonas(
      eventoId
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

    console.info(
      "Zonas cargadas desde IndexedDB."
    );

    return zonasGuardadas;

  }


  const zonasBase =
    copiarDatoBase(
      CONFIGURACION_BASE.zonas
    );


  if (
    esListaValida(
      zonasBase
    )
  ) {

    console.info(
      "Zonas cargadas desde configuración base."
    );


    await guardarRespaldo(
      clave,
      zonasBase
    );


    return zonasBase;

  }


  throw crearErrorFinal(
    "las zonas"
  );

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

    return obtenerZonasDeRespaldo(
      eventoId
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


    return obtenerZonasDeRespaldo(
      eventoId
    );

  }

}


// ========================================
// OBTENER FAN PROJECTS DESDE RESPALDOS
// ========================================

async function obtenerFanProjectsDeRespaldo(
  eventoId
) {

  const clave =
    CLAVES.fanProjects(
      eventoId
    );


  const guardados =
    await obtenerRespaldo(
      clave
    );


  if (
    esListaValida(
      guardados
    )
  ) {

    console.info(
      "Canciones cargadas desde IndexedDB."
    );

    return guardados;

  }


  const base =
    copiarDatoBase(
      CONFIGURACION_BASE.fanProjects
    );


  if (
    esListaValida(
      base
    )
  ) {

    console.info(
      "Canciones cargadas desde configuración base."
    );


    await guardarRespaldo(
      clave,
      base
    );


    return base;

  }


  throw crearErrorFinal(
    "las canciones"
  );

}


// ========================================
// OBTENER COLORES BASE
// ========================================

function obtenerColoresBase(
  fanProjectId
) {

  const coloresBase =
    CONFIGURACION_BASE
      .colores
      ?.[fanProjectId];


  if (
    !hayColores(
      coloresBase
    )
  ) {

    return null;

  }


  return copiarDatoBase(
    coloresBase
  );

}


// ========================================
// GUARDAR COLORES BASE
// ========================================

async function guardarColoresBase({

  eventoId,

  fanProjectId

}) {

  const coloresBase =
    obtenerColoresBase(
      fanProjectId
    );


  if (
    !hayColores(
      coloresBase
    )
  ) {

    return null;

  }


  await guardarRespaldo(

    CLAVES.colores(
      eventoId,
      fanProjectId
    ),

    coloresBase

  );


  return coloresBase;

}


// ========================================
// DESCARGAR COLORES DE FIREBASE
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
// PREPARAR COLORES BASE
// ========================================

async function prepararColoresBase(
  eventoId
) {

  const fanProjectsBase =
    CONFIGURACION_BASE.fanProjects || [];


  await Promise.allSettled(

    fanProjectsBase.map(
      fanProject =>
        guardarColoresBase({

          eventoId,

          fanProjectId:
            fanProject.id

        })
    )

  );

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

    const fanProjects =
      await obtenerFanProjectsDeRespaldo(
        eventoId
      );


    /*
     * También aseguramos que los colores
     * base queden guardados.
     */

    await prepararColoresBase(
      eventoId
    );


    return fanProjects;

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
     * Descarga anticipada de todos los
     * colores disponibles en Firebase.
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


    /*
     * Si algún Fan Project no pudo descargar
     * sus colores, guardamos los de respaldo.
     */

    for (
      let indice = 0;
      indice < resultados.length;
      indice += 1
    ) {

      const resultado =
        resultados[indice];


      if (
        resultado.status ===
        "rejected"
      ) {

        const fanProject =
          fanProjects[indice];


        console.warn(
          `No se descargaron los colores de ${fanProject.id}:`,
          resultado.reason
        );


        await guardarColoresBase({

          eventoId,

          fanProjectId:
            fanProject.id

        });

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


    const fanProjects =
      await obtenerFanProjectsDeRespaldo(
        eventoId
      );


    await prepararColoresBase(
      eventoId
    );


    return fanProjects;

  }

}


// ========================================
// OBTENER COLOR OFFLINE
// ========================================

async function obtenerColorOffline({

  eventoId,

  fanProjectId,

  zonaId

}) {

  const clave =
    CLAVES.colores(
      eventoId,
      fanProjectId
    );


  /*
   * Primer respaldo: IndexedDB.
   */

  const coloresGuardados =
    await obtenerRespaldo(
      clave
    );


  if (
    hayColores(
      coloresGuardados
    )
  ) {

    const colorGuardado =
      coloresGuardados[zonaId];


    if (
      colorGuardado
    ) {

      return colorGuardado;

    }

  }


  /*
   * Respaldo definitivo:
   * configuración incluida en la app.
   */

  const coloresBase =
    obtenerColoresBase(
      fanProjectId
    );


  if (
    hayColores(
      coloresBase
    )
  ) {

    await guardarRespaldo(
      clave,
      coloresBase
    );


    return coloresBase[zonaId] ||
      null;

  }


  return null;

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


    /*
     * Si Firebase no tiene el documento,
     * intentamos los respaldos.
     */

    if (
      !snapshot.exists()
    ) {

      return obtenerColorOffline({

        eventoId,

        fanProjectId,

        zonaId

      });

    }


    const color = {

      id:
        snapshot.id,

      ...snapshot.data()

    };


    /*
     * Actualizamos el conjunto guardado
     * en IndexedDB.
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
