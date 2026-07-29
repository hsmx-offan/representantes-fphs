// ========================================
// ESCAPAR TEXTO
// ========================================

function escaparHTML(
  texto
) {

  return String(
    texto || ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


// ========================================
// CREAR VISTA PREVIA
// ========================================

function crearVistaPrevia(
  material
) {

  if (
    !material.vistaPrevia
  ) {

    return `
      <div class="material-preview-vacia">
        <span>
          ${escaparHTML(
            material.tipo || "Material"
          )}
        </span>
      </div>
    `;

  }


  return `
    <div class="material-preview-contenedor">

      <img
        class="material-preview"
        src="${escaparHTML(
          material.vistaPrevia
        )}"
        alt="Vista previa de ${escaparHTML(
          material.nombre
        )}"
        loading="lazy"
      >

      <div
        class="material-preview-vacia"
        hidden
      >
        <span>
          ${escaparHTML(
            material.tipo || "Material"
          )}
        </span>
      </div>

    </div>
  `;

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

  tarjeta.dataset.id =
    material.id || "";

  tarjeta.dataset.categoria =
    material.categoria || "";


  tarjeta.innerHTML = `

    ${crearVistaPrevia(
      material
    )}

    <div class="material-header">

      <span class="material-badge">
        ${escaparHTML(
          material.tipo
        )}
      </span>

      <span class="material-categoria">
        ${escaparHTML(
          material.categoria
        )}
      </span>

    </div>

    <div class="material-body">

      <span class="material-id">
        ${escaparHTML(
          material.id
        )}
      </span>

      <h3>
        ${escaparHTML(
          material.nombre
        )}
      </h3>

      <p>
        ${
          escaparHTML(
            material.descripcion
          ) ||
          "Sin descripción."
        }
      </p>

    </div>

    <div class="material-actions">

      <a
        class="boton-principal"
        href="${escaparHTML(
          material.url
        )}"
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


  const imagen =
    tarjeta.querySelector(
      ".material-preview"
    );


  if (imagen) {

    imagen.addEventListener(
      "error",
      () => {

        imagen.hidden =
          true;


        const reemplazo =
          tarjeta.querySelector(
            ".material-preview-vacia"
          );


        if (reemplazo) {

          reemplazo.hidden =
            false;

        }

      },
      {
        once: true
      }
    );

  }


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
              detail:
                material
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
              detail:
                material
            }
          )
        );

      }
    );


  return tarjeta;

}


// ========================================
// ORDENAR MATERIALES
// ========================================

export function ordenarMateriales(
  materiales
) {

  return [
    ...materiales
  ].sort(
    (a, b) => {

      const categoriaA =
        String(
          a.categoria || ""
        );

      const categoriaB =
        String(
          b.categoria || ""
        );


      const compararCategoria =
        categoriaA.localeCompare(
          categoriaB,
          "es",
          {
            sensitivity:
              "base"
          }
        );


      if (
        compararCategoria !== 0
      ) {

        return compararCategoria;

      }


      return String(
        a.nombre || ""
      ).localeCompare(
        String(
          b.nombre || ""
        ),
        "es",
        {
          sensitivity:
            "base"
        }
      );

    }
  );

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


  const materialesOrdenados =
    ordenarMateriales(
      materiales
    );


  const cantidad =
    materialesOrdenados.length;


  contadorResultados.textContent =
    cantidad === 1
      ? "1 material"
      : `${cantidad} materiales`;


  if (
    cantidad === 0
  ) {

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
    of materialesOrdenados
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
