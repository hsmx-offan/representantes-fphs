import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


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

let representantes = [];
let problemas = [];


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
// NORMALIZAR
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
// CARGAR DATOS
// ========================================

async function cargarDatos() {

  cargandoProblemas.style.display =
    "block";

  listaProblemas.style.display =
    "none";

  sinProblemas.style.display =
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


    detectarProblemas();

    mostrarProblemas(
      problemas
    );

  }

  catch (error) {

    console.error(error);

    cargandoProblemas.textContent =
      "No se pudo analizar la lista.";

  }

}


// ========================================
// DETECTAR PROBLEMAS
// ========================================

function detectarProblemas() {

  problemas = [];

  detectarDatosFaltantes();
  detectarIdsDuplicados();
  detectarInstagramDuplicado();

  totalProblemas.textContent =
    problemas.length;

}


// ========================================
// DATOS FALTANTES
// ========================================

function detectarDatosFaltantes() {

  for (
    const representante
    of representantes
  ) {

    if (!representante.zona) {

      problemas.push({

        tipo:
          "sin-zona",

        titulo:
          "Falta zona",

        descripcion:
          `${representante.id} no tiene una zona asignada.`,

        representante

      });

    }


    if (!representante.fecha) {

      problemas.push({

        tipo:
          "sin-fecha",

        titulo:
          "Falta fecha",

        descripcion:
          `${representante.id} no tiene una fecha asignada.`,

        representante

      });

    }


    if (!representante.instagram) {

      problemas.push({

        tipo:
          "sin-instagram",

        titulo:
          "Falta Instagram",

        descripcion:
          `${representante.id} no tiene usuario de Instagram registrado.`,

        representante

      });

    }


    if (!representante.nombre) {

      problemas.push({

        tipo:
          "sin-nombre",

        titulo:
          "Falta nombre",

        descripcion:
          `${representante.id} no tiene nombre registrado.`,

        representante

      });

    }

  }

}


// ========================================
// IDS DUPLICADOS
// ========================================

function detectarIdsDuplicados() {

  const grupos =
    new Map();


  for (
    const representante
    of representantes
  ) {

    const id =
      normalizarTexto(
        representante.id
      );


    if (!grupos.has(id)) {

      grupos.set(
        id,
        []
      );

    }


    grupos
      .get(id)
      .push(
        representante
      );

  }


  for (
    const registros
    of grupos.values()
  ) {

    if (
      registros.length < 2
    ) {

      continue;

    }


    /*
      Un mismo ID puede aparecer varias veces
      si la misma persona va en diferentes fechas.

      Solo lo consideramos problema si ese ID
      aparece asociado a personas/Instagram distintos.
    */

    const nombres =
      new Set(
        registros
          .map(
            registro =>
              normalizarTexto(
                registro.nombre
              )
          )
          .filter(Boolean)
      );


    const instagrams =
      new Set(
        registros
          .map(
            registro =>
              normalizarTexto(
                registro.instagram
                  .replace(
                    /^@/,
                    ""
                  )
              )
          )
          .filter(Boolean)
      );


    if (
      nombres.size <= 1 &&
      instagrams.size <= 1
    ) {

      continue;

    }


    const representante =
      registros[0];


    problemas.push({

      tipo:
        "id-duplicado",

      titulo:
        "ID asociado a datos distintos",

      descripcion:
        `${representante.id} aparece en registros que no parecen pertenecer a la misma persona.`,

      meta:
        `${registros.length} registros encontrados`,

      representante

    });

  }

}


// ========================================
// INSTAGRAM CON IDS DISTINTOS
// ========================================

function detectarInstagramDuplicado() {

  const grupos =
    new Map();


  for (
    const representante
    of representantes
  ) {

    const instagram =
      normalizarTexto(
        representante.instagram
          .replace(
            /^@/,
            ""
          )
      );


    if (!instagram) {

      continue;

    }


    if (!grupos.has(instagram)) {

      grupos.set(
        instagram,
        []
      );

    }


    grupos
      .get(instagram)
      .push(
        representante
      );

  }


  for (
    const [
      instagram,
      registros
    ]
    of grupos.entries()
  ) {

    const ids =
      new Set(
        registros.map(
          registro =>
            normalizarTexto(
              registro.id
            )
        )
      );


    if (
      ids.size <= 1
    ) {

      continue;

    }


    problemas.push({

      tipo:
        "instagram-duplicado",

      titulo:
        "Instagram con IDs distintos",

      descripcion:
        `@${instagram} aparece asociado a más de un ID.`,

      meta:
        `${ids.size} IDs diferentes`,

      representante:
        registros[0]

    });

  }

}


