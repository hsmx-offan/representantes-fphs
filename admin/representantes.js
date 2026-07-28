import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ========================================
// FIREBASE
// ========================================

const firebaseConfig = {
  apiKey: "AIzaSyAesU9F4Oc7Lr8TPOFUk-Oi-lT086XjRKw",
  authDomain: "hsmx-representantes.firebaseapp.com",
  projectId: "hsmx-representantes",
  storageBucket: "hsmx-representantes.firebasestorage.app",
  messagingSenderId: "821385801252",
  appId: "1:821385801252:web:c95ba9ffdeb90fe03732b1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// ========================================
// GOOGLE SHEETS / APPS SCRIPT
// ========================================

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmA9mpebsNjPcTYMsklHNKShcPVEdU_xTkn-oHVjqil9SP1KrjPO8V1lEqxqnY-dna2IJY0BOUvg-/pub?gid=77234656&single=true&output=csv";

const PAPELITOS_API_URL =
  "https://script.google.com/macros/s/AKfycbz1nbly2DHBiw5NiVW0s0MiQYX-s2hUQEbpcR_mGCHcL2JIwV1I53nZCwjvCrO8SzNC7g/exec";


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

const busqueda =
  document.getElementById("busqueda");

const filtroFecha =
  document.getElementById("filtroFecha");

const filtroZona =
  document.getElementById("filtroZona");

const buscarButton =
  document.getElementById("buscarButton");

const limpiarFiltros =
  document.getElementById("limpiarFiltros");

const contadorResultados =
  document.getElementById("contadorResultados");

const estadoInicial =
  document.getElementById("estadoInicial");

const cargandoResultados =
  document.getElementById("cargandoResultados");

const sinResultados =
  document.getElementById("sinResultados");

const contenedorTabla =
  document.getElementById("contenedorTabla");

const tablaRepresentantes =
  document.getElementById("tablaRepresentantes");

const fichaRepresentante =
  document.getElementById("fichaRepresentante");

const fichaNombre =
  document.getElementById("fichaNombre");

const fichaInstagram =
  document.getElementById("fichaInstagram");

const fichaId =
  document.getElementById("fichaId");

const fichaFecha =
  document.getElementById("fichaFecha");

const fichaZona =
  document.getElementById("fichaZona");

const fichaGafete =
  document.getElementById("fichaGafete");

const cerrarFicha =
  document.getElementById("cerrarFicha");

const copiarDatos =
  document.getElementById("copiarDatos");

const copiarLista =
  document.getElementById("copiarLista");

const descargarLista =
  document.getElementById("descargarLista");

const irAGafete =
  document.getElementById("irAGafete");

const estadoPapelitos =
  document.getElementById("estadoPapelitos");

const detallePapelitos =
  document.getElementById("detallePapelitos");

const cambiarPapelitos =
  document.getElementById("cambiarPapelitos");

const toast =
  document.getElementById("toast");

const logoPdf =
  document.getElementById("logoPdf");


// ========================================
// VARIABLES
// ========================================

let representantes = [];
let resultadosActuales = [];
let representanteSeleccionado = null;
let registrosPapelitos = [];
let papelitosSeleccionado = null;


// ========================================
// TEMA CLARO / OSCURO
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
  localStorage.getItem("temaAdmin") ||
  "dark";

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

    await cargarRepresentantes();

  }
);


logoutButton.addEventListener(
  "click",
  async () => {

    await signOut(auth);

    window.location.href =
      "./";

  }
);


// ========================================
// PARSEAR CSV
// ========================================

function parsearCSV(texto) {

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

      fila.push(campo);
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

      fila.push(campo);

      if (
        fila.some(
          valor =>
            valor.trim() !== ""
        )
      ) {

        filas.push(fila);

      }

      fila = [];
      campo = "";

    }

    else {

      campo += caracter;

    }

  }


  if (
    campo.length > 0 ||
    fila.length > 0
  ) {

    fila.push(campo);

    if (
      fila.some(
        valor =>
          valor.trim() !== ""
      )
    ) {

      filas.push(fila);

    }

  }

  return filas;

}


