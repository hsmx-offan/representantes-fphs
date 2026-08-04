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

export function crearVistaFanProjects(
  contenedor
) {

  contenedor.innerHTML = `

    <div class="header-modulo">

      <div>

        <p class="etiqueta-seccion">
          FAN PROJECTS
        </p>

        <h3>
          🌈 Fan Projects
        </h3>

        <p>
          Administra las canciones y proyectos de esta edición.
        </p>

      </div>

      <button
        type="button"
        id="btnNuevoFanProject"
        class="btn-principal"
      >
        ＋ Nuevo Fan Project
      </button>

    </div>

    <div
      id="listaFanProjects"
      class="lista-fechas"
    ></div>

  `;


  return {

    botonNuevo:
      contenedor.querySelector(
        "#btnNuevoFanProject"
      ),

    lista:
      contenedor.querySelector(
        "#listaFanProjects"
      )

  };

}


// ========================================
// MOSTRAR CARGA
// ========================================

export function mostrarCargaFanProjects(
  lista
) {

  mostrarCargando({

    contenedor:
      lista,

    mensaje:
      "Cargando Fan Projects..."

  });

}


// ========================================
// MOSTRAR ERROR
// ========================================

export function mostrarErrorFanProjects(
  lista
) {

  mostrarError({

    contenedor:
      lista,

    mensaje:
      "No fue posible cargar los Fan Projects."

  });

}


// ========================================
// RENDERIZAR FAN PROJECTS
// ========================================

export function renderizarFanProjects({

  lista,

  fanProjects,

  alEditar,

  alEliminar,

  alAbrirColores

}) {

  lista.innerHTML =
    "";


  if (
    !Array.isArray(
      fanProjects
    ) ||
    fanProjects.length === 0
  ) {

    mostrarVacio({

      contenedor:
        lista,

      icono:
        "🌈",

      titulo:
        "No hay Fan Projects",

      descripcion:
        "Agrega el primer Fan Project de esta edición."

    });

    return;

  }


  for (
    const fanProject
    of fanProjects
  ) {

    const tarjeta =
      crearCard({

        titulo:
          fanProject.nombre ||
          "Fan Project sin nombre",

        subtitulo:
          `ID: ${fanProject.id}`,

        descripcion:
          `Orden ${fanProject.orden ?? "—"} · Icono ${fanProject.icono || "—"}`,

        estado:
          fanProject.activo !== false,

        acciones: [

          {
            icono:
              "🎨",

            titulo:
              "Administrar colores",

            click:
              () => {

                alAbrirColores(
                  fanProject
                );

              }
          },

          {
            icono:
              "✏️",

            titulo:
              "Editar Fan Project",

            click:
              () => {

                alEditar(
                  fanProject
                );

              }
          },

          {
            icono:
              "🗑️",

            titulo:
              "Eliminar Fan Project",

            click:
              () => {

                alEliminar(
                  fanProject
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
