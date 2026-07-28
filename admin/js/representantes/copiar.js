// ========================================
// COPIAR DATOS Y LISTAS
// ========================================

export function configurarCopiado({
  copiarDatos,
  copiarLista,
  busqueda,
  filtroFecha,
  filtroZona,
  obtenerRepresentanteSeleccionado,
  obtenerResultadosActuales,
  mostrarToast
}) {

  copiarDatos.addEventListener(
    "click",
    async () => {

      const representante =
        obtenerRepresentanteSeleccionado();


      if (!representante) {
        return;
      }


      const texto = [
        representante.id,
        representante.nombre,

        representante.instagram
          ? `@${representante.instagram.replace(/^@/, "")}`
          : "",

        representante.fecha,
        representante.zona
      ]
        .filter(Boolean)
        .join(" — ");


      try {

        await navigator.clipboard.writeText(
          texto
        );

        mostrarToast(
          "Datos copiados"
        );

      }

      catch (error) {

        console.error(error);

        mostrarToast(
          "No se pudieron copiar los datos"
        );

      }

    }
  );


  copiarLista.addEventListener(
    "click",
    async () => {

      const resultadosActuales =
        obtenerResultadosActuales();


      if (
        resultadosActuales.length === 0
      ) {

        mostrarToast(
          "No hay resultados para copiar"
        );

        return;

      }


      const encabezados = [];


      if (filtroFecha.value) {

        encabezados.push(
          `FECHA: ${filtroFecha.value}`
        );

      }


      if (filtroZona.value) {

        encabezados.push(
          `ZONA: ${filtroZona.value}`
        );

      }


      if (busqueda.value.trim()) {

        encabezados.push(
          `BÚSQUEDA: ${busqueda.value.trim()}`
        );

      }


      const lineas =
        resultadosActuales.map(
          representante => {

            const instagram =
              representante.instagram
                ? `@${representante.instagram.replace(/^@/, "")}`
                : "Sin Instagram";


            return (
              `${representante.id} — ` +
              `${representante.nombre || "Sin nombre"} — ` +
              `${instagram} — ` +
              `${representante.fecha || "Sin fecha"} — ` +
              `${representante.zona || "Sin zona"}`
            );

          }
        );


      const texto = [
        "LISTA DE REPRESENTANTES",

        encabezados.length
          ? encabezados.join(" · ")
          : "Todos los resultados",

        "",

        ...lineas,

        "",

        `TOTAL: ${resultadosActuales.length}`
      ].join("\n");


      try {

        await navigator.clipboard.writeText(
          texto
        );

        mostrarToast(
          resultadosActuales.length === 1
            ? "1 registro copiado"
            : `${resultadosActuales.length} registros copiados`
        );

      }

      catch (error) {

        console.error(error);

        mostrarToast(
          "No se pudo copiar la lista"
        );

      }

    }
  );

}