// ========================================
// UTILIDADES
// ========================================

function normalizarTexto(texto) {

  return String(texto || "")
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


function escaparHTML(texto) {

  return String(texto || "")
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


function mostrarToast(mensaje) {

  toast.textContent =
    mensaje;

  toast.classList.add(
    "visible"
  );

  setTimeout(
    () => {

      toast.classList.remove(
        "visible"
      );

    },
    2200
  );

}


// ========================================
// PAPELITOS
// ========================================

function obtenerPapelitos(
  representante
) {

  const clave =
    crearClavePapelitos(
      representante.id,
      representante.fecha,
      representante.zona
    );


  const registroControl =
    registrosPapelitos.find(
      registro =>
        crearClavePapelitos(
          registro.id,
          registro.fecha,
          registro.zona
        ) === clave
    );


  if (registroControl) {

    return registroControl;

  }


  const estadoOriginal =
    normalizarTexto(
      representante.estado
    );


  if (
    estadoOriginal ===
    "confirmado"
  ) {

    return {
      id:
        representante.id,

      fecha:
        representante.fecha,

      zona:
        representante.zona,

      confirmado:
        true,

      confirmadoPor:
        "Registro previo",

      fechaConfirmacion:
        ""
    };

  }


  if (
    estadoOriginal ===
    "cancelado"
  ) {

    return {
      id:
        representante.id,

      fecha:
        representante.fecha,

      zona:
        representante.zona,

      confirmado:
        false,

      cancelado:
        true,

      confirmadoPor:
        "",

      fechaConfirmacion:
        ""
    };

  }


  return {
    id:
      representante.id,

    fecha:
      representante.fecha,

    zona:
      representante.zona,

    confirmado:
      false,

    confirmadoPor:
      "",

    fechaConfirmacion:
      ""
  };

}


async function peticionPapelitos(
  datos
) {

  const user =
    auth.currentUser;


  if (!user) {

    throw new Error(
      "No hay una sesión activa."
    );

  }


  const idToken =
    await user.getIdToken();


  const respuesta =
    await fetch(
      PAPELITOS_API_URL,
      {
        method:
          "POST",

        headers: {
          "Content-Type":
            "text/plain;charset=utf-8"
        },

        body:
          JSON.stringify({
            ...datos,
            idToken
          })
      }
    );


  if (!respuesta.ok) {

    throw new Error(
      "No se pudo conectar con el control de papelitos."
    );

  }


  const resultado =
    await respuesta.json();


  if (!resultado.ok) {

    throw new Error(
      resultado.error ||
      "Ocurrió un error con el control de papelitos."
    );

  }


  return resultado;

}


async function cargarPapelitos() {

  const resultado =
    await peticionPapelitos({
      accion:
        "listar"
    });


  registrosPapelitos =
    Array.isArray(
      resultado.registros
    )
      ? resultado.registros
      : [];

}


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
        SHEET_URL +
        "&t=" +
        Date.now()
      );


    if (!respuesta.ok) {

      throw new Error(
        "No se pudo leer Google Sheets."
      );

    }


    const csv =
      await respuesta.text();

    const filas =
      parsearCSV(csv);


    representantes = [];


    for (
      const fila
      of filas
    ) {

      const id =
        (fila[0] || "")
          .trim();


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
          (fila[1] || "")
            .trim(),

        zona:
          (fila[2] || "")
            .trim(),

        nombre:
          (fila[3] || "")
            .trim(),

        instagram:
          (fila[4] || "")
            .trim(),

        estado:
          (fila[9] || "")
            .trim()
      });

    }


    try {

      await cargarPapelitos();

    }

    catch (error) {

      console.error(
        "Error cargando papelitos:",
        error
      );

      registrosPapelitos =
        [];

      mostrarToast(
        "No se pudo cargar el control de papelitos"
      );

    }


    cargarOpcionesFiltros();


    const parametros =
      new URLSearchParams(
        window.location.search
      );

    const busquedaRecibida =
      parametros.get(
        "buscar"
      );


    if (busquedaRecibida) {

      busqueda.value =
        busquedaRecibida;

      aplicarFiltros();

    }

    else {

      mostrarResultados(
        representantes
      );

    }

  }

  catch (error) {

    console.error(error);

    cargandoResultados.style.display =
      "none";

    sinResultados.style.display =
      "block";

    sinResultados.querySelector(
      "strong"
    ).textContent =
      "No se pudo cargar la lista";

    sinResultados.querySelector(
      "p"
    ).textContent =
      "Intenta recargar la página.";

  }

}


