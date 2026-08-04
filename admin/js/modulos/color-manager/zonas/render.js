import {
  crearCard
} from "../shared/cards.js";

import {
  mostrarCargando,
  mostrarVacio,
  mostrarError
} from "../shared/estado.js";


// ========================================
// CREAR VISTA DEL MÓDULO
// ========================================

export function crearVistaZonas(
  contenedor
) {

  contenedor.innerHTML = `

    <div class="header-modulo">

      <div>

        <p class="etiqueta-seccion">
          ZONAS
        </p>

        <h3>
          🪑 Zonas del evento
        </h3>

        <p>
          Administra las zonas disponibles para esta edición.
        </p>

      </div>

      <button
        type="button"
        id="btnNuevaZona"
        class="btn-principal"
      >
        ＋ Nueva zona
      </button>

    </div>

    <div
      id="listaZonas"
      class="lista-fechas"
    ></div>

  `;


  return {

    botonNueva:
      contenedor.querySelector(
        "#btnNuevaZona"
      ),

    lista:
      contenedor.querySelector(
        "#listaZonas"
      )

  };

}


// ========================================
// MOSTRAR CARGA
// ========================================

export function mostrarCargaZonas(
  lista
) {

  mostrarCargando({

    contenedor:
      lista,

    mensaje:
      "Cargando zonas..."

  });

}


// ========================================
// MOSTRAR ERROR
// ========================================

export function mostrarErrorZonas(
  lista
) {

  mostrarError({

    contenedor:
      lista,

    mensaje:
      "No fue posible cargar las zonas."

  });

}


// ========================================
// RENDERIZAR ZONAS
// ========================================

export function renderizarZonas({

  lista,

  zonas,

  alEditar,

  alEliminar

}) {

  lista.innerHTML =
    "";


  if (
    !Array.isArray(
      zonas
    ) ||
    zonas.length === 0
  ) {

    mostrarVacio({

      contenedor:
        lista,

      icono:
        "🪑",

      titulo:
        "No hay zonas",

      descripcion:
        "Agrega la primera zona de esta edición."

    });

    return;

  }


  for (
    const zona
    of zonas
  ) {

    const tarjeta =
      crearCard({

        titulo:
          zona.nombre ||
          "Zona sin nombre",

        subtitulo:
          `ID: ${zona.id}`,

        descripcion:
          `Orden ${zona.orden ?? "—"}`,

        estado:
          zona.activa !== false,

        acciones: [

          {
            icono:
              "✏️",

            titulo:
              "Editar zona",

            click:
              () => {

                alEditar(
                  zona
                );

              }
          },

          {
            icono:
              "🗑️",

            titulo:
              "Eliminar zona",

            click:
              () => {

                alEliminar(
                  zona
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
