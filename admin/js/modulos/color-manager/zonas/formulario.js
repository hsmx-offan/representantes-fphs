/* ========================================
   COLOR MANAGER
   FORMULARIO DE ZONAS
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

export function crearSlugZona(
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

export function crearFormularioZona(
  zona = {}
) {

  return `

    <div class="campo">

      <label for="nombreZona">
        Nombre
      </label>

      <input
        type="text"
        id="nombreZona"
        value="${escaparHTML(
          zona.nombre || ""
        )}"
        placeholder="General A"
        autocomplete="off"
        required
      >

    </div>


    <div class="campo">

      <label for="slugZona">
        ID o slug
      </label>

      <input
        type="text"
        id="slugZona"
        value="${escaparHTML(
          zona.slug ||
          zona.id ||
          ""
        )}"
        placeholder="general-a"
        autocomplete="off"
        required
      >

      <small>
        Se usa internamente para identificar la zona.
      </small>

    </div>


    <div class="campo">

      <label for="ordenZona">
        Orden
      </label>

      <input
        type="number"
        id="ordenZona"
        min="1"
        value="${escaparHTML(
          zona.orden || 1
        )}"
        required
      >

    </div>


    <div class="campo">

      <label for="descripcionZona">
        Descripción
      </label>

      <textarea
        id="descripcionZona"
        rows="3"
        placeholder="Descripción opcional de la zona"
      >${escaparHTML(
        zona.descripcion || ""
      )}</textarea>

    </div>


    <label class="campo-check">

      <input
        type="checkbox"
        id="activaZona"
        ${
          zona.activa !== false
            ? "checked"
            : ""
        }
      >

      <span>
        Zona activa
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
      "#nombreZona"
    );

  const slugInput =
    formulario.querySelector(
      "#slugZona"
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
        crearSlugZona(
          nombreInput.value
        );

    }
  );

}


// ========================================
// OBTENER DATOS
// ========================================

export function obtenerDatosZona(
  formulario
) {

  return {

    nombre:
      formulario
        .querySelector(
          "#nombreZona"
        )
        .value
        .trim(),

    slug:
      crearSlugZona(
        formulario
          .querySelector(
            "#slugZona"
          )
          .value
      ),

    orden:
      Number(
        formulario
          .querySelector(
            "#ordenZona"
          )
          .value
      ),

    descripcion:
      formulario
        .querySelector(
          "#descripcionZona"
        )
        .value
        .trim(),

    activa:
      formulario
        .querySelector(
          "#activaZona"
        )
        .checked

  };

}


// ========================================
// VALIDAR DATOS
// ========================================

export function validarDatosZona(
  datos
) {

  if (
    !datos.nombre
  ) {

    throw new Error(
      "Escribe el nombre de la zona."
    );

  }


  if (
    !datos.slug
  ) {

    throw new Error(
      "Escribe un ID válido para la zona."
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