// ========================================
// FILTROS
// ========================================

function cargarOpcionesFiltros() {

  const fechas =
    [
      ...new Set(
        representantes
          .map(
            representante =>
              representante.fecha
          )
          .filter(Boolean)
      )
    ].sort();


  const zonas =
    [
      ...new Set(
        representantes
          .map(
            representante =>
              representante.zona
          )
          .filter(Boolean)
      )
    ].sort(
      (a, b) =>
        a.localeCompare(
          b,
          "es"
        )
    );


  filtroFecha.innerHTML =
    `<option value="">Todas</option>`;

  filtroZona.innerHTML =
    `<option value="">Todas</option>`;


  for (
    const fecha
    of fechas
  ) {

    const opcion =
      document.createElement(
        "option"
      );

    opcion.value =
      fecha;

    opcion.textContent =
      fecha;

    filtroFecha.appendChild(
      opcion
    );

  }


  for (
    const zona
    of zonas
  ) {

    const opcion =
      document.createElement(
        "option"
      );

    opcion.value =
      zona;

    opcion.textContent =
      zona;

    filtroZona.appendChild(
      opcion
    );

  }

}


function aplicarFiltros() {

  const texto =
    normalizarTexto(
      busqueda.value
    );

  const fecha =
    filtroFecha.value;

  const zona =
    filtroZona.value;


  const resultados =
    representantes.filter(
      representante => {

        const coincideTexto =
          !texto ||
          normalizarTexto(
            representante.id
          ).includes(texto) ||
          normalizarTexto(
            representante.nombre
          ).includes(texto) ||
          normalizarTexto(
            representante.instagram
          ).includes(texto);


        const coincideFecha =
          !fecha ||
          representante.fecha ===
            fecha;


        const coincideZona =
          !zona ||
          representante.zona ===
            zona;


        return (
          coincideTexto &&
          coincideFecha &&
          coincideZona
        );

      }
    );


  mostrarResultados(
    resultados
  );

}


// ========================================
// MOSTRAR RESULTADOS
// ========================================

function mostrarResultados(
  resultados
) {

  resultadosActuales =
    resultados;


  cargandoResultados.style.display =
    "none";

  estadoInicial.style.display =
    "none";

  tablaRepresentantes.innerHTML =
    "";

  fichaRepresentante.style.display =
    "none";

  representanteSeleccionado =
    null;

  papelitosSeleccionado =
    null;


  if (
    resultados.length === 0
  ) {

    sinResultados.style.display =
      "block";

    contenedorTabla.style.display =
      "none";

    contadorResultados.textContent =
      "0 resultados";

    return;

  }


  sinResultados.style.display =
    "none";

  contenedorTabla.style.display =
    "block";


  contadorResultados.textContent =
    resultados.length === 1
      ? "1 resultado"
      : `${resultados.length} resultados`;


  for (
    const representante
    of resultados
  ) {

    const fila =
      document.createElement(
        "tr"
      );


    const papelitos =
      obtenerPapelitos(
        representante
      );


    const papelitosConfirmados =
      papelitos &&
      papelitos.confirmado ===
        true;


    fila.innerHTML = `
      <td>
        ${escaparHTML(
          representante.id
        )}
      </td>

      <td>
        ${escaparHTML(
          representante.nombre ||
          "—"
        )}
      </td>

      <td>
        ${
          representante.instagram
            ? "@" +
              escaparHTML(
                representante.instagram.replace(
                  /^@/,
                  ""
                )
              )
            : "—"
        }
      </td>

      <td>
        ${escaparHTML(
          representante.fecha ||
          "—"
        )}
      </td>

      <td>
        ${escaparHTML(
          representante.zona ||
          "—"
        )}
      </td>

      <td class="estado-papelitos-tabla">
        ${
          papelitosConfirmados
            ? "✅ Confirmados"
            : "⏳ Pendiente"
        }
      </td>

      <td class="estado-gafete-tabla">
        Consultando...
      </td>

      <td>
        <button
          type="button"
          class="ver-ficha"
        >
          Ver
        </button>
      </td>
    `;


    const celdaGafete =
      fila.querySelector(
        ".estado-gafete-tabla"
      );


    consultarGafete(
      representante.id
    )
      .then(
        enviado => {

          celdaGafete.textContent =
            enviado
              ? "✅ Enviado"
              : "⏳ Pendiente";

        }
      )
      .catch(
        () => {

          celdaGafete.textContent =
            "—";

        }
      );


    fila
      .querySelector(
        ".ver-ficha"
      )
      .addEventListener(
        "click",
        () => {

          abrirFicha(
            representante
          );

        }
      );


    tablaRepresentantes.appendChild(
      fila
    );

  }

}


