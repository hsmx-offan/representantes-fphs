/* ========================================
   MI COLOR
   API CON RESPALDO OFFLINE
   ======================================== */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  db
} from "../../admin/js/shared/firebase.js";


// ========================================
// CONFIGURACIÓN DEL RESPALDO
// ========================================

const CACHE_KEY =
  "miColorConfiguracionOffline";

const CACHE_VERSION =
  1;


// ========================================
// CREAR CACHÉ VACÍA
// ========================================

function crearCacheVacia() {

  return {

    version:
      CACHE_VERSION,

    fechaActualizacion:
      null,

    evento:
      null,

    fechas:
      {},

    zonas:
      {},

    fanProjects:
      {},

    colores:
      {}

  };

}


// ========================================
// LEER CACHÉ LOCAL
// ========================================

function leerCache() {

  try {

    const contenido =
      localStorage.getItem(
        CACHE_KEY
      );


    if (
      !contenido
    ) {

      return crearCacheVacia();

    }


    const cache =
      JSON.parse(
        contenido
      );


    if (
      cache.version !==
      CACHE_VERSION
    ) {

      return crearCacheVacia();

    }


    return {

      ...crearCacheVacia(),

      ...cache,

      fechas:
        cache.fechas || {},

      zonas:
        cache.zonas || {},

      fanProjects:
        cache.fanProjects || {},

      colores:
        cache.colores || {}

    };

  }

  catch (
    error
  ) {

    console.warn(
      "No se pudo leer la configuración offline:",
      error
    );


    return crearCacheVacia();

  }

}


// ========================================
// GUARDAR CACHÉ LOCAL
// ========================================

function guardarCache(
  cache
) {

  try {

    cache.version =
      CACHE_VERSION;

    cache.fechaActualizacion =
      new Date().toISOString();


    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify(
        cache
      )
    );

  }

  catch (
    error
  ) {

    console.warn(
      "No se pudo guardar la configuración offline:",
      error
    );

  }

}


// ========================================
// ERROR SIN RESPALDO
// ========================================

function crearErrorSinCache() {

  return new Error(
    "No hay conexión y todavía no existe una copia offline. Abre la app una vez con internet antes del concierto."
  );

}


// ========================================
// CONVERTIR SNAPSHOT EN LISTA
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
// EVENTO ACTIVO
// ========================================

export async function obtenerEventoActivo() {

  const cache =
    leerCache();


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


    cache.evento =
      evento;


    guardarCache(
      cache
    );


    return evento;

  }

  catch (
    error
  ) {

    console.warn(
      "Usando evento guardado sin conexión:",
      error
    );


    if (
      cache.evento
    ) {

      return cache.evento;

    }


    throw crearErrorSinCache();

  }

}


// ========================================
// FECHAS
// ========================================

export async function listarFechas(
  eventoId
) {

  const cache =
    leerCache();


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


    cache.fechas[eventoId] =
      fechas;


    guardarCache(
      cache
    );


    return fechas;

  }

  catch (
    error
  ) {

    console.warn(
      "Usando fechas guardadas sin conexión:",
      error
    );


    const fechasGuardadas =
      cache.fechas[eventoId];


    if (
      Array.isArray(
        fechasGuardadas
      )
    ) {

      return fechasGuardadas;

    }


    throw crearErrorSinCache();

  }

}


// ========================================
// ZONAS
// ========================================

export async function listarZonas(
  eventoId
) {

  const cache =
    leerCache();


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


    cache.zonas[eventoId] =
      zonas;


    guardarCache(
      cache
    );


    return zonas;

  }

  catch (
    error
  ) {

    console.warn(
      "Usando zonas guardadas sin conexión:",
      error
    );


    const zonasGuardadas =
      cache.zonas[eventoId];


    if (
      Array.isArray(
        zonasGuardadas
      )
    ) {

      return zonasGuardadas;

    }


    throw crearErrorSinCache();

  }

}


// ========================================
// DESCARGAR COLORES DE UN FAN PROJECT
// ========================================

async function descargarColoresFanProject({

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


  return colores;

}


// ========================================
// FAN PROJECTS
// ========================================

export async function listarFanProjects(
  eventoId
) {

  const cache =
    leerCache();


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


    cache.fanProjects[eventoId] =
      fanProjects;


    if (
      !cache.colores[eventoId]
    ) {

      cache.colores[eventoId] =
        {};

    }


    /*
     * Descarga todos los colores ahora,
     * mientras sí hay conexión.
     *
     * De esta manera, después se podrá
     * consultar cualquier zona y canción
     * sin entrar nuevamente a Firebase.
     */

    const resultadosColores =
      await Promise.allSettled(

        fanProjects.map(
          async fanProject => {

            const colores =
              await descargarColoresFanProject({

                eventoId,

                fanProjectId:
                  fanProject.id

              });


            return {

              fanProjectId:
                fanProject.id,

              colores

            };

          }
        )

      );


    for (
      const resultado
      of resultadosColores
    ) {

      if (
        resultado.status !==
        "fulfilled"
      ) {

        console.warn(
          "No se pudieron descargar algunos colores:",
          resultado.reason
        );

        continue;

      }


      cache.colores[eventoId][
        resultado.value.fanProjectId
      ] =
        resultado.value.colores;

    }


    guardarCache(
      cache
    );


    return fanProjects;

  }

  catch (
    error
  ) {

    console.warn(
      "Usando Fan Projects guardados sin conexión:",
      error
    );


    const fanProjectsGuardados =
      cache.fanProjects[eventoId];


    if (
      Array.isArray(
        fanProjectsGuardados
      )
    ) {

      return fanProjectsGuardados;

    }


    throw crearErrorSinCache();

  }

}


// ========================================
// BUSCAR COLOR GUARDADO
// ========================================

function obtenerColorGuardado({

  cache,

  eventoId,

  fanProjectId,

  zonaId

}) {

  return (
    cache.colores?.[eventoId]
      ?.[fanProjectId]
      ?.[zonaId]
  ) || null;

}


// ========================================
// COLOR
// ========================================

export async function obtenerColor({

  eventoId,

  fanProjectId,

  zonaId

}) {

  const cache =
    leerCache();


  /*
   * Si el navegador ya sabe que no hay
   * conexión, usamos directamente la copia.
   */

  if (
    navigator.onLine === false
  ) {

    return obtenerColorGuardado({

      cache,

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


    if (
      !cache.colores[eventoId]
    ) {

      cache.colores[eventoId] =
        {};

    }


    if (
      !cache.colores[eventoId][fanProjectId]
    ) {

      cache.colores[eventoId][fanProjectId] =
        {};

    }


    cache.colores[eventoId][fanProjectId][zonaId] =
      color;


    guardarCache(
      cache
    );


    return color;

  }

  catch (
    error
  ) {

    console.warn(
      "Usando color guardado sin conexión:",
      error
    );


    return obtenerColorGuardado({

      cache,

      eventoId,

      fanProjectId,

      zonaId

    });

  }

}
