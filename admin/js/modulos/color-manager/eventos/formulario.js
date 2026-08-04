/* ========================================
   COLOR MANAGER
   FORMULARIO DE EVENTOS
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
// CREAR CONTENIDO DEL FORMULARIO
// ========================================

export function crearFormularioEvento(
  evento = {}
) {

  const anioActual =
    new Date().getFullYear();


  return `

    <div class="campo">

      <label for="nombreEventoModulo">
        Nombre de la edición
      </label>

      <input
        type="text"
        id="nombreEventoModulo"
        value="${escaparHTML(
          evento.nombre || ""
        )}"
        placeholder="Together Together Tour México 2026"
        autocomplete="off"
        required
      >

    </div>


    <div class="formulario-grid">

      <div class="campo">

        <label for="anioEventoModulo">
          Año
        </label>

        <input
          type="number"
          id="anioEventoModulo"
          min="2026"
          max="2100"
          value="${escaparHTML(
            evento.anio || anioActual
          )}"
          required
        >

      </div>


      <div class="campo">

        <label for="ciudadEventoModulo">
          Ciudad
        </label>

        <input
          type="text"
          id="ciudadEventoModulo"
          value="${escaparHTML(
            evento.ciudad || ""
          )}"
          placeholder="Ciudad de México"
          autocomplete="off"
          required
        >

      </div>

    </div>


    <div class="campo">

      <label for="paisEventoModulo">
        País
      </label>

      <input
        type="text"
        id="paisEventoModulo"
        value="${escaparHTML(
          evento.pais || "México"
        )}"
        placeholder="México"
        autocomplete="off"
        required
      >

    </div>


    <label class="campo-check">

      <input
        type="checkbox"
        id="activoEventoModulo"
        ${
          evento.activo === true
            ? "checked"
            : ""
        }
      >

      <span>
        Marcar esta edición como activa
      </span>

    </label>

  `;

}


// ========================================
// OBTENER DATOS
// ========================================

export function obtenerDatosEvento(
  formulario
) {

  return {

    nombre:
      formulario
        .querySelector(
          "#nombreEventoModulo"
        )
        .value
        .trim(),

    anio:
      Number(
        formulario
          .querySelector(
            "#anioEventoModulo"
          )
          .value
      ),

    ciudad:
      formulario
        .querySelector(
          "#ciudadEventoModulo"
        )
        .value
        .trim(),

    pais:
      formulario
        .querySelector(
          "#paisEventoModulo"
        )
        .value
        .trim(),

    activo:
      formulario
        .querySelector(
          "#activoEventoModulo"
        )
        .checked

  };

}


// ========================================
// VALIDAR DATOS
// ========================================

export function validarDatosEvento(
  datos
) {

  if (
    !datos.nombre
  ) {

    throw new Error(
      "Escribe el nombre de la edición."
    );

  }


  if (
    !Number.isInteger(
      datos.anio
    ) ||
    datos.anio < 2026 ||
    datos.anio > 2100
  ) {

    throw new Error(
      "Escribe un año válido."
    );

  }


  if (
    !datos.ciudad
  ) {

    throw new Error(
      "Escribe la ciudad del evento."
    );

  }


  if (
    !datos.pais
  ) {

    throw new Error(
      "Escribe el país del evento."
    );

  }


  return true;

}


// ========================================
// CREAR ID DEL EVENTO
// ========================================

export function crearIdEvento({
  nombre,
  anio
}) {

  const nombreNormalizado =
    String(
      nombre || "evento"
    )
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      )
      .slice(
        0,
        35
      );


  return (
    `${nombreNormalizado || "evento"}-${anio}`
  );

}
