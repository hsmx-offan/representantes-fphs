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
  document.getElementById("cargando");

const contenido =
  document.getElementById("contenido");

const nombreAdmin =
  document.getElementById("nombreAdmin");

const themeToggle =
  document.getElementById("themeToggle");

const logoutButton =
  document.getElementById("logoutButton");

const cargandoMateriales =
  document.getElementById("cargandoMateriales");

const listaMateriales =
  document.getElementById("listaMateriales");

const sinResultados =
  document.getElementById("sinResultados");

const errorMateriales =
  document.getElementById("errorMateriales");

const contadorResultados =
  document.getElementById("contadorResultados");


// ========================================
// TEMA COMPARTIDO
// ========================================

crearTemaController({
  botonTema: themeToggle
}).iniciarTema();


// ========================================
// MOSTRAR INTERFAZ
// ========================================

function mostrarInterfaz() {

  sessionStorage.setItem(
    "accesoAdmin",
    "1"
  );

  if (cargando) {
    cargando.style.display = "none";
  }

  if (contenido) {
    contenido.style.display = "block";
  }

}


// ========================================
// ESTADO INICIAL DE MATERIALES
// ========================================

function mostrarEstadoInicial() {

  if (cargandoMateriales) {
    cargandoMateriales.style.display = "block";
  }

  if (listaMateriales) {
    listaMateriales.style.display = "none";
  }

  if (sinResultados) {
    sinResultados.style.display = "none";
  }

  if (errorMateriales) {
    errorMateriales.style.display = "none";
  }

  if (contadorResultados) {
    contadorResultados.textContent =
      "Cargando materiales...";
  }

}


// ========================================
// AUTENTICACIÓN
// ========================================

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      sessionStorage.removeItem(
        "accesoAdmin"
      );

      window.location.replace(
        "../login.html"
      );

      return;

    }

    mostrarInterfaz();
    mostrarEstadoInicial();

    try {

      const nombre =
        await cargarPerfilAdmin(user);

      if (nombreAdmin) {
        nombreAdmin.textContent = nombre;
      }

    }

    catch (error) {

      console.error(
        "Error cargando el perfil:",
        error
      );

      if (nombreAdmin) {
        nombreAdmin.textContent = "Admin";
      }

    }

    /*
      Después conectaremos aquí:

      1. La carga de materiales desde Google Sheets.
      2. El render de las tarjetas.
      3. Los filtros y el buscador.
    */

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

        await signOut(auth);

        window.location.replace(
          "../login.html"
        );

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
