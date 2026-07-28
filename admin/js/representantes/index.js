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


// ========================================
// GOOGLE SHEETS / APPS SCRIPT
// ========================================

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmA9mpebsNjPcTYMsklHNKShcPVEdU_xTkn-oHVjqil9SP1KrjPO8V1lEqxqnY-dna2IJY0BOUvg-/pub?gid=77234656&single=true&output=csv";

const PAPELITOS_API_URL =
  "https://script.google.com/macros/s/AKfycbz1nbly2DHBiw5NiVW0s0MiQYX-s2hUQEbpcR_mGCHcL2JIwV1I53nZCwjvCrO8SzNC7g/exec";


// ========================================
// ELEMENTOS GENERALES
// ========================================

const cargando =
  document.getElementById(
    "cargando"
  );

const contenido =
  document.getElementById(
    "contenido"
  );

const logoutButton =
  document.getElementById(
    "logoutButton"
  );

const themeToggle =
  document.getElementById(
    "themeToggle"
  );

const toast =
  document.getElementById(
    "toast"
  );


// ========================================
// ELEMENTOS DE FILTROS
// ========================================

const busqueda =
  document.getElementById(
    "busqueda"
  );

const filtroFecha =
  document.getElementById(
    "filtroFecha"
  );

const filtroZona =
  document.getElementById(
    "filtroZona"
  );

const buscarButton =
  document.getElementById(
    "buscarButton"
  );

const limpiarFiltrosButton =
  document.getElementById(
    "limpiarFiltros"
  );


// ========================================
// ELEMENTOS DE RESULTADOS
// ========================================

const contadorResultados =
  document.getElementById(
    "contadorResultados"
  );

const estadoInicial =
  document.getElementById(
    "estadoInicial"
  );

const cargandoResultados =
  document.getElementById(
    "cargandoResultados"
  );

const sinResultados =
  document.getElementById(
    "sinResultados"
  );

const contenedorTabla =
  document.getElementById(
    "contenedorTabla"
  );

const tablaRepresentantes =
  document.getElementById(
    "tablaRepresentantes"
  );


// ========================================
// ELEMENTOS DE FICHA
// ========================================

const fichaRepresentante =
  document.getElementById(
    "fichaRepresentante"
  );

const fichaNombre =
  document.getElementById(
    "fichaNombre"
  );

const fichaInstagram =
  document.getElementById(
    "fichaInstagram"
  );

const fichaId =
  document.getElementById(
    "fichaId"
  );

const fichaFecha =
  document.getElementById(
    "fichaFecha"
  );

const fichaZona =
  document.getElementById(
    "fichaZona"
  );

const fichaGafete =
  document.getElementById(
    "fichaGafete"
  );

const cerrarFicha =
  document.getElementById(
    "cerrarFicha"
  );

const copiarDatos =
  document.getElementById(
    "copiarDatos"
  );

const irAGafete =
  document.getElementById(
    "irAGafete"
  );


// ========================================
// ELEMENTOS DE PAPELITOS
// ========================================

const estadoPapelitos =
  document.getElementById(
    "estadoPapelitos"
  );

const detallePapelitos =
  document.getElementById(
    "detallePapelitos"
  );

const cambiarPapelitos =
  document.getElementById(
    "cambiarPapelitos"
  );


// ========================================
// ELEMENTOS DE LISTA Y PDF
// ========================================

const copiarLista =
  document.getElementById(
    "copiarLista"
  );

const descargarLista =
  document.getElementById(
    "descargarLista"
  );

const logoPdf =
  document.getElementById(
    "logoPdf"
  );


// ========================================
// ESTADO GENERAL
// ========================================

let representantes = [];

let resultadosActuales = [];

let representanteSeleccionado =
  null;


// ========================================
// UTILIDADES
// ========================================

