import {
  db
} from "../admin/js/shared/firebase.js";

import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  iniciarModalRecuerdoPublico,
  abrirModalRecuerdoPublico
} from "./modal-recuerdo-publico.js";


// ========================================
// ELEMENTOS
// ========================================

const grid =
  document.getElementById(
    "gridRecuerdos"
  );


// ========================================
// INICIO
// ========================================

iniciarPaginaRecuerdos();


async function iniciarPaginaRecuerdos() {

  try {

    await cargarModalPublico();

    await cargarRecuerdos();

  } catch (error) {

    console.error(
      "Error iniciando la página de recuerdos:",
      error
    );

    if (grid) {

      grid.innerHTML = `
        <div class="estado-galeria">
          <strong>
            No pudimos iniciar la galería.
          </strong>

          <p>
            Intenta recargar la página.
          </p>
        </div>
      `;

    }

  }

}


// ========================================
// CARGAR HTML DEL MODAL
// ========================================

async function cargarModalPublico() {

  const contenedor =
    document.getElementById(
      "contenedorModalRecuerdoPublico"
    );

  if (!contenedor) {

    throw new Error(
      "No se encontró el contenedor del modal público."
    );

  }

  const respuesta =
    await fetch(
      "html/modal-recuerdo-publico.html"
    );

  if (!respuesta.ok) {

    throw new Error(
      "No se pudo cargar el modal público."
    );

  }

  contenedor.innerHTML =
    await respuesta.text();

  const modalIniciado =
    iniciarModalRecuerdoPublico();

  if (!modalIniciado) {

    throw new Error(
      "No se pudo inicializar el modal público."
    );

  }

}


// ========================================
// CARGAR RECUERDOS
// ========================================

async function cargarRecuerdos() {

  if (!grid) return;

  grid.innerHTML = `
    <div class="estado-galeria">
      <strong>
        Cargando recuerdos...
      </strong>

      <p>
        Estamos reuniendo las fotografías de la comunidad.
      </p>
    </div>
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
              a.fechaEnvio
                ?.toMillis?.() || 0;

            const fechaB =
              b.fechaEnvio
                ?.toMillis?.() || 0;

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


// ========================================
// CREAR TARJETA
// ========================================

function crearTarjeta(
  recuerdo
) {

  const fotos =
    Array.isArray(
      recuerdo.fotos
    )
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

  tarjeta.tabIndex = 0;

  tarjeta.setAttribute(
    "role",
    "button"
  );

  tarjeta.setAttribute(
    "aria-label",
    `Abrir recuerdo de ${
      recuerdo.nombre ||
      "la comunidad"
    }`
  );


  const imagen =
    document.createElement(
      "img"
    );

  imagen.src = foto;

  imagen.loading =
    "lazy";

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


  tarjeta.addEventListener(
    "click",
    () => {

      abrirModalRecuerdoPublico(
        recuerdo
      );

    }
  );


  tarjeta.addEventListener(
    "keydown",
    evento => {

      if (
        evento.key === "Enter" ||
        evento.key === " "
      ) {

        evento.preventDefault();

        abrirModalRecuerdoPublico(
          recuerdo
        );

      }

    }
  );


  grid.appendChild(
    tarjeta
  );

}
