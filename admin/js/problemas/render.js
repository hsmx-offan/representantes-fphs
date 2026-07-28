import {
  escaparHTML
} from "../shared/utils.js";


// ========================================
// MOSTRAR PROBLEMAS
// ========================================

export function mostrarProblemas({
  resultados,
  cargandoProblemas,
  sinProblemas,
  listaProblemas,
  contadorResultados
}) {

  cargandoProblemas.style.display =
    "none";

  listaProblemas.innerHTML =
    "";


  contadorResultados.textContent =
    resultados.length === 1
      ? "1 problema"
      : `${resultados.length} problemas`;


  if (
    resultados.length === 0
  ) {

    listaProblemas.style.display =
      "none";

    sinProblemas.style.display =
      "block";

    return;

  }


  sinProblemas.style.display =
    "none";

  listaProblemas.style.display =
    "grid";


  for (
    const problema
    of resultados
  ) {

    const tarjeta =
      crearTarjetaProblema(
        problema
      );

    listaProblemas.appendChild(
      tarjeta
    );

  }

}


// ========================================
// CREAR TARJETA
// ========================================

function crearTarjetaProblema(
  problema
) {

  const tarjeta =
    document.createElement(
      "article"
    );


  tarjeta.className =
    `problema problema-${problema.tipo}`;


  tarjeta.innerHTML = `

    <div class="problema-icono">
      ${obtenerIcono(
        problema.tipo
      )}
    </div>

    <div class="problema-contenido">

      <h3>
        ${escaparHTML(
          problema.titulo
        )}
      </h3>

      <p>
        ${escaparHTML(
          problema.descripcion
        )}
      </p>

      ${
        problema.meta
          ? `
            <p class="problema-meta">
              ${escaparHTML(
                problema.meta
              )}
            </p>
          `
          : ""
      }

    </div>

    <a
      href="${crearEnlaceRepresentante(
        problema.representante
      )}"
      class="ver-representante"
    >
      Ver representante
    </a>

  `;


  return tarjeta;

}


// ========================================
// ICONOS
// ========================================

function obtenerIcono(
  tipo
) {

  switch (tipo) {

    case "id-duplicado":
      return "🔴";

    case "instagram-duplicado":
      return "🟠";

    case "sin-zona":
    case "sin-fecha":
      return "🟡";

    case "sin-instagram":
    case "sin-nombre":
      return "⚠️";

    default:
      return "⚠️";

  }

}


// ========================================
// ENLACE A REPRESENTANTE
// ========================================

function crearEnlaceRepresentante(
  representante
) {

  if (
    !representante ||
    !representante.id
  ) {

    return "representantes.html";

  }


  return (
    "representantes.html?buscar=" +
    encodeURIComponent(
      representante.id
    )
  );

}
