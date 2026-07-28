// ========================================
// FILTROS
// ========================================

export function crearFiltrosController({

  representantes,

  busqueda,
  filtroFecha,
  filtroZona,

  mostrarResultados,
  normalizarTexto

}) {

  function cargarOpcionesFiltros() {

    const fechas = [
      ...new Set(
        representantes()
          .map(r => r.fecha)
          .filter(Boolean)
      )
    ].sort();


    const zonas = [
      ...new Set(
        representantes()
          .map(r => r.zona)
          .filter(Boolean)
      )
    ].sort(
      (a, b) =>
        a.localeCompare(
          b,
          "es"
        )
    );


    filtroFecha.innerHTML =
      `<option value="">Todas</option>`;

    filtroZona.innerHTML =
      `<option value="">Todas</option>`;


    for (const fecha of fechas) {

      const option =
        document.createElement("option");

      option.value = fecha;
      option.textContent = fecha;

      filtroFecha.appendChild(option);

    }


    for (const zona of zonas) {

      const option =
        document.createElement("option");

      option.value = zona;
      option.textContent = zona;

      filtroZona.appendChild(option);

    }

  }


  function aplicarFiltros() {

    const texto =
      normalizarTexto(
        busqueda.value
      );

    const fecha =
      filtroFecha.value;

    const zona =
      filtroZona.value;


    const resultados =
      representantes().filter(
        representante => {

          const coincideTexto =
            !texto ||

            normalizarTexto(
              representante.id
            ).includes(texto) ||

            normalizarTexto(
              representante.nombre
            ).includes(texto) ||

            normalizarTexto(
              representante.instagram
            ).includes(texto);


          const coincideFecha =
            !fecha ||
            representante.fecha ===
              fecha;


          const coincideZona =
            !zona ||
            representante.zona ===
              zona;


          return (
            coincideTexto &&
            coincideFecha &&
            coincideZona
          );

        }
      );


    mostrarResultados(
      resultados
    );

  }


  function limpiarFiltros() {

    busqueda.value = "";
    filtroFecha.value = "";
    filtroZona.value = "";

    mostrarResultados(
      representantes()
    );

  }


  return {

    cargarOpcionesFiltros,
    aplicarFiltros,
    limpiarFiltros

  };

}
