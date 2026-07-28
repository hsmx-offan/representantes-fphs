// ========================================
// IMPORTS
// ========================================

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  auth,
  db
} from "../shared/firebase.js";

import {
  parsearCSV,
  normalizarTexto,
  crearClavePapelitos,
  escaparHTML
} from "../shared/utils.js";

import {
  crearToastController
} from "../shared/toast.js";

import {
  crearTemaController
} from "../shared/tema.js";

import {
  configurarCopiado
} from "./copiar.js";

import {
  configurarFicha,
  formatearFechaConfirmacion
} from "./ficha.js";

import {
  crearPapelitosController
} from "./papelitos.js";

import {
  crearTablaController
} from "./tabla.js";

import {
  crearFiltrosController
} from "./filtros.js";

import {
  crearPdfController
} from "./pdf.js";


// ========================================
// CONFIGURACIÓN
// ========================================

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmA9mpebsNjPcTYMsklHNKShcPVEdU_xTkn-oHVjqil9SP1KrjPO8V1lEqxqnY-dna2IJY0BOUvg-/pub?gid=77234656&single=true&output=csv";

const PAPELITOS_API_URL =
  "https://script.google.com/macros/s/AKfycbz1nbly2DHBiw5NiVW0s0MiQYX-s2hUQEbpcR_mGCHcL2JIwV1I53nZCwjvCrO8SzNC7g/exec";


// ========================================
// ELEMENTOS DEL HTML
// ========================================

const elementos = {
  cargando:
    document.getElementById("cargando"),

  contenido:
    document.getElementById("contenido"),

  logoutButton:
    document.getElementById("logoutButton"),

  themeToggle:
    document.getElementById("themeToggle"),

  toast:
    document.getElementById("toast"),

  busqueda:
    document.getElementById("busqueda"),

  filtroFecha:
    document.getElementById("filtroFecha"),

  filtroZona:
    document.getElementById("filtroZona"),

  buscarButton:
    document.getElementById("buscarButton"),

  limpiarFiltrosButton:
    document.getElementById("limpiarFiltros"),

  contadorResultados:
    document.getElementById("contadorResultados"),

  estadoInicial:
    document.getElementById("estadoInicial"),

  cargandoResultados:
    document.getElementById("cargandoResultados"),

  sinResultados:
    document.getElementById("sinResultados"),

  contenedorTabla:
    document.getElementById("contenedorTabla"),

  tablaRepresentantes:
    document.getElementById("tablaRepresentantes"),

  fichaRepresentante:
    document.getElementById("fichaRepresentante"),

  fichaNombre:
    document.getElementById("fichaNombre"),

  fichaInstagram:
    document.getElementById("fichaInstagram"),

  fichaId:
    document.getElementById("fichaId"),

  fichaFecha:
    document.getElementById("fichaFecha"),

  fichaZona:
    document.getElementById("fichaZona"),

  fichaGafete:
    document.getElementById("fichaGafete"),

  cerrarFicha:
    document.getElementById("cerrarFicha"),

  copiarDatos:
    document.getElementById("copiarDatos"),

  irAGafete:
    document.getElementById("irAGafete"),

  estadoPapelitos:
    document.getElementById("estadoPapelitos"),

  detallePapelitos:
    document.getElementById("detallePapelitos"),

  cambiarPapelitos:
    document.getElementById("cambiarPapelitos"),

  copiarLista:
    document.getElementById("copiarLista"),

  descargarLista:
    document.getElementById("descargarLista"),

  logoPdf:
    document.getElementById("logoPdf")
};


// ========================================
// ESTADO
// ========================================

let representantes = [];
let resultadosActuales = [];
let representanteSeleccionado = null;


// ========================================
// TEMA
// ========================================

const temaController =
  crearTemaController({
    botonTema:
      elementos.themeToggle
  });

temaController.iniciarTema();


// ========================================
// TOAST
// ========================================

const {
  mostrarToast
} = crearToastController({
  toast:
    elementos.toast
});


// ========================================
// CONSULTAR GAFETE
// ========================================

async function consultarGafete(id) {

  const referencia =
    doc(
      db,
      "gafetes",
      id
    );

  const documento =
    await getDoc(
      referencia
    );

  return (
    documento.exists() &&
    documento.data().enviado === true
  );

}


// ========================================
// PAPELITOS
// ========================================

