import {
  normalizarTexto
} from "../shared/utils.js";


// ========================================
// INICIAR FILTROS
// ========================================

export function iniciarFiltros({
  filtroTipo,
  busquedaProblema,
  limpiarFiltros,
  obtenerProblemas,
  mostrarResultados
}) {

  function aplicarFiltros() {

    const problemas =
      obtenerProblemas();

    const tipo =
      filtroTipo.value;

    const texto =
      normalizarTexto(
        busquedaProblema.value
      );


    const resultados =
      problemas.filter(
        problema => {

          const coincideTipo =
            !tipo ||
            problema.tipo === tipo;


          const representante =
            problema.representante;


          const coincideTexto =
            !texto ||
            normalizarTexto(
              representante?.id
            ).includes(texto) ||
            normalizarTexto(
              representante?.nombre
            ).includes(texto) ||
            normalizarTexto(
              representante?.instagram
            ).includes(texto) ||
            normalizarTexto(
              problema.descripcion
            ).includes(texto);


          return (
            coincideTipo &&
            coincideTexto
          );

        }
      );


    mostrarResultados(
      resultados
    );

  }


  filtroTipo.addEventListener(
    "change",
    aplicarFiltros
  );


  busquedaProblema.addEventListener(
    "input",
    aplicarFiltros
  );


  limpiarFiltros.addEventListener(
    "click",
    () => {

      filtroTipo.value =
        "";

      busquedaProblema.value =
        "";

      mostrarResultados(
        obtenerProblemas()
      );

    }
  );

}