function normalizarTexto(
  texto
) {

  return String(
    texto || ""
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .trim()
    .toLowerCase();

}


function crearClavePapelitos(
  id,
  fecha,
  zona
) {

  return [
    normalizarTexto(id),
    normalizarTexto(fecha),
    normalizarTexto(zona)
  ].join("|");

}


function escaparHTML(
  texto
) {

  return String(
    texto || ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


function mostrarToast(
  mensaje
) {

  if (!toast) {
    return;
  }

  toast.textContent =
    mensaje;

  toast.classList.add(
    "visible"
  );

  window.setTimeout(
    () => {

      toast.classList.remove(
        "visible"
      );

    },
    2200
  );

}


// ========================================
// PARSEAR CSV
// ========================================

function parsearCSV(
  texto
) {

  const filas = [];

  let fila = [];
  let campo = "";
  let dentroComillas = false;


  for (
    let i = 0;
    i < texto.length;
    i++
  ) {

    const caracter =
      texto[i];

    const siguiente =
      texto[i + 1];


    if (
      caracter === '"' &&
      dentroComillas &&
      siguiente === '"'
    ) {

      campo += '"';

      i++;

    }

    else if (
      caracter === '"'
    ) {

      dentroComillas =
        !dentroComillas;

    }

    else if (
      caracter === "," &&
      !dentroComillas
    ) {

      fila.push(
        campo
      );

      campo = "";

    }

    else if (
      (
        caracter === "\n" ||
        caracter === "\r"
      ) &&
      !dentroComillas
    ) {

      if (
        caracter === "\r" &&
        siguiente === "\n"
      ) {

        i++;

      }


      fila.push(
        campo
      );


      if (
        fila.some(
          valor =>
            valor.trim() !== ""
        )
      ) {

        filas.push(
          fila
        );

      }


      fila = [];

      campo = "";

    }

    else {

      campo +=
        caracter;

    }

  }


  if (
    campo.length > 0 ||
    fila.length > 0
  ) {

    fila.push(
      campo
    );


    if (
      fila.some(
        valor =>
          valor.trim() !== ""
      )
    ) {

      filas.push(
        fila
      );

    }

  }


  return filas;

}


// ========================================
// TEMA CLARO / OSCURO
// ========================================

function aplicarTema(
  tema
) {

  document.documentElement.setAttribute(
    "data-theme",
    tema
  );


  if (themeToggle) {

    themeToggle.textContent =
      tema === "dark"
        ? "☀️"
        : "🌙";

  }

}


const temaGuardado =
  localStorage.getItem(
    "temaAdmin"
  ) || "dark";


aplicarTema(
  temaGuardado
);


if (themeToggle) {

  themeToggle.addEventListener(
    "click",
    () => {

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
        "temaAdmin",
        nuevoTema
      );

    }
  );

}


// ========================================
// CONSULTAR GAFETE
// ========================================

async function consultarGafete(
  id
) {

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


  if (
    !documento.exists()
  ) {

    return false;

  }


  return (
    documento.data().enviado ===
    true
  );

}


// ========================================
// CONTROLADOR DE PAPELITOS
// ========================================

const papelitosController =
  crearPapelitosController({

    auth,

    apiUrl:
      PAPELITOS_API_URL,

    tablaRepresentantes,

    estadoPapelitos,
    detallePapelitos,
    cambiarPapelitos,

    crearClavePapelitos,
    normalizarTexto,
    mostrarToast,
    formatearFechaConfirmacion,

    obtenerRepresentanteSeleccionado:
      () =>
        representanteSeleccionado

  });


// ========================================
// CONTROLADOR DE FICHA
// ========================================

const abrirFicha =
  configurarFicha({

    fichaRepresentante,
    fichaNombre,
    fichaInstagram,
    fichaId,
    fichaFecha,
    fichaZona,
    fichaGafete,

    estadoPapelitos,
    detallePapelitos,
    cambiarPapelitos,
    cerrarFicha,
    irAGafete,

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

        if (
          valor === null
        ) {

          papelitosController
            .limpiarSeleccion();

        }

      }

  });


// ========================================
// CONTROLADOR DE TABLA
// ========================================

const tablaController =
  crearTablaController({

    tablaRepresentantes,
    contenedorTabla,
    contadorResultados,
    cargandoResultados,
    estadoInicial,
    sinResultados,
    fichaRepresentante,

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
// CONTROLADOR DE FILTROS
// ========================================

const filtrosController =
  crearFiltrosController({

    representantes:
      () =>
        representantes,

    busqueda,
    filtroFecha,
    filtroZona,

    mostrarResultados:
      tablaController
        .mostrarResultados,

    normalizarTexto

  });


// ========================================
// COPIAR DATOS Y LISTAS
// ========================================

configurarCopiado({

  copiarDatos,
  copiarLista,

  busqueda,
  filtroFecha,
  filtroZona,

  obtenerRepresentanteSeleccionado:
    () =>
      representanteSeleccionado,

  obtenerResultadosActuales:
    () =>
      resultadosActuales,

  mostrarToast

});


// ========================================
// CARGAR REPRESENTANTES
// ========================================

async function cargarRepresentantes() {

  estadoInicial.style.display =
    "none";

  cargandoResultados.style.display =
    "block";

  sinResultados.style.display =
    "none";

  contenedorTabla.style.display =
    "none";


  try {

    const respuesta =
      await fetch(
        `${SHEET_URL}&t=${Date.now()}`
      );


    if (
      !respuesta.ok
    ) {

      throw new Error(
        "No se pudo leer Google Sheets."
      );

    }


    const csv =
      await respuesta.text();


    const filas =
      parsearCSV(
        csv
      );


    representantes = [];


    for (
      const fila
      of filas
    ) {

      const id =
        String(
          fila[0] || ""
        ).trim();


      if (
        !id
          .toUpperCase()
          .startsWith(
            "FPHS-MX-"
          )
      ) {

        continue;

      }


      representantes.push({

        id,

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

      });

    }


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


    const parametros =
      new URLSearchParams(
        window.location.search
      );


    const busquedaRecibida =
      parametros.get(
        "buscar"
      );


    if (
      busquedaRecibida
    ) {

      busqueda.value =
        busquedaRecibida;


      filtrosController
        .aplicarFiltros();

    }

    else {

      tablaController
        .mostrarResultados(
          representantes
        );

    }

  }

  catch (error) {

    console.error(
      "Error cargando representantes:",
      error
    );


    cargandoResultados.style.display =
      "none";

    contenedorTabla.style.display =
      "none";

    sinResultados.style.display =
      "block";


    const tituloError =
      sinResultados.querySelector(
        "strong"
      );


    const textoError =
      sinResultados.querySelector(
        "p"
      );


    if (tituloError) {

      tituloError.textContent =
        "No se pudo cargar la lista";

    }


    if (textoError) {

      textoError.textContent =
        "Intenta recargar la página.";

    }

  }

}


// ========================================
// EVENTOS DE FILTROS
// ========================================

buscarButton.addEventListener(
  "click",
  () => {

    filtrosController
      .aplicarFiltros();

  }
);


busqueda.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      filtrosController
        .aplicarFiltros();

    }

  }
);


