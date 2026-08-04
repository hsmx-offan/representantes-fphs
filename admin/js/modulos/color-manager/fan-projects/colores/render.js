/* ========================================
   COLOR MANAGER
   RENDER DE COLORES POR ZONA
   ======================================== */

import {
  COLORES
} from "../../shared/colores.js";

import {
  mostrarCargando,
  mostrarVacio,
  mostrarError
} from "../../shared/estado.js";


// ========================================
// ESCAPAR HTML
// ========================================

function escaparHTML(
  texto
) {

  return String(
    texto ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


// ========================================
// CREAR OPCIONES DE COLOR
// ========================================

function crearOpcionesColor(
  colorSeleccionado
) {

  const opciones = [

    `
      <option value="">
        Sin color asignado
      </option>
    `

  ];


  for (
    const color
    of COLORES
  ) {

    const seleccionado =
      color.id === colorSeleccionado
        ? "selected"
        : "";


    opciones.push(
      `
        <option
          value="${escaparHTML(
            color.id
          )}"
          ${seleccionado}
        >
          ${escaparHTML(
            color.nombre
          )}
        </option>
      `
    );

  }


  return opciones.join(
    ""
  );

}


// ========================================
// OBTENER COLOR DEL CATÁLOGO
// ========================================

function obtenerColor(
  colorId
) {

  return COLORES.find(
    color =>
      color.id === colorId
  ) || null;

}


// ========================================
// CREAR VISTA PRINCIPAL
// ========================================

export function crearVistaColores({

  contenedor,

  fanProject

}) {

  contenedor.innerHTML = `

    <div class="header-modulo">

      <div>

        <button
          type="button"
          id="volverFanProjects"
          class="btn-volver"
        >
          ← Volver a Fan Projects
        </button>

        <p class="etiqueta-seccion">
          COLORES
        </p>

        <h3>
          🎨 ${escaparHTML(
            fanProject.nombre ||
            "Fan Project"
          )}
        </h3>

        <p>
          Asigna el color correspondiente a cada zona.
        </p>

      </div>

      <button
        type="button"
        id="guardarColores"
        class="btn-principal"
      >
        Guardar colores
      </button>

    </div>

    <div
      id="listaColores"
      class="lista-colores"
    ></div>

  `;


  return {

    botonVolver:
      contenedor.querySelector(
        "#volverFanProjects"
      ),

    botonGuardar:
      contenedor.querySelector(
        "#guardarColores"
      ),

    lista:
      contenedor.querySelector(
        "#listaColores"
      )

  };

}


// ========================================
// MOSTRAR CARGA
// ========================================

export function mostrarCargaColores(
  lista
) {

  mostrarCargando({

    contenedor:
      lista,

    mensaje:
      "Cargando zonas y colores..."

  });

}


// ========================================
// MOSTRAR ERROR
// ========================================

export function mostrarErrorColores(
  lista
) {

  mostrarError({

    contenedor:
      lista,

    mensaje:
      "No fue posible cargar la configuración de colores."

  });

}


// ========================================
// RENDERIZAR ZONAS
// ========================================

export function renderizarColores({

  lista,

  zonas,

  coloresGuardados

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
        "No hay zonas disponibles",

      descripcion:
        "Primero agrega las zonas de esta edición."

    });

    return;

  }


  const coloresPorZona =
    new Map(
      (
        Array.isArray(
          coloresGuardados
        )
          ? coloresGuardados
          : []
      ).map(
        color => [

          color.zonaId ||
          color.id,

          color

        ]
      )
    );


  const fragmento =
    document.createDocumentFragment();


  for (
    const zona
    of zonas
  ) {

    const colorGuardado =
      coloresPorZona.get(
        zona.id
      );


    const colorId =
      colorGuardado?.colorId ||
      "";


    const color =
      obtenerColor(
        colorId
      );


    const tarjeta =
      document.createElement(
        "article"
      );


    tarjeta.className =
      "color-zona-card";


    tarjeta.innerHTML = `

      <div class="color-zona-info">

        <div>

          <h4>
            ${escaparHTML(
              zona.nombre ||
              zona.id
            )}
          </h4>

          <p>
            ID: ${escaparHTML(
              zona.id
            )}
          </p>

        </div>

        <span
          class="muestra-color"
          data-muestra-color
          style="
            background:
              ${escaparHTML(
                color?.hex ||
                "transparent"
              )};
          "
          title="${
            color
              ? escaparHTML(
                  color.nombre
                )
              : "Sin color"
          }"
        ></span>

      </div>


      <div class="campo">

        <label
          for="color-${escaparHTML(
            zona.id
          )}"
        >
          Color
        </label>

        <select
          id="color-${escaparHTML(
            zona.id
          )}"
          class="selector-color-zona"
          data-zona-id="${escaparHTML(
            zona.id
          )}"
        >

          ${crearOpcionesColor(
            colorId
          )}

        </select>

      </div>


      <label class="campo-check">

        <input
          type="checkbox"
          class="color-zona-activo"
          data-zona-id="${escaparHTML(
            zona.id
          )}"
          ${
            colorGuardado?.activo !== false
              ? "checked"
              : ""
          }
        >

        <span>
          Configuración activa
        </span>

      </label>

    `;


    const selector =
      tarjeta.querySelector(
        ".selector-color-zona"
      );


    const muestra =
      tarjeta.querySelector(
        "[data-muestra-color]"
      );


    selector.addEventListener(
      "change",
      () => {

        const nuevoColor =
          obtenerColor(
            selector.value
          );


        muestra.style.background =
          nuevoColor?.hex ||
          "transparent";


        muestra.title =
          nuevoColor?.nombre ||
          "Sin color";

      }
    );


    fragmento.appendChild(
      tarjeta
    );

  }


  lista.appendChild(
    fragmento
  );

}


// ========================================
// OBTENER CONFIGURACIÓN ACTUAL
// ========================================

export function obtenerColoresFormulario(
  contenedor
) {

  const selectores =
    contenedor.querySelectorAll(
      ".selector-color-zona"
    );


  const colores =
    [];


  for (
    const selector
    of selectores
  ) {

    const zonaId =
      selector.dataset.zonaId;


    const activoInput =
      contenedor.querySelector(
        `.color-zona-activo[data-zona-id="${CSS.escape(
          zonaId
        )}"]`
      );


    colores.push({

      zonaId,

      colorId:
        selector.value,

      activo:
        activoInput
          ? activoInput.checked
          : true

    });

  }


  return colores;

}
