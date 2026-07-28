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
  getDoc,
  collection,
  getDocs,
  query,
  where
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

const app =
  initializeApp(firebaseConfig);

const auth =
  getAuth(app);

const db =
  getFirestore(app);


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
// GOOGLE SHEETS
// ========================================

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmA9mpebsNjPcTYMsklHNKShcPVEdU_xTkn-oHVjqil9SP1KrjPO8V1lEqxqnY-dna2IJY0BOUvg-/pub?gid=77234656&single=true&output=csv";


// ========================================
// VARIABLES
// ========================================

let representantes = [];


// ========================================
// LEER CSV
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
// CARGAR PERFIL DEL ADMIN
// ========================================

async function cargarPerfilAdmin(
  user
) {

  try {

    const referencia =
      doc(
        db,
        "admins",
        user.uid
      );


    const documento =
      await getDoc(
        referencia
      );


    if (
      documento.exists()
    ) {

      const datos =
        documento.data();


      nombreAdmin.textContent =
        datos.usuario ||
        "Admin";

    }

    else {

      nombreAdmin.textContent =
        "Admin";

    }

  }

  catch (error) {

    console.error(
      "Error cargando perfil del admin:",
      error
    );


    nombreAdmin.textContent =
      "Admin";

  }

}


// ========================================
// CARGAR DATOS DEL SHEET
// ========================================

async function cargarDatosSheet() {

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

}


// ========================================
// CONTAR REPRESENTANTES
// ========================================

function cargarTotalRepresentantes() {

  const ids =
    new Set();


  for (
    const representante
    of representantes
  ) {

    ids.add(
      representante.id
        .trim()
        .toUpperCase()
    );

  }


  totalRepresentantes.textContent =
    ids.size;

}


// ========================================
// CONTAR PAPELITOS CONFIRMADOS
// ========================================

function cargarPapelitosConfirmados() {

  let total = 0;


  for (
    const representante
    of representantes
  ) {

    const estado =
      normalizarTexto(
        representante.estado
      );


    if (
      estado ===
      "confirmado"
    ) {

      total++;

    }

  }


  papelitosConfirmados.textContent =
    total;

}


// ========================================
// CONTAR GAFETES ENVIADOS
// ========================================

async function cargarGafetesEnviados() {

  try {

    const referencia =
      collection(
        db,
        "gafetes"
      );


    const consulta =
      query(
        referencia,
        where(
          "enviado",
          "==",
          true
        )
      );


    const resultado =
      await getDocs(
        consulta
      );


    gafetesEnviados.textContent =
      resultado.size;

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
// CONTAR PROBLEMAS
// ========================================

function cargarTotalProblemas() {

  let total = 0;


  // ========================================
  // DATOS FALTANTES
  // ========================================

  for (
    const representante
    of representantes
  ) {

    if (
      !representante.zona
    ) {

      total++;

    }


    if (
      !representante.fecha
    ) {

      total++;

    }


    if (
      !representante.instagram
    ) {

      total++;

    }


    if (
      !representante.nombre
    ) {

      total++;

    }

  }


  // ========================================
  // IDS CON DATOS DISTINTOS
  // ========================================

  const gruposId =
    new Map();


  for (
    const representante
    of representantes
  ) {

    const id =
      normalizarTexto(
        representante.id
      );


    if (
      !gruposId.has(id)
    ) {

      gruposId.set(
        id,
        []
      );

    }


    gruposId
      .get(id)
      .push(
        representante
      );

  }


  for (
    const registros
    of gruposId.values()
  ) {

    if (
      registros.length < 2
    ) {

      continue;

    }


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
      nombres.size > 1 ||
      instagrams.size > 1
    ) {

      total++;

    }

  }


  // ========================================
  // INSTAGRAM CON IDS DISTINTOS
  // ========================================

  const gruposInstagram =
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


    if (
      !gruposInstagram
        .has(instagram)
    ) {

      gruposInstagram.set(
        instagram,
        []
      );

    }


    gruposInstagram
      .get(instagram)
      .push(
        representante
      );

  }


  for (
    const registros
    of gruposInstagram.values()
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
      ids.size > 1
    ) {

      total++;

    }

  }


  totalProblemas.textContent =
    total;

}


// ========================================
// CARGAR DASHBOARD
// ========================================

async function cargarDashboard(
  user
) {

  await cargarPerfilAdmin(
    user
  );


  try {

    /*
      El Sheet se descarga UNA sola vez.

      De ahí calculamos:
      - representantes
      - papelitos
      - problemas
    */

    await cargarDatosSheet();


    cargarTotalRepresentantes();

    cargarPapelitosConfirmados();

    cargarTotalProblemas();

  }

  catch (error) {

    console.error(
      "Error cargando datos del Sheet:",
      error
    );


    totalRepresentantes.textContent =
      "—";

    papelitosConfirmados.textContent =
      "—";

    totalProblemas.textContent =
      "—";

  }


  await cargarGafetesEnviados();

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

    await signOut(
      auth
    );


    window.location.href =
      "./";

  }
);


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
  localStorage.getItem(
    "temaAdmin"
  ) || "dark";


aplicarTema(
  temaGuardado
);


themeToggle.addEventListener(
  "click",
  () => {

    const temaActual =
      document.documentElement
        .getAttribute(
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
