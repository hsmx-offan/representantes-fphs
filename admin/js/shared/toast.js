// ========================================
// NOTIFICACIONES TOAST
// ========================================

export function crearToastController({
  toast,
  duracion = 2200
}) {

  let temporizador = null;

  function mostrarToast(mensaje) {

    if (!toast) {
      return;
    }

    window.clearTimeout(
      temporizador
    );

    toast.textContent =
      mensaje;

    toast.classList.add(
      "visible"
    );

    temporizador =
      window.setTimeout(
        () => {

          toast.classList.remove(
            "visible"
          );

        },
        duracion
      );

  }

  function ocultarToast() {

    if (!toast) {
      return;
    }

    window.clearTimeout(
      temporizador
    );

    toast.classList.remove(
      "visible"
    );

  }

  return {
    mostrarToast,
    ocultarToast
  };

}
