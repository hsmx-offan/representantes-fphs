// ========================================
// ESCAPAR TEXTO
// ========================================

function escaparHTML(texto) {

  return String(texto || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// ========================================
// CREAR TARJETA
// ========================================

function crearTarjetaMaterial(
  material
) {

  const tarjeta =
    document.createElement(
      "article"
    );

  tarjeta.className =
    "material-card";


  const vistaPrevia =
    material.vistaPrevia
      ? `
        <img
          class="material-preview"
          src="${escaparHTML(material.vistaPrevia)}"
          alt=""
          loading="lazy"
        >
      `
      : "";


  tarjeta.innerHTML = `

    ${vistaPrevia}

    <div class="material-header">

      <span class="material-badge">
        ${escaparHTML(material.tipo)}
      </span>

      <span class="material-categoria">
        ${escaparHTML(material.categoria)}
      </span>

    </div>

    <div class="material-body">

      <h3>
        ${escaparHTML(material.nombre)}
      </h3>

      <p>
        ${
          escaparHTML(material.descripcion) ||
          "Sin descripción."
        }
      </p>

    </div>

    <div class="material-actions">

      <a
        class="boton-principal"
        href="${escaparHTML(material.url)}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Abrir material
      </a>

      <button
        type="button"
        class="boton-secundario editar-material"
      >
        Editar
      </button>

      <button
        type="button"
        class="boton-eliminar eliminar-material"
      >
        Eliminar
      </button>

    </div>

  `;


  tarjeta
    .querySelector(
      ".editar-material"
    )
    .addEventListener(
      "click",
      () => {

        tarjeta.dispatchEvent(
          new CustomEvent(
            "editarMaterial",
            {
              bubbles: true,
              detail: material
            }
          )
        );

      }
    );


  tarjeta
    .querySelector(
      ".eliminar-material"
    )
    .addEventListener(
      "click",
      () => {

        tarjeta.dispatchEvent(
          new CustomEvent(
            "eliminarMaterial",
            {
              bubbles: true,
              detail: material
            }
          )
        );

      }
    );


  return tarjeta;

}


// ========================================
// MOSTRAR MATERIALES
// ========================================

export function renderizarMateriales({
  materiales,
  listaMateriales,
  sinResultados,
  contadorResultados
}) {

  listaMateriales.innerHTML =
    "";


  const cantidad =
    materiales.length;


  contadorResultados.textContent =
    cantidad === 1
      ? "1 material"
      : `${cantidad} materiales`;


  if (cantidad === 0) {

    listaMateriales.style.display =
      "none";

    sinResultados.style.display =
      "flex";

    return;

  }


  sinResultados.style.display =
    "none";

  listaMateriales.style.display =
    "grid";


  const fragmento =
    document.createDocumentFragment();


  for (
    const material
    of materiales
  ) {

    fragmento.appendChild(
      crearTarjetaMaterial(
        material
      )
    );

  }


  listaMateriales.appendChild(
    fragmento
  );

}
