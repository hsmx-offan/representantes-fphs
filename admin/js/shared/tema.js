// ========================================
// TEMA CLARO / OSCURO
// ========================================

export function crearTemaController({
  botonTema,
  claveStorage = "temaAdmin",
  temaInicial = "dark"
}) {

  function aplicarTema(tema) {

    document.documentElement.setAttribute(
      "data-theme",
      tema
    );

    if (botonTema) {

      botonTema.textContent =
        tema === "dark"
          ? "☀️"
          : "🌙";

    }

  }


  function obtenerTemaGuardado() {

    return (
      localStorage.getItem(
        claveStorage
      ) || temaInicial
    );

  }


  function cambiarTema() {

    const temaActual =
      document.documentElement.getAttribute(
        "data-theme"
      );


    const nuevoTema =
      temaActual === "dark"
        ? "light"
        : "dark";


    aplicarTema(
      nuevoTema
    );


    localStorage.setItem(
      claveStorage,
      nuevoTema
    );

  }


  function iniciarTema() {

    aplicarTema(
      obtenerTemaGuardado()
    );


    if (botonTema) {

      botonTema.addEventListener(
        "click",
        cambiarTema
      );

    }

  }


  return {
    aplicarTema,
    cambiarTema,
    iniciarTema
  };

}
