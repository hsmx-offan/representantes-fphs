// ========================================
// TABLA DE REPRESENTANTES
// ========================================

export function crearTablaController({
  tablaRepresentantes,
  contenedorTabla,
  contadorResultados,
  cargandoResultados,
  estadoInicial,
  sinResultados,
  fichaRepresentante,

  escaparHTML,
  obtenerPapelitos,
  consultarGafete,
  abrirFicha,

  establecerResultadosActuales,
  limpiarSeleccion
}) {

  function mostrarResultados(
    resultados
  ) {

    establecerResultadosActuales(
      resultados
    );

    cargandoResultados.style.display =
      "none";

    estadoInicial.style.display =
      "none";

    tablaRepresentantes.innerHTML =
      "";

    fichaRepresentante.style.display =
      "none";

    limpiarSeleccion();


    if (
      resultados.length === 0
    ) {

      sinResultados.style.display =
        "block";

      contenedorTabla.style.display =
        "none";

      contadorResultados.textContent =
        "0 resultados";

      return;

    }


    sinResultados.style.display =
      "none";

    contenedorTabla.style.display =
      "block";


    contadorResultados.textContent =
      resultados.length === 1
        ? "1 resultado"
        : `${resultados.length} resultados`;


    for (
      const representante
      of resultados
    ) {

      const fila =
        document.createElement(
          "tr"
        );


      const papelitos =
        obtenerPapelitos(
          representante
        );


      const papelitosConfirmados =
        papelitos &&
        papelitos.confirmado === true;


      fila.innerHTML = `
        <td>
          ${escaparHTML(
            representante.id
          )}
        </td>

        <td>
          ${escaparHTML(
            representante.nombre ||
            "—"
          )}
        </td>

        <td>
          ${
            representante.instagram
              ? "@" +
                escaparHTML(
                  representante.instagram.replace(
                    /^@/,
                    ""
                  )
                )
              : "—"
          }
        </td>

        <td>
          ${escaparHTML(
            representante.fecha ||
            "—"
          )}
        </td>

        <td>
          ${escaparHTML(
            representante.zona ||
            "—"
          )}
        </td>

        <td class="estado-papelitos-tabla">
          ${
            papelitosConfirmados
              ? "✅ Confirmados"
              : "⏳ Pendiente"
          }
        </td>

        <td class="estado-gafete-tabla">
          Consultando...
        </td>

        <td>
          <button
            type="button"
            class="ver-ficha"
          >
            Ver
          </button>
        </td>
      `;


      const celdaGafete =
        fila.querySelector(
          ".estado-gafete-tabla"
        );


      consultarGafete(
        representante.id
      )
        .then(
          enviado => {

            celdaGafete.textContent =
              enviado
                ? "✅ Enviado"
                : "⏳ Pendiente";

          }
        )
        .catch(
          () => {

            celdaGafete.textContent =
              "—";

          }
        );


      fila
        .querySelector(
          ".ver-ficha"
        )
        .addEventListener(
          "click",
          () => {

            abrirFicha(
              representante
            );

          }
        );


      tablaRepresentantes.appendChild(
        fila
      );

    }

  }


  return {
    mostrarResultados
  };

}
