function escaparHTML(valor) {

  return String(valor ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function formatearFechaConcierto(fecha) {

  if (!fecha) {
    return "Fecha no indicada";
  }

  const fechas = {
    "2026-07-31": "31 de julio de 2026",
    "2026-08-01": "1 de agosto de 2026",
    "2026-08-04": "4 de agosto de 2026",
    "2026-08-07": "7 de agosto de 2026",
    "2026-08-08": "8 de agosto de 2026",
    "2026-08-10": "10 de agosto de 2026"
  };

  return fechas[fecha] || fecha;

}


function obtenerEtiquetaEstado(
  recuerdo
) {

  if (
    recuerdo.destacada === true &&
    recuerdo.estado === "aprobado"
  ) {
    return {
      clase: "aprobado",
      texto: "Destacado"
    };
  }

  const estados = {
    pendiente: {
      clase: "pendiente",
      texto: "Pendiente"
    },

    aprobado: {
      clase: "aprobado",
      texto: "Aprobado"
    },

    rechazado: {
      clase: "rechazado",
      texto: "Rechazado"
    },

    oculto: {
      clase: "rechazado",
      texto: "Oculto"
    }
  };

  return estados[recuerdo.estado] || {
    clase: "pendiente",
    texto: "Pendiente"
  };

}


function obtenerPrimeraFoto(
  recuerdo
) {

  const foto =
    Array.isArray(recuerdo.fotos)
      ? recuerdo.fotos[0]
      : null;

  return foto?.url || "";

}


export function crearTarjetaRecuerdo({
  recuerdo,
  alAprobar,
  alRechazar,
  alDestacar,
  alQuitarDestacado,
  alVer
}) {

  const tarjeta =
    document.createElement("article");

  tarjeta.className =
    "recuerdo-card";

  tarjeta.dataset.id =
    recuerdo.id;

  const estado =
    obtenerEtiquetaEstado(
      recuerdo
    );

  const fotoPrincipal =
    obtenerPrimeraFoto(
      recuerdo
    );

  const cantidadFotos =
    Array.isArray(recuerdo.fotos)
      ? recuerdo.fotos.length
      : 0;

  const instagram =
    recuerdo.instagram
      ? `@${String(
          recuerdo.instagram
        ).replace(/^@+/, "")}`
      : "Sin Instagram";

  const zona =
    recuerdo.zona ||
    "Zona no indicada";

  tarjeta.innerHTML = `
    <div class="recuerdo-imagen">

      ${
        fotoPrincipal
          ? `
            <img
              src="${escaparHTML(
                fotoPrincipal
              )}"
              alt="Recuerdo compartido por ${escaparHTML(
                recuerdo.nombre
              )}"
              loading="lazy"
            >
          `
          : `
            <div class="recuerdo-sin-imagen">
              📷
            </div>
          `
      }

      <span class="recuerdo-cantidad-fotos">
        ${cantidadFotos}
        ${
          cantidadFotos === 1
            ? "foto"
            : "fotos"
        }
      </span>

    </div>

    <div class="recuerdo-contenido">

      <div class="recuerdo-encabezado">

        <div>

          <p class="recuerdo-nombre">
            ${escaparHTML(
              recuerdo.nombre ||
              "Sin nombre"
            )}
          </p>

          <p class="recuerdo-instagram">
            ${escaparHTML(
              instagram
            )}
          </p>

        </div>

        <span
          class="recuerdo-estado ${estado.clase}"
        >
          ${estado.texto}
        </span>

      </div>

      <p class="recuerdo-mensaje">
        ${escaparHTML(
          recuerdo.mensaje ||
          "Sin mensaje"
        )}
      </p>

      <div class="recuerdo-datos">

        <p>
          <strong>Concierto:</strong>
          ${escaparHTML(
            formatearFechaConcierto(
              recuerdo.fechaConcierto
            )
          )}
        </p>

        <p>
          <strong>Zona:</strong>
          ${escaparHTML(zona)}
        </p>

      </div>

      <div class="recuerdo-acciones">

        <button
          type="button"
          class="ver"
          data-accion="ver"
        >
          Ver recuerdo
        </button>

        ${
          recuerdo.estado !== "aprobado"
            ? `
              <button
                type="button"
                class="aprobar"
                data-accion="aprobar"
              >
                Aprobar
              </button>
            `
            : `
              <button
                type="button"
                class="rechazar"
                data-accion="rechazar"
              >
                Ocultar
              </button>
            `
        }

        ${
          recuerdo.estado !== "rechazado"
            ? `
              <button
                type="button"
                class="rechazar"
                data-accion="rechazar"
              >
                Rechazar
              </button>
            `
            : `
              <button
                type="button"
                class="aprobar"
                data-accion="aprobar"
              >
                Restaurar
              </button>
            `
        }

        ${
          recuerdo.destacada === true
            ? `
              <button
                type="button"
                class="destacar"
                data-accion="quitar-destacado"
              >
                ★ Quitar destacado
              </button>
            `
            : `
              <button
                type="button"
                class="destacar"
                data-accion="destacar"
                ${
                  recuerdo.estado !==
                  "aprobado"
                    ? "disabled"
                    : ""
                }
              >
                ☆ Destacar
              </button>
            `
        }

      </div>

    </div>
  `;

  tarjeta
    .querySelector(
      '[data-accion="ver"]'
    )
    ?.addEventListener(
      "click",
      () => alVer(recuerdo)
    );

  tarjeta
    .querySelector(
      '[data-accion="aprobar"]'
    )
    ?.addEventListener(
      "click",
      () => alAprobar(recuerdo)
    );

  tarjeta
    .querySelector(
      '[data-accion="rechazar"]'
    )
    ?.addEventListener(
      "click",
      () => alRechazar(recuerdo)
    );

  tarjeta
    .querySelector(
      '[data-accion="destacar"]'
    )
    ?.addEventListener(
      "click",
      () => alDestacar(recuerdo)
    );

  tarjeta
    .querySelector(
      '[data-accion="quitar-destacado"]'
    )
    ?.addEventListener(
      "click",
      () =>
        alQuitarDestacado(
          recuerdo
        )
    );

  return tarjeta;

}