const papelitosController =
  crearPapelitosController({
    auth,

    apiUrl:
      PAPELITOS_API_URL,

    tablaRepresentantes:
      elementos.tablaRepresentantes,

    estadoPapelitos:
      elementos.estadoPapelitos,

    detallePapelitos:
      elementos.detallePapelitos,

    cambiarPapelitos:
      elementos.cambiarPapelitos,

    crearClavePapelitos,
    normalizarTexto,
    mostrarToast,
    formatearFechaConfirmacion,

    obtenerRepresentanteSeleccionado:
      () =>
        representanteSeleccionado
  });


// ========================================
// FICHA
// ========================================

const abrirFicha =
  configurarFicha({
    fichaRepresentante:
      elementos.fichaRepresentante,

    fichaNombre:
      elementos.fichaNombre,

    fichaInstagram:
      elementos.fichaInstagram,

    fichaId:
      elementos.fichaId,

    fichaFecha:
      elementos.fichaFecha,

    fichaZona:
      elementos.fichaZona,

    fichaGafete:
      elementos.fichaGafete,

    estadoPapelitos:
      elementos.estadoPapelitos,

    detallePapelitos:
      elementos.detallePapelitos,

    cambiarPapelitos:
      elementos.cambiarPapelitos,

    cerrarFicha:
      elementos.cerrarFicha,

    irAGafete:
      elementos.irAGafete,

    consultarGafete,

    mostrarEstadoPapelitos:
      papelitosController
        .mostrarEstadoPapelitos,

    obtenerRepresentanteSeleccionado:
      () =>
        representanteSeleccionado,

    establecerRepresentanteSeleccionado:
      representante => {

        representanteSeleccionado =
          representante;

      },

    establecerPapelitosSeleccionado:
      valor => {

        if (valor === null) {

          papelitosController
            .limpiarSeleccion();

        }

      }
  });


// ========================================
// TABLA
// ========================================

const tablaController =
  crearTablaController({
    tablaRepresentantes:
      elementos.tablaRepresentantes,

    contenedorTabla:
      elementos.contenedorTabla,

    contadorResultados:
      elementos.contadorResultados,

    cargandoResultados:
      elementos.cargandoResultados,

    estadoInicial:
      elementos.estadoInicial,

    sinResultados:
      elementos.sinResultados,

    fichaRepresentante:
      elementos.fichaRepresentante,

    escaparHTML,

    obtenerPapelitos:
      papelitosController
        .obtenerPapelitos,

    consultarGafete,
    abrirFicha,

    establecerResultadosActuales:
      resultados => {

        resultadosActuales =
          resultados;

      },

    limpiarSeleccion:
      () => {

        representanteSeleccionado =
          null;

        papelitosController
          .limpiarSeleccion();

      }
  });


// ========================================
// FILTROS
// ========================================

const filtrosController =
  crearFiltrosController({
    representantes:
      () =>
        representantes,

    busqueda:
      elementos.busqueda,

    filtroFecha:
      elementos.filtroFecha,

    filtroZona:
      elementos.filtroZona,

    mostrarResultados:
      tablaController
        .mostrarResultados,

    normalizarTexto
  });


// ========================================
// COPIAR
// ========================================

configurarCopiado({
  copiarDatos:
    elementos.copiarDatos,

  copiarLista:
    elementos.copiarLista,

  busqueda:
    elementos.busqueda,

  filtroFecha:
    elementos.filtroFecha,

  filtroZona:
    elementos.filtroZona,

  obtenerRepresentanteSeleccionado:
    () =>
      representanteSeleccionado,

  obtenerResultadosActuales:
    () =>
      resultadosActuales,

  mostrarToast
});


// ========================================
// PDF
// ========================================

const pdfController =
  crearPdfController({
    botonDescargar:
      elementos.descargarLista,

    logoPdf:
      elementos.logoPdf,

    busqueda:
      elementos.busqueda,

    filtroFecha:
      elementos.filtroFecha,

    filtroZona:
      elementos.filtroZona,

    obtenerResultadosActuales:
      () =>
        resultadosActuales,

    obtenerPapelitos:
      papelitosController
        .obtenerPapelitos,

    mostrarToast
  });

pdfController.iniciarPDF();


// ========================================
// CONVERTIR FILAS DEL SHEET
// ========================================

