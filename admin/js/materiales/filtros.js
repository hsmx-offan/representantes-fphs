// ========================================
// NORMALIZAR TEXTO
// ========================================

function normalizarTexto(
  texto
) {

  return String(
    texto ?? ""
  )
    .normalize(
      "NFD"
    )
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim()
    .toLowerCase();

}


// ========================================
// OBTENER TÉRMINOS DE BÚSQUEDA
// ========================================

function obtenerTerminosBusqueda(
  busqueda
) {

  return normalizarTexto(
    busqueda
  )
    .split(
      /\s+/
    )
    .filter(
      Boolean
    );

}


// ========================================
// FILTRAR MATERIALES
// ========================================

export function filtrarMateriales({
  materiales = [],
  busqueda = "",
  categoria = ""
}) {

  const listaMateriales =
    Array.isArray(
      materiales
    )
      ? materiales
      : [];

  const terminosBusqueda =
    obtenerTerminosBusqueda(
      busqueda
    );

  const categoriaSeleccionada =
    normalizarTexto(
      categoria
    );


  return listaMateriales.filter(
    material => {

      const categoriaMaterial =
        normalizarTexto(
          material?.categoria
        );


      const coincideCategoria =
        !categoriaSeleccionada ||
        categoriaSeleccionada ===
          "todas" ||
        categoriaMaterial ===
          categoriaSeleccionada;


      if (
        !coincideCategoria
      ) {

        return false;

      }


      const contenidoMaterial =
        normalizarTexto(
          [
            material?.id,
            material?.nombre,
            material?.categoria,
            material?.tipo,
            material?.descripcion,
            material?.url
          ].join(
            " "
          )
        );


      const coincideBusqueda =
        terminosBusqueda.every(
          termino =>
            contenidoMaterial.includes(
              termino
            )
        );


      return coincideBusqueda;

    }
  );

}


// ========================================
// OBTENER CATEGORÍAS
// ========================================

export function obtenerCategorias(
  materiales = []
) {

  const listaMateriales =
    Array.isArray(
      materiales
    )
      ? materiales
      : [];


  const categoriasUnicas =
    new Map();


  for (
    const material
    of listaMateriales
  ) {

    const categoriaOriginal =
      String(
        material?.categoria ?? ""
      ).trim();


    if (
      !categoriaOriginal
    ) {

      continue;

    }


    const claveCategoria =
      normalizarTexto(
        categoriaOriginal
      );


    if (
      !categoriasUnicas.has(
        claveCategoria
      )
    ) {

      categoriasUnicas.set(
        claveCategoria,
        categoriaOriginal
      );

    }

  }


  return [
    ...categoriasUnicas.values()
  ].sort(
    (a, b) =>
      a.localeCompare(
        b,
        "es",
        {
          sensitivity:
            "base"
        }
      )
  );

}


// ========================================
// LLENAR SELECT DE CATEGORÍAS
// ========================================

export function llenarFiltroCategorias({
  selector,
  materiales = []
}) {

  if (
    !selector
  ) {

    return;

  }


  const valorActual =
    normalizarTexto(
      selector.value
    );

  const categorias =
    obtenerCategorias(
      materiales
    );


  selector.replaceChildren();


  const opcionTodas =
    document.createElement(
      "option"
    );

  opcionTodas.value =
    "";

  opcionTodas.textContent =
    "Todas las categorías";


  selector.appendChild(
    opcionTodas
  );


  for (
    const categoria
    of categorias
  ) {

    const opcion =
      document.createElement(
        "option"
      );

    opcion.value =
      categoria;

    opcion.textContent =
      categoria;


    selector.appendChild(
      opcion
    );

  }


  const categoriaCoincidente =
    categorias.find(
      categoria =>
        normalizarTexto(
          categoria
        ) ===
          valorActual
    );


  selector.value =
    categoriaCoincidente || "";

}
