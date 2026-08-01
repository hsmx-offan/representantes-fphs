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

let acciones = {
  alAprobar: null,
  alRechazar: null,
  alDestacar: null,
  alQuitarDestacado: null
};


// ========================================
// INICIAR MODAL
// ========================================

export function iniciarModalRecuerdo({
  alAprobar,
  alRechazar,
  alDestacar,
  alQuitarDestacado
} = {}) {

  elementos = {
    modal:
      document.getElementById(
        "modalRecuerdo"
      ),

    imagen:
      document.getElementById(
        "modalRecuerdoImagen"
      ),

    nombre:
      document.getElementById(
        "modalRecuerdoNombre"
      ),

    instagram:
      document.getElementById(
        "modalRecuerdoInstagram"
      ),

    estado:
      document.getElementById(
        "modalRecuerdoEstado"
      ),

    mensaje:
      document.getElementById(
        "modalRecuerdoMensaje"
      ),

    fecha:
      document.getElementById(
        "modalRecuerdoFecha"
      ),

    zona:
      document.getElementById(
        "modalRecuerdoZona"
      ),

    cantidad:
      document.getElementById(
        "modalRecuerdoCantidad"
      ),

    contadorFotos:
      document.getElementById(
        "contadorFotosModal"
      ),

    fotoAnterior:
      document.getElementById(
        "fotoAnterior"
      ),

    fotoSiguiente:
      document.getElementById(
        "fotoSiguiente"
      ),

    botonCerrar:
      document.getElementById(
        "cerrarModalRecuerdo"
      ),

    botonAprobar:
      document.getElementById(
        "modalAprobar"
      ),

    botonRechazar:
      document.getElementById(
        "modalRechazar"
      ),

    botonDestacar:
      document.getElementById(
        "modalDestacar"
      )
  };


  if (!elementos.modal) {

    console.error(
      "No se encontró el modal de recuerdos."
    );

    return;

  }


  acciones = {
    alAprobar,
    alRechazar,
    alDestacar,
    alQuitarDestacado
  };


  elementos.botonCerrar
    ?.addEventListener(
      "click",
      cerrarModalRecuerdo
    );


  elementos.modal
    .querySelectorAll(
      "[data-cerrar-modal]"
    )
    .forEach(elemento => {

      elemento.addEventListener(
        "click",
        cerrarModalRecuerdo
      );

    });


  elementos.fotoAnterior
    ?.addEventListener(
      "click",
      mostrarFotoAnterior
    );


  elementos.fotoSiguiente
    ?.addEventListener(
      "click",
      mostrarFotoSiguiente
    );


  elementos.botonAprobar
    ?.addEventListener(
      "click",
      aprobarDesdeModal
    );


  elementos.botonRechazar
    ?.addEventListener(
      "click",
      rechazarDesdeModal
    );


  elementos.botonDestacar
    ?.addEventListener(
      "click",
      destacarDesdeModal
    );


  document.addEventListener(
    "keydown",
    controlarTeclado
  );

}


// ========================================
// OBTENER FOTOS
// ========================================

function obtenerFotos() {

  return Array.isArray(
    recuerdoActual?.fotos
  )
    ? recuerdoActual.fotos
    : [];

}


// ========================================
// ABRIR
// ========================================

export function abrirModalRecuerdo(
  recuerdo
) {

  if (!elementos.modal) {

    console.error(
      "El modal todavía no fue inicializado."
    );

    return;

  }

  recuerdoActual =
    recuerdo;

  indiceFotoActual = 0;

  actualizarInformacion();
  actualizarFoto();
  actualizarAcciones();

  elementos.modal.classList.add(
    "abierto"
  );

  elementos.modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add(
    "modal-abierto"
  );

}


// ========================================
// INFORMACIÓN
// ========================================

function actualizarInformacion() {

  if (!recuerdoActual) return;

  const fotos =
    obtenerFotos();

  elementos.nombre.textContent =
    recuerdoActual.nombre ||
    "Sin nombre";

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

  elementos.cantidad.textContent =
    `${fotos.length} ${
      fotos.length === 1
        ? "fotografía"
        : "fotografías"
    }`;

  actualizarEstadoVisual();

}


// ========================================
// ESTADO VISUAL
// ========================================

function actualizarEstadoVisual() {

  if (
    !recuerdoActual ||
    !elementos.estado
  ) {
    return;
  }

  let texto =
    recuerdoActual.estado ||
    "pendiente";

  if (
    recuerdoActual.estado ===
      "aprobado" &&
    recuerdoActual.destacada === true
  ) {

    texto =
      "destacado";

  }

  elementos.estado.textContent =
    texto;

  elementos.estado.className =
    "recuerdo-estado";

  if (
    texto === "aprobado" ||
    texto === "destacado"
  ) {

    elementos.estado.classList.add(
      "aprobado"
    );

  } else if (
    texto === "rechazado" ||
    texto === "oculto"
  ) {

    elementos.estado.classList.add(
      "rechazado"
    );

  } else {

    elementos.estado.classList.add(
      "pendiente"
    );

  }

}