// ========================================
// GAFETES
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


  if (!documento.exists()) {

    return false;

  }


  return (
    documento.data().enviado ===
    true
  );

}


// ========================================
// FICHA
// ========================================

function formatearFechaConfirmacion(
  fecha
) {

  if (!fecha) {

    return "";

  }


  const objetoFecha =
    new Date(fecha);


  if (
    Number.isNaN(
      objetoFecha.getTime()
    )
  ) {

    return "";

  }


  return objetoFecha.toLocaleString(
    "es-MX",
    {
      dateStyle:
        "medium",

      timeStyle:
        "short"
    }
  );

}


function mostrarEstadoPapelitos(
  representante
) {

  papelitosSeleccionado =
    obtenerPapelitos(
      representante
    );


  const confirmado =
    papelitosSeleccionado &&
    papelitosSeleccionado.confirmado ===
      true;


  if (confirmado) {

    estadoPapelitos.textContent =
      "✅ Confirmados";


    const partes =
      [];


    if (
      papelitosSeleccionado.confirmadoPor
    ) {

      partes.push(
        `Confirmado por: ${papelitosSeleccionado.confirmadoPor}`
      );

    }


    const fecha =
      formatearFechaConfirmacion(
        papelitosSeleccionado.fechaConfirmacion
      );


    if (fecha) {

      partes.push(
        fecha
      );

    }


    detallePapelitos.textContent =
      partes.join(
        " · "
      );

    cambiarPapelitos.textContent =
      "Marcar como pendiente";

  }

  else {

    estadoPapelitos.textContent =
      "⏳ Pendiente";

    detallePapelitos.textContent =
      "Aún no se ha confirmado la entrega de papelitos.";

    cambiarPapelitos.textContent =
      "Confirmar papelitos";

  }


  cambiarPapelitos.disabled =
    false;

}


async function abrirFicha(
  representante
) {

  representanteSeleccionado =
    representante;


  fichaNombre.textContent =
    representante.nombre ||
    "Sin nombre";

  fichaInstagram.textContent =
    representante.instagram
      ? "@" +
        representante.instagram.replace(
          /^@/,
          ""
        )
      : "Sin Instagram";

  fichaId.textContent =
    representante.id;

  fichaFecha.textContent =
    representante.fecha ||
    "—";

  fichaZona.textContent =
    representante.zona ||
    "—";

  fichaGafete.textContent =
    "Consultando...";


  estadoPapelitos.textContent =
    "Consultando...";

  detallePapelitos.textContent =
    "";

  cambiarPapelitos.textContent =
    "Consultando...";

  cambiarPapelitos.disabled =
    true;


  fichaRepresentante.style.display =
    "block";


  mostrarEstadoPapelitos(
    representante
  );


  try {

    const enviado =
      await consultarGafete(
        representante.id
      );

    fichaGafete.textContent =
      enviado
        ? "✅ Enviado"
        : "⏳ Pendiente";

  }

  catch (error) {

    console.error(error);

    fichaGafete.textContent =
      "—";

  }


  irAGafete.href =
    `panel.html?id=${encodeURIComponent(
      representante.id
    )}`;


  fichaRepresentante.scrollIntoView({
    behavior:
      "smooth",

    block:
      "start"
  });

}


