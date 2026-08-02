const FECHAS_CONCIERTOS = {
  "2026-07-31": "31 de julio de 2026",
  "2026-08-01": "1 de agosto de 2026",
  "2026-08-04": "4 de agosto de 2026",
  "2026-08-07": "7 de agosto de 2026",
  "2026-08-08": "8 de agosto de 2026",
  "2026-08-10": "10 de agosto de 2026"
};


// ========================================
// ELEMENTOS Y ESTADO
// ========================================

let elementos = {};

let recuerdoActual = null;
let indiceFotoActual = 0;

let modalInicializado = false;


// ========================================
// INICIAR MODAL
// ========================================

export function iniciarModalRecuerdoPublico() {

  elementos = {
    modal:
      document.getElementById(
        "modalRecuerdoPublico"
      ),

    imagen:
      document.getElementById(
        "modalPublicoImagen"
      ),

    nombre:
      document.getElementById(
        "modalPublicoNombre"
      ),

    instagram:
      document.getElementById(
        "modalPublicoInstagram"
      ),

    mensaje:
      document.getElementById(
        "modalPublicoMensaje"
      ),

    fecha:
      document.getElementById(
        "modalPublicoFecha"
      ),

    zona:
      document.getElementById(
        "modalPublicoZona"
      ),

    contador:
      document.getElementById(
        "modalPublicoContador"
      ),

    botonCerrar:
      document.getElementById(
        "cerrarModalRecuerdoPublico"
      ),

    botonAnterior:
      document.getElementById(
        "modalPublicoAnterior"
      ),

    botonSiguiente:
      document.getElementById(
        "modalPublicoSiguiente"
      )
  };


  if (!elementos.modal) {

    console.error(
      "No se encontró el modal público de recuerdos."
    );

    return false;

  }


  if (modalInicializado) {
    return true;
  }


  elementos.botonCerrar
    ?.addEventListener(
      "click",
      cerrarModalRecuerdoPublico
    );


  elementos.botonAnterior
    ?.addEventListener(
      "click",
      mostrarFotoAnterior
    );


  elementos.botonSiguiente
    ?.addEventListener(
      "click",
      mostrarFotoSiguiente
    );


  elementos.modal
    .querySelectorAll(
      "[data-cerrar-modal-publico]"
    )
    .forEach(elemento => {

      elemento.addEventListener(
        "click",
        cerrarModalRecuerdoPublico
      );

    });


  document.addEventListener(
    "keydown",
    controlarTeclado
  );


  modalInicializado = true;

  return true;

}


// ========================================
// ABRIR MODAL
// ========================================

export function abrirModalRecuerdoPublico(
  recuerdo
) {

  if (!modalInicializado) {

    const iniciado =
      iniciarModalRecuerdoPublico();

    if (!iniciado) {
      return;
    }

  }


  recuerdoActual =
    recuerdo;

  indiceFotoActual = 0;

  actualizarInformacion();
  actualizarFoto();

  elementos.modal.classList.add(
    "abierto"
  );

  elementos.modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-publico-abierto"
  );

}


// ========================================
// INFORMACIÓN
// ========================================

function actualizarInformacion() {

  if (!recuerdoActual) return;


  elementos.nombre.textContent =
    recuerdoActual.nombre ||
    "Recuerdo de la comunidad";


  elementos.instagram.textContent =
    recuerdoActual.instagram
      ? `@${String(
          recuerdoActual.instagram
        ).replace(/^@+/, "")}`
      : "Sin Instagram";


  elementos.mensaje.textContent =
    recuerdoActual.mensaje ||
    "Sin mensaje";


  elementos.fecha.textContent =
    FECHAS_CONCIERTOS[
      recuerdoActual.fechaConcierto
    ] ||
    recuerdoActual.fechaConcierto ||
    "No indicada";


  elementos.zona.textContent =
    recuerdoActual.zona ||
    "No indicada";

}


// ========================================
// FOTOGRAFÍAS
// ========================================

function obtenerFotos() {

  return Array.isArray(
    recuerdoActual?.fotos
  )
    ? recuerdoActual.fotos
    : [];

}


function actualizarFoto() {

  const fotos =
    obtenerFotos();


  if (!fotos.length) {

    elementos.imagen.removeAttribute(
      "src"
    );

    elementos.imagen.alt =
      "Este recuerdo no tiene fotografías.";

    elementos.contador.textContent =
      "Sin fotografías";

    elementos.botonAnterior.disabled =
      true;

    elementos.botonSiguiente.disabled =
      true;

    return;

  }


  const fotoActual =
    fotos[indiceFotoActual];


  elementos.imagen.src =
    fotoActual?.url || "";


  elementos.imagen.alt =
    `Fotografía ${
      indiceFotoActual + 1
    } del recuerdo de ${
      recuerdoActual.nombre ||
      "la comunidad"
    }`;


  elementos.contador.textContent =
    `${indiceFotoActual + 1} / ${
      fotos.length
    }`;


  const hayVariasFotos =
    fotos.length > 1;


  elementos.botonAnterior.disabled =
    !hayVariasFotos;


  elementos.botonSiguiente.disabled =
    !hayVariasFotos;

}


// ========================================
// ANTERIOR
// ========================================

function mostrarFotoAnterior(
  evento
) {

  evento?.stopPropagation();

  const fotos =
    obtenerFotos();


  if (fotos.length <= 1) {
    return;
  }


  indiceFotoActual =
    (
      indiceFotoActual -
      1 +
      fotos.length
    ) %
    fotos.length;


  actualizarFoto();

}


// ========================================
// SIGUIENTE
// ========================================

function mostrarFotoSiguiente(
  evento
) {

  evento?.stopPropagation();

  const fotos =
    obtenerFotos();


  if (fotos.length <= 1) {
    return;
  }


  indiceFotoActual =
    (
      indiceFotoActual +
      1
    ) %
    fotos.length;


  actualizarFoto();

}


// ========================================
// TECLADO
// ========================================

function controlarTeclado(
  evento
) {

  if (
    !elementos.modal?.classList.contains(
      "abierto"
    )
  ) {
    return;
  }


  if (evento.key === "Escape") {

    cerrarModalRecuerdoPublico();

  }


  if (evento.key === "ArrowLeft") {

    mostrarFotoAnterior();

  }


  if (evento.key === "ArrowRight") {

    mostrarFotoSiguiente();

  }

}


// ========================================
// CERRAR MODAL
// ========================================

export function cerrarModalRecuerdoPublico() {

  if (!elementos.modal) return;


  elementos.modal.classList.remove(
    "abierto"
  );


  elementos.modal.setAttribute(
    "aria-hidden",
    "true"
  );


  document.body.classList.remove(
    "modal-publico-abierto"
  );


  if (elementos.imagen) {

    elementos.imagen.removeAttribute(
      "src"
    );

  }


  recuerdoActual = null;
  indiceFotoActual = 0;

}
