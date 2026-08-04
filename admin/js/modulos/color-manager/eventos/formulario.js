/* ========================================
   COLOR MANAGER
   FORMULARIO DE EVENTOS
   ======================================== */


// ========================================
// CREAR CONTROLADOR DEL FORMULARIO
// ========================================

export function crearFormularioEventos({

  elementosModal,

  camposEvento,

  obtenerEventoPorId,

  mostrarToast

}) {

  let guardando =
    false;


  // ======================================
  // VALIDAR ELEMENTOS
  // ======================================

  if (
    !elementosModal ||
    !camposEvento
  ) {

    throw new Error(
      "No se recibieron los elementos del formulario de eventos."
    );

  }


  // ======================================
  // LIMPIAR FORMULARIO
  // ======================================

  function limpiarFormulario() {

    elementosModal.formulario.reset();


    camposEvento.id.value =
      "";

    camposEvento.anio.value =
      new Date().getFullYear();

    camposEvento.activo.checked =
      false;

  }


  // ======================================
  // OBTENER DATOS
  // ======================================

  function obtenerDatos() {

    return {

      id:
        camposEvento.id.value.trim(),

      nombre:
        camposEvento.nombre.value.trim(),

      anio:
        Number(
          camposEvento.anio.value
        ),

      ciudad:
        camposEvento.ciudad.value.trim(),

      pais:
        camposEvento.pais.value.trim(),

      activo:
        camposEvento.activo.checked

    };

  }


  // ======================================
  // VALIDAR DATOS
  // ======================================

  function validarDatos(
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
      datos.anio < 2026
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


  // ======================================
  // LLENAR FORMULARIO
  // ======================================

  function llenarFormulario(
    evento
  ) {

    camposEvento.id.value =
      evento.id || "";

    camposEvento.nombre.value =
      evento.nombre || "";

    camposEvento.anio.value =
      evento.anio || "";

    camposEvento.ciudad.value =
      evento.ciudad || "";

    camposEvento.pais.value =
      evento.pais || "";

    camposEvento.activo.checked =
      evento.activo === true;

  }


  // ======================================
  // MOSTRAR MODAL
  // ======================================

  function mostrarModal() {

    elementosModal.modal.hidden =
      false;

    document.body.classList.add(
      "modal-abierto"
    );


    setTimeout(
      () => {

        camposEvento.nombre.focus();

      },
      50
    );

  }


  // ======================================
  // ABRIR NUEVO
  // ======================================

  function abrirNuevo() {

    if (
      guardando
    ) {

      return;

    }


    limpiarFormulario();


    elementosModal.titulo.textContent =
      "Crear nueva edición";

    elementosModal.guardar.textContent =
      "Guardar edición";


    mostrarModal();

  }


  // ======================================
  // ABRIR EDICIÓN
  // ======================================

  function abrirEdicion(
    eventoId
  ) {

    if (
      guardando
    ) {

      return;

    }


    const evento =
      typeof obtenerEventoPorId ===
        "function"
        ? obtenerEventoPorId(
            eventoId
          )
        : null;


    if (
      !evento
    ) {

      if (
        typeof mostrarToast ===
        "function"
      ) {

        mostrarToast(
          "No se encontró la edición"
        );

      }

      return;

    }


    limpiarFormulario();

    llenarFormulario(
      evento
    );


    elementosModal.titulo.textContent =
      "Editar edición";

    elementosModal.guardar.textContent =
      "Guardar cambios";


    mostrarModal();

  }


  // ======================================
  // CERRAR MODAL
  // ======================================

  function cerrar() {

    if (
      guardando
    ) {

      return;

    }


    elementosModal.modal.hidden =
      true;

    document.body.classList.remove(
      "modal-abierto"
    );

    limpiarFormulario();

  }


  // ======================================
  // CAMBIAR ESTADO DE GUARDADO
  // ======================================

  function establecerGuardando({

    valor,

    esEdicion = false

  }) {

    guardando =
      valor === true;


    elementosModal.guardar.disabled =
      guardando;

    elementosModal.cerrar.disabled =
      guardando;

    elementosModal.cancelar.disabled =
      guardando;


    if (
      guardando
    ) {

      elementosModal.guardar.textContent =
        esEdicion
          ? "Guardando cambios..."
          : "Creando edición...";

      return;

    }


    elementosModal.guardar.textContent =
      esEdicion
        ? "Guardar cambios"
        : "Guardar edición";

  }


  // ======================================
  // CONSULTAR ESTADO
  // ======================================

  function estaGuardando() {

    return guardando;

  }


  // ======================================
  // EVENTOS DEL MODAL
  // ======================================

  function manejarEscape(
    evento
  ) {

    if (
      evento.key === "Escape" &&
      !elementosModal.modal.hidden
    ) {

      cerrar();

    }

  }


  function registrarEventos() {

    elementosModal.cerrar.addEventListener(
      "click",
      cerrar
    );


    elementosModal.cancelar.addEventListener(
      "click",
      cerrar
    );


    elementosModal.fondo.addEventListener(
      "click",
      cerrar
    );


    document.addEventListener(
      "keydown",
      manejarEscape
    );

  }


  // ======================================
  // INICIAR
  // ======================================

  registrarEventos();


  return {

    abrirNuevo,

    abrirEdicion,

    cerrar,

    obtenerDatos,

    validarDatos,

    establecerGuardando,

    estaGuardando

  };

}