filtroFecha.addEventListener(
  "change",
  () => {

    filtrosController
      .aplicarFiltros();

  }
);


filtroZona.addEventListener(
  "change",
  () => {

    filtrosController
      .aplicarFiltros();

  }
);


limpiarFiltrosButton.addEventListener(
  "click",
  () => {

    filtrosController
      .limpiarFiltros();

  }
);


// ========================================
// PREPARAR LOGO PARA PDF
// ========================================

function esperarImagen(
  imagen
) {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      if (!imagen) {

        reject(
          new Error(
            "No se encontró logoPdf en representantes.html."
          )
        );

        return;

      }


      if (
        imagen.complete &&
        imagen.naturalWidth > 0 &&
        imagen.naturalHeight > 0
      ) {

        resolve();

        return;

      }


      const limpiarEventos =
        () => {

          imagen.removeEventListener(
            "load",
            alCargar
          );

          imagen.removeEventListener(
            "error",
            alFallar
          );

        };


      const alCargar =
        () => {

          limpiarEventos();

          resolve();

        };


      const alFallar =
        () => {

          limpiarEventos();

          reject(
            new Error(
              "No se pudo cargar el logo."
            )
          );

        };


      imagen.addEventListener(
        "load",
        alCargar
      );


      imagen.addEventListener(
        "error",
        alFallar
      );

    }
  );

}