// ========================================
// FOTOGRAFÍAS
// ========================================

function actualizarFoto() {

  const fotos =
    obtenerFotos();

  if (!fotos.length) {

    elementos.imagen.removeAttribute(
      "src"
    );

    elementos.imagen.alt =
      "El recuerdo no tiene fotografías";

    elementos.contadorFotos.textContent =
      "Sin fotografías";

    elementos.fotoAnterior.disabled =
      true;

    elementos.fotoSiguiente.disabled =
      true;

    return;

  }

  const foto =
    fotos[indiceFotoActual];

  elementos.imagen.src =
    foto?.url || "";

  elementos.imagen.alt =
    `Fotografía ${
      indiceFotoActual + 1
    } del recuerdo de ${
      recuerdoActual.nombre ||
      "la comunidad"
    }`;

  elementos.contadorFotos.textContent =
    `${indiceFotoActual + 1} / ${
      fotos.length
    }`;

  const hayVariasFotos =
    fotos.length > 1;

  elementos.fotoAnterior.disabled =
    !hayVariasFotos;

  elementos.fotoSiguiente.disabled =
    !hayVariasFotos;

}


function mostrarFotoAnterior() {

  const fotos =
    obtenerFotos();

  if (fotos.length <= 1) return;

  indiceFotoActual =
    (
      indiceFotoActual -
      1 +
      fotos.length
    ) %
    fotos.length;

  actualizarFoto();

}


function mostrarFotoSiguiente() {

  const fotos =
    obtenerFotos();

  if (fotos.length <= 1) return;

  indiceFotoActual =
    (
      indiceFotoActual +
      1
    ) %
    fotos.length;

  actualizarFoto();

}


// ========================================
// BOTONES DEL MODAL
// ========================================

function actualizarAcciones() {

  if (!recuerdoActual) return;

  const aprobado =
    recuerdoActual.estado ===
    "aprobado";

  const rechazado =
    recuerdoActual.estado ===
    "rechazado";

  const destacado =
    recuerdoActual.destacada ===
    true;


  if (elementos.botonAprobar) {

    elementos.botonAprobar.textContent =
      aprobado
        ? "Aprobado"
        : rechazado
          ? "Restaurar"
          : "Aprobar";

    elementos.botonAprobar.disabled =
      aprobado;

  }


  if (elementos.botonRechazar) {

    elementos.botonRechazar.textContent =
      aprobado
        ? "Ocultar"
        : rechazado
          ? "Rechazado"
          : "Rechazar";

    elementos.botonRechazar.disabled =
      rechazado;

  }


  if (elementos.botonDestacar) {

    elementos.botonDestacar.textContent =
      destacado
        ? "★ Quitar destacado"
        : "☆ Destacar";

    elementos.botonDestacar.disabled =
      !aprobado;

  }

}


// ========================================
// ACCIONES DE MODERACIÓN
// ========================================

async function aprobarDesdeModal() {

  if (
    !recuerdoActual ||
    typeof acciones.alAprobar !==
      "function"
  ) {
    return;
  }

  await acciones.alAprobar(
    recuerdoActual
  );

  actualizarInformacion();
  actualizarAcciones();

}


async function rechazarDesdeModal() {

  if (
    !recuerdoActual ||
    typeof acciones.alRechazar !==
      "function"
  ) {
    return;
  }

  await acciones.alRechazar(
    recuerdoActual
  );

  actualizarInformacion();
  actualizarAcciones();

}


async function destacarDesdeModal() {

  if (!recuerdoActual) return;

  if (
    recuerdoActual.destacada === true
  ) {

    if (
      typeof acciones
        .alQuitarDestacado ===
      "function"
    ) {

      await acciones
        .alQuitarDestacado(
          recuerdoActual
        );

    }

  } else {

    if (
      typeof acciones.alDestacar ===
      "function"
    ) {

      await acciones.alDestacar(
        recuerdoActual
      );

    }

  }

  actualizarInformacion();
  actualizarAcciones();

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

    cerrarModalRecuerdo();

  }

  if (evento.key === "ArrowLeft") {

    mostrarFotoAnterior();

  }

  if (evento.key === "ArrowRight") {

    mostrarFotoSiguiente();

  }

}


// ========================================
// CERRAR
// ========================================

export function cerrarModalRecuerdo() {

  if (!elementos.modal) return;

  elementos.modal.classList.remove(
    "abierto"
  );

  elementos.modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove(
    "modal-abierto"
  );

  if (elementos.imagen) {

    elementos.imagen.removeAttribute(
      "src"
    );

  }

  recuerdoActual = null;
  indiceFotoActual = 0;

}
