// ========================================
// NORMALIZAR TEXTO
// ========================================

function normalizarTexto(
  texto
) {

  return String(
    texto || ""
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
// FILTRAR MATERIALES
// ========================================

export function filtrarMateriales({
  materiales,
  busqueda,
  categoria
}) {

  const textoBusqueda =
    normalizarTexto(
      busqueda
    );

  const categoriaSeleccionada =
    normalizarTexto(
      categoria
    );


  return materiales.filter(
    material => {

      const coincideCategoria =
        !categoriaSeleccionada ||
        categoriaSeleccionada ===
          "todas" ||
        normalizarTexto(
          material.categoria
        ) ===
          categoriaSeleccionada;


      const contenidoMaterial =
        normalizarTexto(
          [
            material.id,
            material.nombre,
            material.categoria,
            material.tipo,
            material.descripcion
          ].join(
            " "
          )
        );


      const coincideBusqueda =
        !textoBusqueda ||
        contenidoMaterial.includes(
          textoBusqueda
        );


      return (
        coincideCategoria &&
        coincideBusqueda
      );

    }
  );

}


// ========================================
// OBTENER CATEGORÍAS
// ========================================

export function obtenerCategorias(
  materiales
) {

  const categorias =
    materiales
      .map(
        material =>
          String(
            material.categoria || ""
          ).trim()
      )
      .filter(
        categoria =>
          categoria !== ""
      );


  return [
    ...new Set(
      categorias
    )
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
  materiales
}) {

  const valorActual =
    selector.value;


  const categorias =
    obtenerCategorias(
      materiales
    );


  selector.innerHTML =
    `
      <option value="">
        Todas las categorías
      </option>
    `;


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


  const existeValorActual =
    categorias.includes(
      valorActual
    );


  selector.value =
    existeValorActual
      ? valorActual
      : "";

}