// ========================================
// ACTUALIZAR PAPELITOS
// ========================================

cambiarPapelitos.addEventListener(
  "click",
  async () => {

    if (!representanteSeleccionado) {

      return;

    }


    const representante =
      representanteSeleccionado;

    const registroActual =
      obtenerPapelitos(
        representante
      );

    const estaConfirmado =
      registroActual &&
      registroActual.confirmado ===
        true;

    const nuevoEstado =
      !estaConfirmado;


    cambiarPapelitos.disabled =
      true;

    cambiarPapelitos.textContent =
      nuevoEstado
        ? "Confirmando..."
        : "Actualizando...";


    try {

      const resultado =
        await peticionPapelitos({
          accion:
            "actualizar",

          id:
            representante.id,

          fecha:
            representante.fecha,

          zona:
            representante.zona,

          confirmado:
            nuevoEstado
        });


      const clave =
        crearClavePapelitos(
          representante.id,
          representante.fecha,
          representante.zona
        );


      registrosPapelitos =
        registrosPapelitos.filter(
          registro =>
            crearClavePapelitos(
              registro.id,
              registro.fecha,
              registro.zona
            ) !== clave
        );


      registrosPapelitos.push({
        id:
          representante.id,

        fecha:
          representante.fecha,

        zona:
          representante.zona,

        confirmado:
          resultado.confirmado ===
            true,

        confirmadoPor:
          resultado.confirmadoPor ||
          "",

        fechaConfirmacion:
          resultado.fechaConfirmacion ||
          ""
      });


      mostrarEstadoPapelitos(
        representante
      );

      actualizarPapelitosEnTabla(
        representante
      );


      mostrarToast(
        nuevoEstado
          ? "Papelitos confirmados"
          : "Papelitos marcados como pendientes"
      );

    }

    catch (error) {

      console.error(error);

      mostrarToast(
        error.message ||
        "No se pudo actualizar"
      );

      mostrarEstadoPapelitos(
        representante
      );

    }

  }
);


function actualizarPapelitosEnTabla(
  representante
) {

  const filas =
    tablaRepresentantes.querySelectorAll(
      "tr"
    );

  const claveBuscada =
    crearClavePapelitos(
      representante.id,
      representante.fecha,
      representante.zona
    );


  for (
    const fila
    of filas
  ) {

    const celdas =
      fila.querySelectorAll(
        "td"
      );


    if (
      celdas.length < 8
    ) {

      continue;

    }


    const claveFila =
      crearClavePapelitos(
        celdas[0].textContent.trim(),
        celdas[3].textContent.trim(),
        celdas[4].textContent.trim()
      );


    if (
      claveFila ===
      claveBuscada
    ) {

      const registro =
        obtenerPapelitos(
          representante
        );


      celdas[5].textContent =
        registro &&
        registro.confirmado ===
          true
          ? "✅ Confirmados"
          : "⏳ Pendiente";

      break;

    }

  }

}


// ========================================
// BOTONES DE FICHA
// ========================================

cerrarFicha.addEventListener(
  "click",
  () => {

    fichaRepresentante.style.display =
      "none";

    representanteSeleccionado =
      null;

    papelitosSeleccionado =
      null;

  }
);


copiarDatos.addEventListener(
  "click",
  async () => {

    if (!representanteSeleccionado) {

      return;

    }


    const representante =
      representanteSeleccionado;


    const texto = [
      representante.id,
      representante.nombre,
      representante.instagram
        ? `@${representante.instagram.replace(
            /^@/,
            ""
          )}`
        : "",
      representante.fecha,
      representante.zona
    ]
      .filter(Boolean)
      .join(" — ");


    try {

      await navigator.clipboard.writeText(
        texto
      );

      mostrarToast(
        "Datos copiados"
      );

    }

    catch (error) {

      console.error(error);

      mostrarToast(
        "No se pudieron copiar los datos"
      );

    }

  }
);


