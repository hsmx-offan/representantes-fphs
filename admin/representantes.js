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
// GOOGLE SHEETS
// ========================================

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmA9mpebsNjPcTYMsklHNKShcPVEdU_xTkn-oHVjqil9SP1KrjPO8V1lEqxqnY-dna2IJY0BOUvg-/pub?gid=77234656&single=true&output=csv";


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

const irAGafete =
  document.getElementById("irAGafete");

const toast =
  document.getElementById("toast");


// ========================================
// VARIABLES
// ========================================

let representantes = [];

let representanteSeleccionado = null;


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
  localStorage.getItem("temaAdmin") || "dark";

aplicarTema(temaGuardado);

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

    aplicarTema(nuevo);

    localStorage.setItem(
      "temaAdmin",
      nuevo
    );

  }
);


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

    cargando.style.display =
      "none";

    contenido.style.display =
      "block";

    await cargarRepresentantes();

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
// NORMALIZAR TEXTO
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


    for (const fila of filas) {

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

        id:
          id,

        instagram:
          (fila[1] || "")
            .trim(),

        fecha:
          (fila[2] || "")
            .trim(),

        nombre:
          (fila[3] || "")
            .trim(),

        zona:
          (fila[4] || "")
            .trim()

      });

    }


    cargarOpcionesFiltros();

    mostrarResultados(
      representantes
    );

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
// OPCIONES DE FECHA Y ZONA
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
    ]
      .sort();


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
    ]
      .sort(
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


  for (const fecha of fechas) {

    const option =
      document.createElement(
        "option"
      );

    option.value =
      fecha;

    option.textContent =
      fecha;

    filtroFecha.appendChild(
      option
    );

  }


  for (const zona of zonas) {

    const option =
      document.createElement(
        "option"
      );

    option.value =
      zona;

    option.textContent =
      zona;

    filtroZona.appendChild(
      option
    );

  }

}


// ========================================
// FILTRAR
// ========================================

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

async function mostrarResultados(
  resultados
) {

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
                representante.instagram
                  .replace(
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

      <td
        class="estado-gafete-tabla"
      >
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
// ABRIR FICHA
// ========================================

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


  fichaRepresentante.style.display =
    "block";


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
    behavior: "smooth",
    block: "start"
  });

}


// ========================================
// CERRAR FICHA
// ========================================

cerrarFicha.addEventListener(
  "click",
  () => {

    fichaRepresentante.style.display =
      "none";

    representanteSeleccionado =
      null;

  }
);


// ========================================
// COPIAR DATOS
// ========================================

copiarDatos.addEventListener(
  "click",
  async () => {

    if (
      !representanteSeleccionado
    ) {

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
// TOAST
// ========================================

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
// ESCAPAR HTML
// ========================================

function escaparHTML(texto) {

  return String(texto)
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


// ========================================
// BOTONES / EVENTOS
// ========================================

buscarButton.addEventListener(
  "click",
  aplicarFiltros
);


busqueda.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
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
