/* ========================================
   COLOR MANAGER
   FORMULARIO DE FAN PROJECTS
   ======================================== */


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
// CREAR SLUG
// ========================================

export function crearSlugFanProject(
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
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      ""
    );

}


// ========================================
// CREAR CONTENIDO DEL FORMULARIO
// ========================================

export function crearFormularioFanProject(
  fanProject = {}
) {

  return `

    <div class="campo">

      <label for="nombreFanProject">
        Nombre
      </label>

      <input
        type="text"
        id="nombreFanProject"
        value="${escaparHTML(
          fanProject.nombre || ""
        )}"
        placeholder="Aperture"
        autocomplete="off"
        required
      >

    </div>


    <div class="campo">

      <label for="slugFanProject">
        ID o slug
      </label>

      <input
        type="text"
        id="slugFanProject"
        value="${escaparHTML(
          fanProject.slug ||
          fanProject.id ||
          ""
        )}"
        placeholder="aperture"
        autocomplete="off"
        required
      >

      <small>
        Se usa internamente para identificar el Fan Project.
      </small>

    </div>


    <div class="formulario-grid">

      <div class="campo">

        <label for="ordenFanProject">
          Orden
        </label>

        <input
          type="number"
          id="ordenFanProject"
          min="1"
          value="${escaparHTML(
            fanProject.orden || 1
          )}"
          required
        >

      </div>


      <div class="campo">

        <label for="iconoFanProject">
          Icono
        </label>

        <input
          type="text"
          id="iconoFanProject"
          value="${escaparHTML(
            fanProject.icono || ""
          )}"
          placeholder="sun"
          autocomplete="off"
        >

      </div>

    </div>


    <div class="campo">

      <label for="descripcionFanProject">
        Descripción
      </label>

      <textarea
        id="descripcionFanProject"
        rows="3"
        placeholder="Descripción opcional"
      >${escaparHTML(
        fanProject.descripcion || ""
      )}</textarea>

    </div>


    <label class="campo-check">

      <input
        type="checkbox"
        id="activoFanProject"
        ${
          fanProject.activo !== false
            ? "checked"
            : ""
        }
      >

      <span>
        Fan Project activo
      </span>

    </label>

  `;

}


// ========================================
// ACTIVAR SLUG AUTOMÁTICO
// ========================================

export function activarSlugAutomatico(
  formulario,
  esEdicion = false
) {

  const nombreInput =
    formulario.querySelector(
      "#nombreFanProject"
    );

  const slugInput =
    formulario.querySelector(
      "#slugFanProject"
    );


  if (
    !nombreInput ||
    !slugInput
  ) {

    return;

  }


  let slugEditadoManualmente =
    esEdicion &&
    slugInput.value.trim() !== "";


  slugInput.addEventListener(
    "input",
    () => {

      slugEditadoManualmente =
        slugInput.value.trim() !== "";

    }
  );


  nombreInput.addEventListener(
    "input",
    () => {

      if (
        slugEditadoManualmente
      ) {

        return;

      }


      slugInput.value =
        crearSlugFanProject(
          nombreInput.value
        );

    }
  );

}


// ========================================
// OBTENER DATOS
// ========================================

export function obtenerDatosFanProject(
  formulario
) {

  return {

    nombre:
      formulario
        .querySelector(
          "#nombreFanProject"
        )
        .value
        .trim(),

    slug:
      crearSlugFanProject(
        formulario
          .querySelector(
            "#slugFanProject"
          )
          .value
      ),

    orden:
      Number(
        formulario
          .querySelector(
            "#ordenFanProject"
          )
          .value
      ),

    icono:
      formulario
        .querySelector(
          "#iconoFanProject"
        )
        .value
        .trim(),

    descripcion:
      formulario
        .querySelector(
          "#descripcionFanProject"
        )
        .value
        .trim(),

    activo:
      formulario
        .querySelector(
          "#activoFanProject"
        )
        .checked

  };

}


// ========================================
// VALIDAR DATOS
// ========================================

export function validarDatosFanProject(
  datos
) {

  if (
    !datos.nombre
  ) {

    throw new Error(
      "Escribe el nombre del Fan Project."
    );

  }


  if (
    !datos.slug
  ) {

    throw new Error(
      "Escribe un ID válido para el Fan Project."
    );

  }


  if (
    !Number.isInteger(
      datos.orden
    ) ||
    datos.orden < 1
  ) {

    throw new Error(
      "El orden debe ser un número mayor a cero."
    );

  }


  return true;

}
