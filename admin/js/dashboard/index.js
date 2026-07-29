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
  cargarRepresentantes
} from "./sheet.js";

import {
  cargarPerfilAdmin
} from "./perfil.js";

import {
  obtenerTotalRepresentantes,
  obtenerPapelitosConfirmados,
  obtenerGafetesEnviados,
  obtenerTotalProblemas
} from "./estadisticas.js";


// ========================================
// ELEMENTOS
// ========================================

const cargando =
  document.getElementById("cargando");

const contenido =
  document.getElementById("contenido");

const nombreAdmin =
  document.getElementById("nombreAdmin");

const logoutButton =
  document.getElementById("logoutButton");

const themeToggle =
  document.getElementById("themeToggle");

const totalRepresentantes =
  document.getElementById(
    "totalRepresentantes"
  );

const papelitosConfirmados =
  document.getElementById(
    "papelitosConfirmados"
  );

const gafetesEnviados =
  document.getElementById(
    "gafetesEnviados"
  );

const totalProblemas =
  document.getElementById(
    "totalProblemas"
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
// MOSTRAR ESTADÍSTICAS DEL SHEET
// ========================================

function mostrarEstadisticasSheet(
  representantes
) {

  totalRepresentantes.textContent =
    obtenerTotalRepresentantes(
      representantes
    );

  papelitosConfirmados.textContent =
    obtenerPapelitosConfirmados(
      representantes
    );

  totalProblemas.textContent =
    obtenerTotalProblemas(
      representantes
    );

}


// ========================================
// MOSTRAR ERROR DEL SHEET
// ========================================

function mostrarErrorSheet() {

  totalRepresentantes.textContent =
    "—";

  papelitosConfirmados.textContent =
    "—";

  totalProblemas.textContent =
    "—";

}


// ========================================
// CARGAR GAFETES
// ========================================

async function cargarEstadisticaGafetes() {

  try {

    gafetesEnviados.textContent =
      await obtenerGafetesEnviados();

  }

  catch (error) {

    console.error(
      "Error contando gafetes enviados:",
      error
    );

    gafetesEnviados.textContent =
      "—";

  }

}


// ========================================
// CARGAR DASHBOARD
// ========================================

async function cargarDashboard(user) {

  const nombre =
    await cargarPerfilAdmin(
      user
    );

  nombreAdmin.textContent =
    nombre;

  try {

    /*
      El Sheet se descarga una sola vez.

      De ahí se calculan:
      - representantes
      - papelitos
      - problemas
    */

    const representantes =
      await cargarRepresentantes();

    mostrarEstadisticasSheet(
      representantes
    );

  }

  catch (error) {

    console.error(
      "Error cargando datos del Sheet:",
      error
    );

    mostrarErrorSheet();

  }

  await cargarEstadisticaGafetes();

}


// ========================================
// VERIFICAR SESIÓN
// ========================================

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      window.location.href =
        "./";

      return;

    }

    try {

      await cargarDashboard(
        user
      );

    }

    catch (error) {

      console.error(
        "Error cargando dashboard:",
        error
      );

    }

    cargando.remove();

  }
);


// ========================================
// CERRAR SESIÓN
// ========================================

logoutButton.addEventListener(
  "click",
  async () => {

    try {

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
