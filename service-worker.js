/* ========================================
   MI COLOR
   SERVICE WORKER
   ======================================== */

const CACHE_NAME =
  "mi-color-v15";


const RUTA_BASE =
  "/representantes-fphs";


const ARCHIVOS_APP = [

  `${RUTA_BASE}/mi-color.html`,

  `${RUTA_BASE}/css/mi-color.css`,

  `${RUTA_BASE}/js/mi-color/index.js`,

  `${RUTA_BASE}/js/mi-color/api.js`,

  `${RUTA_BASE}/js/mi-color/offline.js`,
   `${RUTA_BASE}/js/mi-color/configuracion-base.js`,

  `${RUTA_BASE}/js/mi-color/render.js`,

  `${RUTA_BASE}/manifest.webmanifest`,

  `${RUTA_BASE}/img/icon-192.png`,

  `${RUTA_BASE}/img/icon-512.png`,

  `${RUTA_BASE}/admin/js/shared/firebase.js`,

  `${RUTA_BASE}/admin/js/modulos/color-manager/shared/colores.js`

];

// ========================================
// INSTALAR
// ========================================

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(
          CACHE_NAME
        )
        .then(
          async cache => {

            /*
             * Guardamos los archivos uno por uno.
             * Si alguno falla, no cancela toda
             * la instalación.
             */

            await Promise.allSettled(

              ARCHIVOS_APP.map(
                archivo =>
                  cache.add(
                    archivo
                  )
              )

            );

          }
        )
        .then(
          () =>
            self.skipWaiting()
        )

    );

  }
);


// ========================================
// ACTIVAR
// ========================================

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(
          nombres =>
            Promise.all(

              nombres.map(
                nombre => {

                  if (
                    nombre !==
                    CACHE_NAME
                  ) {

                    return caches.delete(
                      nombre
                    );

                  }

                  return null;

                }
              )

            )
        )
        .then(
          () =>
            self.clients.claim()
        )

    );

  }
);


// ========================================
// IDENTIFICAR FIREBASE / FIRESTORE
// ========================================

function esSolicitudFirebase(
  url
) {

  return (

    url.hostname.includes(
      "firestore.googleapis.com"
    ) ||

    url.hostname.includes(
      "firebaseio.com"
    ) ||

    url.hostname.includes(
      "googleapis.com"
    ) ||

    url.hostname.includes(
      "firebaseapp.com"
    )

  );

}


// ========================================
// RED PRIMERO
// ========================================

async function redPrimero(
  request
) {

  const cache =
    await caches.open(
      CACHE_NAME
    );


  try {

    const respuesta =
      await fetch(
        request
      );


    if (
      respuesta &&
      respuesta.ok &&
      request.method === "GET"
    ) {

      cache.put(
        request,
        respuesta.clone()
      );

    }


    return respuesta;

  }

  catch (
    error
  ) {

    const respuestaGuardada =
      await cache.match(
        request
      );


    if (
      respuestaGuardada
    ) {

      return respuestaGuardada;

    }


    /*
     * Si la navegación falla, abrimos
     * la app guardada.
     */

    if (
      request.mode ===
      "navigate"
    ) {

      const paginaGuardada =
        await cache.match(
          `${RUTA_BASE}/mi-color.html`
        );


      if (
        paginaGuardada
      ) {

        return paginaGuardada;

      }

    }


    throw error;

  }

}


// ========================================
// CACHÉ PRIMERO PARA FIREBASE SDK
// ========================================

async function cachePrimero(
  request
) {

  const cache =
    await caches.open(
      CACHE_NAME
    );


  const guardado =
    await cache.match(
      request
    );


  if (
    guardado
  ) {

    return guardado;

  }


  const respuesta =
    await fetch(
      request
    );


  if (
    respuesta &&
    (
      respuesta.ok ||
      respuesta.type === "opaque"
    )
  ) {

    cache.put(
      request,
      respuesta.clone()
    );

  }


  return respuesta;

}


// ========================================
// FETCH
// ========================================

self.addEventListener(
  "fetch",
  event => {

    const request =
      event.request;


    if (
      request.method !==
      "GET"
    ) {

      return;

    }


    const url =
      new URL(
        request.url
      );


    /*
     * Las consultas reales de Firebase
     * deben pasar directamente por la red.
     * No deben guardarse como archivos.
     */

    if (
      esSolicitudFirebase(
        url
      )
    ) {

      event.respondWith(
        fetch(
          request
        )
      );

      return;

    }


    /*
     * Los módulos del SDK de Firebase
     * se guardan para poder iniciar offline.
     */

    if (
      url.hostname ===
      "www.gstatic.com"
    ) {

      event.respondWith(
        cachePrimero(
          request
        )
      );

      return;

    }


    /*
     * Para HTML, CSS y JS:
     * primero busca la versión nueva.
     * Si no hay señal, usa la copia.
     */

    event.respondWith(
      redPrimero(
        request
      )
    );

  }
);
