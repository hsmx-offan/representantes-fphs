import {
  crearCard
} from "../shared/cards.js";

import {
  mostrarCargando,
  mostrarVacio,
  mostrarError
} from "../shared/estado.js";


// ========================================
// MOSTRAR ESTRUCTURA DEL MÓDULO
// ========================================

export function crearVistaFechas(
  contenedor
) {

  contenedor.innerHTML = `

    <div class="header-modulo">

      <div>

        <p class="etiqueta-seccion">
          FECHAS
        </p>

        <h3>
          📅 Fechas del evento
        </h3>

        <p>
          Crea y administra las noches de esta edición.
        </p>

      </div>

      <button
        type="button"
        id="btnNuevaFecha"
        class="btn-principal"
      >
        ＋ Nueva fecha
      </button>

    </div>

    <div
      id="listaFechas"
      class="lista-fechas"
    ></div>

  `;


  return {

    botonNueva:
      contenedor.querySelector(
        "#btnNuevaFecha"
      ),

    lista:
      contenedor.querySelector(
        "#listaFechas"
      )

  };

}


// ========================================
// MOSTRAR CARGA
// ========================================

export function mostrarCargaFechas(
  lista
) {

  mostrarCargando({
    contenedor:
      lista,

    mensaje:
      "Cargando fechas..."
  });

}


// ========================================
// MOSTRAR ERROR
// ========================================

export function mostrarErrorFechas(
  lista
) {

  mostrarError({
    contenedor:
      lista,

    mensaje:
      "No fue posible cargar las fechas."
  });

}


// ========================================
// MOSTRAR FECHAS
// ========================================

export function renderizarFechas({

  lista,

  fechas,

  alEditar,

  alEliminar

}) {

  lista.innerHTML =
    "";


  if (
    !Array.isArray(
      fechas
    ) ||
    fechas.length === 0
  ) {

    mostrarVacio({

      contenedor:
        lista,

      icono:
        "📅",

      titulo:
        "No hay fechas",

      descripcion:
        "Agrega la primera fecha de esta edición."

    });

    return;

  }


  for (
    const fecha
    of fechas
  ) {

    const tarjeta =
      crearCard({

        titulo:
          fecha.nombre ||
          "Fecha sin nombre",

        subtitulo:
          `📅 ${fecha.fecha || "Sin fecha"}`,

        descripcion:
          `🕘 ${fecha.hora || "Sin hora"} · Orden ${fecha.orden ?? "—"}`,

        estado:
          fecha.activa !== false,

        acciones: [

          {
            icono:
              "✏️",

            titulo:
              "Editar fecha",

            click:
              () => {

                alEditar(
                  fecha
                );

              }
          },

          {
            icono:
              "🗑️",

            titulo:
              "Eliminar fecha",

            click:
              () => {

                alEliminar(
                  fecha
                );

              }
          }

        ]

      });


    lista.appendChild(
      tarjeta
    );

  }

}
