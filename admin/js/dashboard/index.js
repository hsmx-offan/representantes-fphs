import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  auth
} from "../shared/firebase.js";

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
  document.getElementById("totalRepresentantes");

const papelitosConfirmados =
  document.getElementById("papelitosConfirmados");

const gafetesEnviados =
  document.getElementById("gafetesEnviados");

const totalProblemas =
  document.getElementById("totalProblemas");


// ========================================
// TEMA
// ========================================

function aplicarTema(tema) {

  document.documentElement.setAttribute(
    "data-theme",
    tema
  );

  themeToggle.textContent =
    tema === "dark"
      ? "☀️"
      : "🌙";

}

const temaGuardado =
  localStorage.getItem("temaAdmin")
  || "dark";

aplicarTema(
  temaGuardado
);

themeToggle.addEventListener(
  "click",
  () => {

    const actual =
      document.documentElement.getAttribute(
        "data-theme"
      );

    const nuevo =
      actual === "dark"
        ? "light"
        : "dark";

    aplicarTema(
      nuevo
    );

    localStorage.setItem(
      "temaAdmin",
      nuevo
    );

  }
);


// ========================================
// DASHBOARD
// ========================================

async function cargarDashboard(user) {

  nombreAdmin.textContent =
    await cargarPerfilAdmin(user);

  const representantes =
    await cargarRepresentantes();

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

  try {

    gafetesEnviados.textContent =
      await obtenerGafetesEnviados();

  }

  catch (error) {

    console.error(error);

    gafetesEnviados.textContent =
      "—";

  }

}


// ========================================
// SESIÓN
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

      console.error(error);

    }

    cargando.style.display =
      "none";

    contenido.style.display =
      "block";

  }
);


// ========================================
// CERRAR SESIÓN
// ========================================

logoutButton.addEventListener(
  "click",
  async () => {

    await signOut(auth);

    window.location.href =
      "./";

  }
);
