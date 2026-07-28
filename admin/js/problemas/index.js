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


// ========================================
// ELEMENTOS
// ========================================

const cargando =
  document.getElementById("cargando");

const contenido =
  document.getElementById("contenido");

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

      window.location.href =
        "./";

      return;

    }

    cargando.style.display =
      "none";

    contenido.style.display =
      "block";

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
