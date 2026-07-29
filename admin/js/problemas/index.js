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
  obtenerRepresentantes
} from "./datos.js";

import {
  detectarProblemas
} from "./detector.js";

import {
  mostrarProblemas
} from "./render.js";

import {
  iniciarFiltros
} from "./filtros.js";

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
    
const logoutButton =
  document.getElementById("logoutButton");

const themeToggle =
  document.getElementById("themeToggle");

const totalProblemas =
  document.getElementById("totalProblemas");

const filtroTipo =
  document.getElementById("filtroTipo");

const busquedaProblema =
  document.getElementById("busquedaProblema");

const limpiarFiltros =
  document.getElementById("limpiarFiltros");

const contadorResultados =
  document.getElementById("contadorResultados");

const cargandoProblemas =
  document.getElementById("cargandoProblemas");

const sinProblemas =
  document.getElementById("sinProblemas");

const listaProblemas =
  document.getElementById("listaProblemas");


// ========================================
// VARIABLES
// ========================================

let problemas = [];


// ========================================
// TEMA
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

    cargando.style.display =
      "none";

  }

  if (contenido) {

    contenido.style.display =
      "block";

  }

}


// ========================================
// MOSTRAR RESULTADOS
// ========================================

function mostrarResultados(
  resultados
) {

  mostrarProblemas({

    resultados,

    cargandoProblemas,

    sinProblemas,

    listaProblemas,

    contadorResultados

  });

}


// ========================================
// CARGAR DATOS
// ========================================

async function cargarDatos() {

  cargandoProblemas.style.display =
    "block";

  cargandoProblemas.textContent =
    "Analizando registros...";

  listaProblemas.style.display =
    "none";

  sinProblemas.style.display =
    "none";


  try {

    const representantes =
      await obtenerRepresentantes();

    problemas =
      detectarProblemas(
        representantes
      );

    totalProblemas.textContent =
      problemas.length;

    mostrarResultados(
      problemas
    );

  }

  catch (error) {

    console.error(error);

    totalProblemas.textContent =
      "—";

    contadorResultados.textContent =
      "—";

    cargandoProblemas.style.display =
      "block";

    cargandoProblemas.textContent =
      "No se pudo analizar la lista.";

  }

}


// ========================================
// FILTROS
// ========================================

iniciarFiltros({

  filtroTipo,

  busquedaProblema,

  limpiarFiltros,

  obtenerProblemas() {

    return problemas;

  },

  mostrarResultados

});


// ========================================
// SESIÓN
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

    /*
      La interfaz aparece inmediatamente
      al confirmar que existe sesión.

      El análisis de registros continúa
      dentro de la página.
    */

    mostrarInterfaz();
try {

  const nombre =
    await cargarPerfilAdmin(user);

  if (nombreAdmin) {

    nombreAdmin.textContent =
      nombre;

  }

}

catch (error) {

  console.error(
    "Error cargando perfil:",
    error
  );

}
    await cargarDatos();

  }
);


// ========================================
// CERRAR SESIÓN
// ========================================

logoutButton.addEventListener(
  "click",
  async () => {

    try {

      sessionStorage.removeItem(
        "accesoAdmin"
      );

      await signOut(auth);

      window.location.href =
        "./";

    }

    catch (error) {

      console.error(
        "No se pudo cerrar la sesión:",
        error
      );

    }

  }
);