function convertirImagenADataURL(
  imagen
) {

  if (
    !imagen ||
    imagen.naturalWidth <= 0 ||
    imagen.naturalHeight <= 0
  ) {

    throw new Error(
      "El logo no tiene dimensiones válidas."
    );

  }


  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width =
    imagen.naturalWidth;

  canvas.height =
    imagen.naturalHeight;


  const contexto =
    canvas.getContext(
      "2d"
    );


  if (!contexto) {

    throw new Error(
      "No se pudo preparar el logo para el PDF."
    );

  }


  contexto.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );


  contexto.drawImage(
    imagen,
    0,
    0,
    canvas.width,
    canvas.height
  );


  return canvas.toDataURL(
    "image/png",
    1
  );

}


// ========================================
// DESCARGAR PDF
// ========================================

descargarLista.addEventListener(
  "click",
  async () => {

    if (
      resultadosActuales.length ===
      0
    ) {

      mostrarToast(
        "No hay resultados para descargar"
      );

      return;

    }


    if (
      !window.jspdf ||
      !window.jspdf.jsPDF
    ) {

      mostrarToast(
        "No se pudo cargar el generador de PDF"
      );

      return;

    }


    descargarLista.disabled =
      true;

    descargarLista.textContent =
      "Generando PDF...";


    try {

      const {
        jsPDF
      } = window.jspdf;


      const pdf =
        new jsPDF({

          orientation:
            "landscape",

          unit:
            "mm",

          format:
            "a4"

        });


      const anchoPagina =
        pdf.internal.pageSize
          .getWidth();


      await esperarImagen(
        logoPdf
      );


      const logoDataURL =
        convertirImagenADataURL(
          logoPdf
        );


      // ENCABEZADO

      pdf.setFillColor(
        231,
        43,
        145
      );


      pdf.rect(
        0,
        0,
        anchoPagina,
        36,
        "F"
      );


      pdf.addImage(
        logoDataURL,
        "PNG",
        11,
        4,
        28,
        28,
        undefined,
        "FAST"
      );


      pdf.setTextColor(
        255,
        249,
        252
      );


      pdf.setFont(
        "helvetica",
        "bold"
      );


      pdf.setFontSize(
        17
      );


      pdf.text(
        "HARRY STYLES MÉXICO OFFAN",
        45,
        15
      );


      pdf.setFont(
        "helvetica",
        "normal"
      );


      pdf.setFontSize(
        10
      );


      pdf.text(
        "LISTA DE REPRESENTANTES · FAN PROJECT 2026",
        45,
        23
      );


      // TÍTULO

      pdf.setTextColor(
        23,
        19,
        27
      );


      pdf.setFont(
        "helvetica",
        "bold"
      );


      pdf.setFontSize(
        12
      );


      pdf.text(
        "Lista de representantes",
        14,
        47
      );


      // FILTROS

      pdf.setFont(
        "helvetica",
        "normal"
      );


      pdf.setFontSize(
        9
      );


      const detalles = [];


      if (
        filtroFecha.value
      ) {

        detalles.push(
          `Fecha: ${filtroFecha.value}`
        );

      }


      if (
        filtroZona.value
      ) {

        detalles.push(
          `Zona: ${filtroZona.value}`
        );

      }


      if (
        busqueda.value.trim()
      ) {

        detalles.push(
          `Búsqueda: ${busqueda.value.trim()}`
        );

      }


      detalles.push(
        `Registros: ${resultadosActuales.length}`
      );


      pdf.text(
        detalles.join(
          "   ·   "
        ),
        14,
        54
      );


      // FILAS DEL PDF

      const filasPDF =
        resultadosActuales.map(
          representante => {

            const papelitos =
              papelitosController
                .obtenerPapelitos(
                  representante
                );


            let estado =
              "Pendiente";


            if (
              papelitos &&
              papelitos.confirmado === true
            ) {

              estado =
                "Confirmado";

            }

            else if (
              papelitos &&
              papelitos.cancelado === true
            ) {

              estado =
                "Cancelado";

            }


            return [

              representante.id || "",

              representante.nombre || "",

              representante.instagram
                ? `@${representante.instagram.replace(/^@/, "")}`
                : "",

              representante.fecha || "",

              representante.zona || "",

              estado

            ];

          }
        );


      pdf.autoTable({

        startY:
          61,

        head: [[
          "ID",
          "REPRESENTANTE",
          "INSTAGRAM",
          "FECHA",
          "ZONA",
          "PAPELITOS"
        ]],

        body:
          filasPDF,

        theme:
          "grid",

        margin: {

          left:
            14,

          right:
            14,

          bottom:
            16

        },

        styles: {

          font:
            "helvetica",

          fontSize:
            8,

          cellPadding:
            2.5,

          textColor:
            [23, 19, 27],

          lineColor:
            [214, 203, 210],

          lineWidth:
            0.2,

          overflow:
            "linebreak",

          valign:
            "middle"

        },

        headStyles: {

          fillColor:
            [231, 43, 145],

          textColor:
            [255, 249, 252],

          fontStyle:
            "bold",

          halign:
            "left",

          valign:
            "middle"

        },

        alternateRowStyles: {

          fillColor:
            [255, 249, 252]

        },

        columnStyles: {

          0: {
            cellWidth: 28
          },

          1: {
            cellWidth: 55
          },

          2: {
            cellWidth: 48
          },

          3: {
            cellWidth: 30
          },

          4: {
            cellWidth: 48
          },

          5: {
            cellWidth: 30
          }

        },

        didDrawPage:
          function () {

            const altoPagina =
              pdf.internal.pageSize
                .getHeight();


            const paginaActual =
              pdf.internal
                .getCurrentPageInfo()
                .pageNumber;


            pdf.setDrawColor(
              231,
              43,
              145
            );


            pdf.setLineWidth(
              0.2
            );


            pdf.line(
              14,
              altoPagina - 12,
              anchoPagina - 14,
              altoPagina - 12
            );


            pdf.setFont(
              "helvetica",
              "normal"
            );


            pdf.setFontSize(
              7
            );


            pdf.setTextColor(
              111,
              101,
              112
            );


            pdf.text(
              "Documento generado desde el Panel Administrativo · HSMX OFFAN",
              14,
              altoPagina - 7
            );


            pdf.text(
              `Página ${paginaActual}`,
              anchoPagina - 14,
              altoPagina - 7,
              {
                align:
                  "right"
              }
            );

          }

      });


      // NOMBRE DEL ARCHIVO

      const partesNombre = [
        "Representantes"
      ];


      if (
        filtroFecha.value
      ) {

        partesNombre.push(
          filtroFecha.value.replaceAll(
            " ",
            "-"
          )
        );

      }


      if (
        filtroZona.value
      ) {

        partesNombre.push(
          filtroZona.value.replaceAll(
            " ",
            "-"
          )
        );

      }


      if (
        busqueda.value.trim()
      ) {

        partesNombre.push(
          busqueda.value
            .trim()
            .replaceAll(
              " ",
              "-"
            )
        );

      }


      const nombreArchivo =
        `${partesNombre.join("_")}.pdf`;


      pdf.save(
        nombreArchivo
      );


      mostrarToast(
        resultadosActuales.length === 1
          ? "PDF generado con 1 registro"
          : `PDF generado con ${resultadosActuales.length} registros`
      );

    }

    catch (error) {

      console.error(
        "Error generando PDF:",
        error
      );


      mostrarToast(
        error?.message ||
        "No se pudo generar el PDF"
      );

    }

    finally {

      descargarLista.disabled =
        false;

      descargarLista.textContent =
        "📄 Descargar PDF";

    }

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


    await cargarRepresentantes();

  }
);
