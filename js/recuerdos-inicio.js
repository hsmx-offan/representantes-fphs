import {
  db
} from "../admin/js/shared/firebase.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const collage =
  document.getElementById(
    "collageRecuerdosInicio"
  );

const MAX_FOTOS_INICIO = 8;


cargarCollageInicio();


async function cargarCollageInicio() {

  if (!collage) return;

  try {

    const consulta =
      query(
        collection(
          db,
          "recuerdos"
        ),
        where(
          "estado",
          "==",
          "aprobado"
        )
      );

    const resultado =
      await getDocs(
        consulta
      );

    const recuerdos =
      resultado.docs
        .map(documento => ({
          id: documento.id,
          ...documento.data()
        }))
        .filter(recuerdo =>
          recuerdo.temporal !== true &&
          Array.isArray(recuerdo.fotos) &&
          recuerdo.fotos.length > 0
        )
        .sort((a, b) => {

          /*
           * Primero aparecen los destacados.
           */
          if (
            a.destacada === true &&
            b.destacada !== true
          ) {
            return -1;
          }

          if (
            b.destacada === true &&
            a.destacada !== true
          ) {
            return 1;
          }

          /*
           * Después, los envíos más recientes.
           */
          const fechaA =
            a.fechaEnvio?.toMillis?.() || 0;

          const fechaB =
            b.fechaEnvio?.toMillis?.() || 0;

          return fechaB - fechaA;

        });

    const fotos = [];

    for (const recuerdo of recuerdos) {

      for (const foto of recuerdo.fotos) {

        if (!foto?.url) continue;

        fotos.push({
          url: foto.url,
          nombre:
            recuerdo.nombre ||
            "Recuerdo de la comunidad"
        });

        if (
          fotos.length >=
          MAX_FOTOS_INICIO
        ) {
          break;
        }

      }

      if (
        fotos.length >=
        MAX_FOTOS_INICIO
      ) {
        break;
      }

    }

    if (!fotos.length) {
      collage.hidden = true;
      return;
    }

    collage.innerHTML = "";

    fotos.forEach((foto, indice) => {

      const enlace =
        document.createElement("a");

      enlace.href =
        "recuerdos.html";

      enlace.className =
        `collage-recuerdo collage-recuerdo-${indice + 1}`;

      enlace.setAttribute(
        "aria-label",
        "Ver nuestra historia"
      );

      const imagen =
        document.createElement("img");

      imagen.src = foto.url;
      imagen.loading = "lazy";

      imagen.alt =
        `Recuerdo compartido por ${foto.nombre}`;

      enlace.appendChild(imagen);
      collage.appendChild(enlace);

    });

    collage.hidden = false;

  } catch (error) {

    console.error(
      "Error cargando el collage de recuerdos:",
      error
    );

    collage.hidden = true;

  }

}