// ========================================
// COPIAR LISTA
// ========================================

copiarLista.addEventListener(
  "click",
  async () => {

    if (
      resultadosActuales.length ===
      0
    ) {

      mostrarToast(
        "No hay resultados para copiar"
      );

      return;

    }


    const encabezados =
      [];


    if (
      filtroFecha.value
    ) {

      encabezados.push(
        `FECHA: ${filtroFecha.value}`
      );

    }


    if (
      filtroZona.value
    ) {

      encabezados.push(
        `ZONA: ${filtroZona.value}`
      );

    }


    if (
      busqueda.value.trim()
    ) {

      encabezados.push(
        `BÚSQUEDA: ${busqueda.value.trim()}`
      );

    }


    const lineas =
      resultadosActuales.map(
        representante => {

          const instagram =
            representante.instagram
              ? `@${representante.instagram.replace(
                  /^@/,
                  ""
                )}`
              : "Sin Instagram";


          return (
            `${representante.id} — ` +
            `${representante.nombre || "Sin nombre"} — ` +
            `${instagram} — ` +
            `${representante.fecha || "Sin fecha"} — ` +
            `${representante.zona || "Sin zona"}`
          );

        }
      );


    const texto = [
      "LISTA DE REPRESENTANTES",

      encabezados.length
        ? encabezados.join(
            " · "
          )
        : "Todos los resultados",

      "",

      ...lineas,

      "",

      `TOTAL: ${resultadosActuales.length}`
    ].join("\n");


    try {

      await navigator.clipboard.writeText(
        texto
      );

      mostrarToast(
        resultadosActuales.length === 1
          ? "1 registro copiado"
          : `${resultadosActuales.length} registros copiados`
      );

    }

    catch (error) {

      console.error(error);

      mostrarToast(
        "No se pudo copiar la lista"
      );

    }

  }
);


// ========================================
// PREPARAR LOGO PARA PDF
// ========================================

function esperarImagen(imagen) {

  return new Promise(
    (resolve, reject) => {

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
              "No se pudo cargar logo3.png."
            )
          );

        };


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
        pdf.internal.pageSize.getWidth();


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


      const detalles =
        [];


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


      // FILAS

      const filasPDF =
        resultadosActuales.map(
          representante => {

            const papelitos =
              obtenerPapelitos(
                representante
              );


            let estadoPapelitos =
              "Pendiente";


            if (
              papelitos &&
              papelitos.confirmado ===
                true
            ) {

              estadoPapelitos =
                "Confirmado";

            }

            else if (
              papelitos &&
              papelitos.cancelado ===
                true
            ) {

              estadoPapelitos =
                "Cancelado";

            }


            return [
              representante.id ||
                "",

              representante.nombre ||
                "",

              representante.instagram
                ? `@${representante.instagram.replace(
                    /^@/,
                    ""
                  )}`
                : "",

              representante.fecha ||
                "",

              representante.zona ||
                "",

              estadoPapelitos
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
            cellWidth:
              28
          },

          1: {
            cellWidth:
              55
          },

          2: {
            cellWidth:
              48
          },

          3: {
            cellWidth:
              30
          },

          4: {
            cellWidth:
              48
          },

          5: {
            cellWidth:
              30
          }
        },

        didDrawPage:
          function () {

            const altoPagina =
              pdf.internal.pageSize.getHeight();

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

      const partesNombre =
        [
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
        partesNombre.join(
          "_"
        ) +
        ".pdf";


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
// EVENTOS DE FILTROS
// ========================================

buscarButton.addEventListener(
  "click",
  aplicarFiltros
);


busqueda.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Enter"
    ) {

      aplicarFiltros();

    }

  }
);


filtroFecha.addEventListener(
  "change",
  aplicarFiltros
);


filtroZona.addEventListener(
  "change",
  aplicarFiltros
);


limpiarFiltros.addEventListener(
  "click",
  () => {

    busqueda.value =
      "";

    filtroFecha.value =
      "";

    filtroZona.value =
      "";

    mostrarResultados(
      representantes
    );

  }
);
