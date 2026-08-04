const CACHE_NAME = "mi-color-v3";


const ARCHIVOS = [

  "/representantes-fphs/",

  "/representantes-fphs/mi-color.html",

  "/representantes-fphs/css/mi-color.css",

  "/representantes-fphs/js/mi-color/index.js",

  "/representantes-fphs/js/mi-color/api.js",

  "/representantes-fphs/js/mi-color/render.js",

  "/representantes-fphs/manifest.webmanifest",

  "/representantes-fphs/img/icon-192.png",

  "/representantes-fphs/img/icon-512.png",

  "/representantes-fphs/admin/js/shared/firebase.js",

  "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js",

  "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js",

  "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js"

];



self.addEventListener(

  "install",

  event => {

    event.waitUntil(

      caches.open(

        CACHE_NAME

      ).then(

        cache =>

          cache.addAll(

            ARCHIVOS

          )

      )

    );

  }

);



self.addEventListener(

  "activate",

  event => {

    event.waitUntil(

      caches.keys().then(

        keys =>

          Promise.all(

            keys.map(

              key => {

                if (

                  key !==

                  CACHE_NAME

                ) {

                  return caches.delete(

                    key

                  );

                }

              }

            )

          )

      )

    );

  }

);



self.addEventListener(

  "fetch",

  event => {

    event.respondWith(

      caches.match(

        event.request

      ).then(

        respuesta =>

          respuesta ||

          fetch(

            event.request

          )

      )

    );

  }

);