// ========================================
// FILTRAR PROBLEMAS
// ========================================

function aplicarFiltros() {

  const tipo =
    filtroTipo.value;

  const texto =
    normalizarTexto(
      busquedaProblema.value
    );


  const resultados =
    problemas.filter(
      problema => {

        const coincideTipo =
          !tipo ||
          problema.tipo ===
            tipo;


        const representante =
          problema.representante;


        const coincideTexto =
          !texto ||
          normalizarTexto(
            representante?.id
          ).includes(texto) ||
          normalizarTexto(
            representante?.nombre
          ).includes(texto) ||
          normalizarTexto(
            representante?.instagram
          ).includes(texto) ||
          normalizarTexto(
            problema.descripcion
          ).includes(texto);


        return (
          coincideTipo &&
          coincideTexto
        );

      }
    );


  mostrarProblemas(
    resultados
  );

}


// ========================================
// MOSTRAR PROBLEMAS
// ========================================

function mostrarProblemas(
  resultados
) {

  cargandoProblemas.style.display =
    "none";

  listaProblemas.innerHTML =
    "";


  contadorResultados.textContent =
    resultados.length === 1
      ? "1 problema"
      : `${resultados.length} problemas`;


  if (
    resultados.length === 0
  ) {

    listaProblemas.style.display =
      "none";

    sinProblemas.style.display =
      "block";

    return;

  }


  sinProblemas.style.display =
    "none";

  listaProblemas.style.display =
    "grid";


  for (
    const problema
    of resultados
  ) {

    const tarjeta =
      document.createElement(
        "article"
      );


    tarjeta.className =
      `problema problema-${problema.tipo}`;


    tarjeta.innerHTML = `

      <div class="problema-icono">
        ${obtenerIcono(
          problema.tipo
        )}
      </div>

      <div class="problema-contenido">

        <h3>
          ${escaparHTML(
            problema.titulo
          )}
        </h3>

        <p>
          ${escaparHTML(
            problema.descripcion
          )}
        </p>

        ${
          problema.meta
            ? `
              <p class="problema-meta">
                ${escaparHTML(
                  problema.meta
                )}
              </p>
            `
            : ""
        }

      </div>

      <a
        href="${crearEnlaceRepresentante(
          problema.representante
        )}"
        class="ver-representante"
      >
        Ver representante
      </a>

    `;


    listaProblemas.appendChild(
      tarjeta
    );

  }

}


// ========================================
// ICONOS
// ========================================

function obtenerIcono(tipo) {

  switch (tipo) {

    case "id-duplicado":
      return "🔴";

    case "instagram-duplicado":
      return "🟠";

    case "sin-zona":
    case "sin-fecha":
      return "🟡";

    case "sin-instagram":
    case "sin-nombre":
      return "⚠️";

    default:
      return "⚠️";

  }

}


// ========================================
// ENLACE A REPRESENTANTE
// ========================================

function crearEnlaceRepresentante(
  representante
) {

  if (
    !representante ||
    !representante.id
  ) {

    return "representantes.html";

  }


  return (
    "representantes.html?buscar=" +
    encodeURIComponent(
      representante.id
    )
  );

}


// ========================================
// ESCAPAR HTML
// ========================================

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


// ========================================
// EVENTOS
// ========================================

filtroTipo.addEventListener(
  "change",
  aplicarFiltros
);


busquedaProblema.addEventListener(
  "input",
  aplicarFiltros
);


limpiarFiltros.addEventListener(
  "click",
  () => {

    filtroTipo.value =
      "";

    busquedaProblema.value =
      "";

    mostrarProblemas(
      problemas
    );

  }
);
