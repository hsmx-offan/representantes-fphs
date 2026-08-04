// ========================================
// ESTADO DEL MODAL
// ========================================

let modalActual =
  null;

let bloqueado =
  false;

let eventoEscape =
  null;


// ========================================
// ESCAPAR TEXTO
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
// CERRAR MODAL
// ========================================

export function cerrarModalCompartido() {

  if (
    bloqueado ||
    !modalActual
  ) {

    return;

  }


  modalActual.remove();

  modalActual =
    null;


  document.body.classList.remove(
    "modal-abierto"
  );


  if (
    eventoEscape
  ) {

    document.removeEventListener(
      "keydown",
      eventoEscape
    );

    eventoEscape =
      null;

  }

}


// ========================================
// BLOQUEAR MODAL
// ========================================

export function bloquearModalCompartido(
  valor
) {

  bloqueado =
    valor === true;


  if (
    !modalActual
  ) {

    return;

  }


  const botones =
    modalActual.querySelectorAll(
      "button"
    );


  for (
    const boton
    of botones
  ) {

    boton.disabled =
      bloqueado;

  }

}


// ========================================
// CAMBIAR TEXTO DEL BOTÓN GUARDAR
// ========================================

export function cambiarTextoGuardar(
  texto
) {

  if (
    !modalActual
  ) {

    return;

  }


  const botonGuardar =
    modalActual.querySelector(
      "[data-modal-guardar]"
    );


  if (
    botonGuardar
  ) {

    botonGuardar.textContent =
      texto;

  }

}


// ========================================
// OBTENER MODAL ACTUAL
// ========================================

export function obtenerModalActual() {

  return modalActual;

}


// ========================================
// ABRIR MODAL
// ========================================

export function abrirModalCompartido({

  titulo,

  contenido,

  textoGuardar =
    "Guardar",

  textoCancelar =
    "Cancelar",

  ancho =
    "560px",

  alGuardar,

  alCerrar,

  selectorFocus

}) {

  cerrarModalCompartido();


  bloqueado =
    false;


  const modal =
    document.createElement(
      "div"
    );


  modal.className =
    "modal modal-compartido";


  modal.innerHTML = `

    <div
      class="modal-fondo"
      data-modal-fondo
    ></div>

    <section
      class="modal-contenido"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tituloModalCompartido"
      style="max-width: ${escaparHTML(
        ancho
      )};"
    >

      <div class="modal-encabezado">

        <h2 id="tituloModalCompartido">
          ${escaparHTML(
            titulo
          )}
        </h2>

        <button
          type="button"
          class="boton-cerrar"
          data-modal-cerrar
          aria-label="Cerrar modal"
        >
          ×
        </button>

      </div>

      <form data-modal-formulario>

        <div class="modal-cuerpo">
          ${contenido}
        </div>

        <div class="acciones-formulario">

          <button
            type="button"
            class="boton-secundario"
            data-modal-cancelar
          >
            ${escaparHTML(
              textoCancelar
            )}
          </button>

          <button
            type="submit"
            class="boton-principal"
            data-modal-guardar
          >
            ${escaparHTML(
              textoGuardar
            )}
          </button>

        </div>

      </form>

    </section>

  `;


  document.body.appendChild(
    modal
  );


  modalActual =
    modal;


  document.body.classList.add(
    "modal-abierto"
  );


  const formulario =
    modal.querySelector(
      "[data-modal-formulario]"
    );

  const botonCerrar =
    modal.querySelector(
      "[data-modal-cerrar]"
    );

  const botonCancelar =
    modal.querySelector(
      "[data-modal-cancelar]"
    );

  const fondo =
    modal.querySelector(
      "[data-modal-fondo]"
    );


  function intentarCerrar() {

    if (
      bloqueado
    ) {

      return;

    }


    cerrarModalCompartido();


    if (
      typeof alCerrar ===
      "function"
    ) {

      alCerrar();

    }

  }


  botonCerrar.addEventListener(
    "click",
    intentarCerrar
  );


  botonCancelar.addEventListener(
    "click",
    intentarCerrar
  );


  fondo.addEventListener(
    "click",
    intentarCerrar
  );


  formulario.addEventListener(
    "submit",
    async evento => {

      evento.preventDefault();


      if (
        bloqueado ||
        typeof alGuardar !==
          "function"
      ) {

        return;

      }


      await alGuardar({
        modal,
        formulario
      });

    }
  );


  eventoEscape =
    evento => {

      if (
        evento.key ===
        "Escape"
      ) {

        intentarCerrar();

      }

    };


  document.addEventListener(
    "keydown",
    eventoEscape
  );


  setTimeout(
    () => {

      const elementoFocus =
        selectorFocus
          ? modal.querySelector(
              selectorFocus
            )
          : modal.querySelector(
              "input, select, textarea"
            );


      if (
        elementoFocus
      ) {

        elementoFocus.focus();

      }

    },
    50
  );


  return {
    modal,
    formulario
  };

}
