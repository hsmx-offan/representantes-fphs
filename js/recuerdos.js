import {
  db
} from "../admin/js/shared/firebase.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const grid =
  document.getElementById(
    "gridRecuerdos"
  );


cargarRecuerdos();


async function cargarRecuerdos() {

  if (!grid) return;

  grid.innerHTML = `
    <p class="estado-galeria">
      Cargando recuerdos...
    </p>
  `;

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

    const snapshot =
      await getDocs(
        consulta
      );

    const recuerdos =
      snapshot.docs
        .map(documento => ({
          id: documento.id,
          ...documento.data()
        }))
        .filter(
          recuerdo =>
            recuerdo.temporal !== true
        )
        .sort(
          (a, b) => {

            const fechaA =
              a.fechaEnvio?.toMillis?.() || 0;

            const fechaB =
              b.fechaEnvio?.toMillis?.() || 0;

            return fechaB - fechaA;

          }
        );

    grid.innerHTML = "";

    if (!recuerdos.length) {

      grid.innerHTML = `
        <div class="estado-galeria">
          <strong>
            Todavía no hay recuerdos publicados.
          </strong>

          <p>
            Los recuerdos aparecerán aquí después de ser aprobados.
          </p>
        </div>
      `;

      return;
    }

    recuerdos.forEach(
      crearTarjeta
    );

  } catch (error) {

    console.error(
      "Error cargando recuerdos:",
      error
    );

    grid.innerHTML = `
      <div class="estado-galeria">
        <strong>
          No pudimos cargar los recuerdos.
        </strong>

        <p>
          Intenta recargar la página.
        </p>
      </div>
    `;

  }

}


function crearTarjeta(
  recuerdo
) {

  const fotos =
    Array.isArray(recuerdo.fotos)
      ? recuerdo.fotos
      : [];

  const foto =
    fotos[0]?.url || "";

  if (!foto) return;

  const tarjeta =
    document.createElement(
      "article"
    );

  tarjeta.className =
    "recuerdo";

  const imagen =
    document.createElement(
      "img"
    );

  imagen.src = foto;
  imagen.loading = "lazy";

  imagen.alt =
    `Recuerdo compartido por ${
      recuerdo.nombre ||
      "la comunidad"
    }`;

  const informacion =
    document.createElement(
      "div"
    );

  informacion.className =
    "recuerdo-info";

  const nombre =
    document.createElement(
      "h3"
    );

  nombre.textContent =
    recuerdo.nombre ||
    "Recuerdo de la comunidad";

  const mensaje =
    document.createElement(
      "p"
    );

  mensaje.textContent =
    recuerdo.mensaje || "";

  informacion.append(
    nombre,
    mensaje
  );

  tarjeta.append(
    imagen,
    informacion
  );

  grid.appendChild(
    tarjeta
  );

}
