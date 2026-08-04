/* ========================================
   ESCAPAR HTML
   ======================================== */

function escaparHTML(texto) {

  return String(texto ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


/* ========================================
   CREAR BADGE
   ======================================== */

function crearBadge(activo) {

  return activo

    ? `
      <span class="estado-activo">
        Activo
      </span>
    `

    : `
      <span class="estado-inactivo">
        Inactivo
      </span>
    `;

}


/* ========================================
   CREAR CARD
   ======================================== */

export function crearCard({

  titulo,

  subtitulo,

  descripcion,

  estado = true,

  acciones = []

}) {

  const card =
    document.createElement(
      "article"
    );

  card.className =
    "card-fecha";


  card.innerHTML = `

    <div class="card-fecha-info">

      <div class="evento-titulo">

        <h4>

          ${escaparHTML(
            titulo
          )}

        </h4>

        ${crearBadge(
          estado
        )}

      </div>

      ${
        subtitulo

          ? `

          <span>

            ${escaparHTML(
              subtitulo
            )}

          </span>

          `

          : ""

      }

      ${
        descripcion

          ? `

          <span>

            ${escaparHTML(
              descripcion
            )}

          </span>

          `

          : ""

      }

    </div>

    <div
      class="card-fecha-acciones"
    ></div>

  `;


  const contenedorAcciones =
    card.querySelector(
      ".card-fecha-acciones"
    );


  for (

    const accion

    of acciones

  ) {

    const boton =
      document.createElement(
        "button"
      );

    boton.type =
      "button";

    boton.innerHTML =
      accion.icono;

    boton.title =
      accion.titulo;

    boton.addEventListener(
      "click",
      accion.click
    );

    contenedorAcciones.appendChild(
      boton
    );

  }


  return card;

}
