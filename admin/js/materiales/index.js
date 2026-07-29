import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  auth
} from "../shared/firebase.js";

import {
  crearTemaController
} from "../shared/tema.js";

import {
  cargarPerfilAdmin
} from "../dashboard/perfil.js";


// ========================================
// ELEMENTOS
// ========================================

const cargando =
  document.getElementById(
    "cargando"
  );

const contenido =
  document.getElementById(
    "contenido"
  );

const nombreAdmin =
  document.getElementById(
    "nombreAdmin"
  );

const logoutButton =
  document.getElementById(
    "logoutButton"
  );

const themeToggle =
  document.getElementById(
    "themeToggle"
  );

const cargandoMateriales =
  document.getElementById(
    "cargandoMateriales"
  );

const listaMateriales =
  document.getElementById(
    "listaMateriales"
  );

const sinResultados =
  document.getElementById(
    "sinResultados"
  );

const errorMateriales =
  document.getElementById(
    "errorMateriales"
  );

const contadorResultados =
  document.getElementById(
    "contadorResultados"
  );


// ========================================
// TEMA COMPARTIDO
// ========================================

const temaController =
  crearTemaController({
    botonTema: themeToggle
  });

temaController.iniciarTema();


// ========================================
// MOSTRAR INTERFAZ
// ========================================

function mostrarInterfaz() {

  sessionStorage.setItem(
    "accesoAdmin",
    "1"
  );

  if (cargando) {
    cargando.remove();
  }

  if (contenido) {
    contenido.style.display =
      "block";
  }

}


// ========================================
// ESTADO INICIAL
// ========================================

function mostrarEstadoInicial() {

  if (cargandoMateriales) {
    cargandoMateriales.style.display =
      "block";
  }

  if (listaMateriales) {
    listaMateriales.style.display =
      "none";
  }

  if (sinResultados) {
    sinResultados.style.display =
      "none";
  }

  if (errorMateriales) {
    errorMateriales.style.display =
      "none";
  }

  if (contadorResultados) {
    contadorResultados.textContent =
      "Cargando materiales...";
  }

}


// ========================================
// CARGAR PÁGINA
// ========================================

async function cargarPaginaMateriales(
  user
) {

  const nombre =
    await cargarPerfilAdmin(
      user
    );

  if (nombreAdmin) {
    nombreAdmin.textContent =
      nombre;
  }

  mostrarEstadoInicial();

  /*
    Después conectaremos aquí:

    - carga de materiales;
    - tarjetas;
    - buscador;
    - filtros.
  */

}


// ========================================
// VERIFICAR SESIÓN
// ========================================

onAuthStateChanged(
  auth,
  async user => {

    if (!user) {

      sessionStorage.removeItem(
        "accesoAdmin"
      );

      window.location.href =
        "./";

      return;

    }

    mostrarInterfaz();

    try {

      await cargarPaginaMateriales(
        user
      );

    }

    catch (error) {

      console.error(
        "Error cargando Materiales:",
        error
      );

      if (nombreAdmin) {
        nombreAdmin.textContent =
          "Admin";
      }

      if (cargandoMateriales) {
        cargandoMateriales.style.display =
          "none";
      }

      if (errorMateriales) {
        errorMateriales.style.display =
          "block";
      }

      if (contadorResultados) {
        contadorResultados.textContent =
          "No disponible";
      }

    }

  }
);


// ========================================
// CERRAR SESIÓN
// ========================================

if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    async () => {

      try {

        sessionStorage.removeItem(
          "accesoAdmin"
        );

        await signOut(
          auth
        );

        window.location.href =
          "./";

      }

      catch (error) {

        console.error(
          "Error cerrando sesión:",
          error
        );

      }

    }
  );

}