function convertirRepresentantes(filas) {

  return filas
    .filter(
      fila =>
        String(fila[0] || "")
          .trim()
          .toUpperCase()
          .startsWith(
            "FPHS-MX-"
          )
    )
    .map(
      fila => ({
        id:
          String(
            fila[0] || ""
          ).trim(),

        fecha:
          String(
            fila[1] || ""
          ).trim(),

        zona:
          String(
            fila[2] || ""
          ).trim(),

        nombre:
          String(
            fila[3] || ""
          ).trim(),

        instagram:
          String(
            fila[4] || ""
          ).trim(),

        estado:
          String(
            fila[9] || ""
          ).trim()
      })
    );

}


// ========================================
// RESULTADOS INICIALES
// ========================================

function mostrarResultadosIniciales() {

  const parametros =
    new URLSearchParams(
      window.location.search
    );

  const busquedaRecibida =
    parametros.get(
      "buscar"
    );

  if (busquedaRecibida) {

    elementos.busqueda.value =
      busquedaRecibida;

    filtrosController
      .aplicarFiltros();

    return;

  }

  tablaController
    .mostrarResultados(
      representantes
    );

}


// ========================================
// MOSTRAR ERROR
// ========================================

function mostrarErrorCarga() {

  elementos.cargandoResultados.style.display =
    "none";

  elementos.contenedorTabla.style.display =
    "none";

  elementos.sinResultados.style.display =
    "block";

  const titulo =
    elementos.sinResultados
      .querySelector(
        "strong"
      );

  const texto =
    elementos.sinResultados
      .querySelector(
        "p"
      );

  if (titulo) {

    titulo.textContent =
      "No se pudo cargar la lista";

  }

  if (texto) {

    texto.textContent =
      "Intenta recargar la página.";

  }

}


// ========================================
// CARGAR REPRESENTANTES
// ========================================

async function cargarRepresentantes() {

  elementos.estadoInicial.style.display =
    "none";

  elementos.cargandoResultados.style.display =
    "block";

  elementos.sinResultados.style.display =
    "none";

  elementos.contenedorTabla.style.display =
    "none";

  try {

    const respuesta =
      await fetch(
        `${SHEET_URL}&t=${Date.now()}`
      );

    if (!respuesta.ok) {

      throw new Error(
        "No se pudo leer Google Sheets."
      );

    }

    const csv =
      await respuesta.text();

    representantes =
      convertirRepresentantes(
        parsearCSV(csv)
      );

    try {

      await papelitosController
        .cargarPapelitos();

    }

    catch (error) {

      console.error(
        "Error cargando papelitos:",
        error
      );

      mostrarToast(
        "No se pudo cargar el control de papelitos"
      );

    }

    filtrosController
      .cargarOpcionesFiltros();

    mostrarResultadosIniciales();

  }

  catch (error) {

    console.error(
      "Error cargando representantes:",
      error
    );

    mostrarErrorCarga();

  }

}


// ========================================
// EVENTOS DE FILTROS
// ========================================

elementos.buscarButton
  ?.addEventListener(
    "click",
    filtrosController.aplicarFiltros
  );


elementos.busqueda
  ?.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {

        filtrosController
          .aplicarFiltros();

      }

    }
  );


elementos.filtroFecha
  ?.addEventListener(
    "change",
    filtrosController.aplicarFiltros
  );


elementos.filtroZona
  ?.addEventListener(
    "change",
    filtrosController.aplicarFiltros
  );


elementos.limpiarFiltrosButton
  ?.addEventListener(
    "click",
    filtrosController.limpiarFiltros
  );


// ========================================
// CERRAR SESIÓN
// ========================================

elementos.logoutButton
  ?.addEventListener(
    "click",
    async () => {

      try {

        await signOut(auth);

        window.location.href =
          "./";

      }

      catch (error) {

        console.error(
          "Error cerrando sesión:",
          error
        );

        mostrarToast(
          "No se pudo cerrar la sesión"
        );

      }

    }
  );


// ========================================
// VERIFICAR SESIÓN
// ========================================

onAuthStateChanged(
  auth,
  async usuario => {

    if (!usuario) {

      window.location.href =
        "./";

      return;

    }

    elementos.cargando.style.display =
      "none";

    elementos.contenido.style.display =
      "block";

    await cargarRepresentantes();

  }
);
