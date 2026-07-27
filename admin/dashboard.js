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

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);


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

const gafetesEnviados =
  document.getElementById("gafetesEnviados");


// ========================================
// GOOGLE SHEETS
// ========================================

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmA9mpebsNjPcTYMsklHNKShcPVEdU_xTkn-oHVjqil9SP1KrjPO8V1lEqxqnY-dna2IJY0BOUvg-/pub?gid=77234656&single=true&output=csv";


// ========================================
// LEER CSV
// ========================================

function parsearCSV(texto) {

  const filas = [];

  let fila = [];
  let campo = "";
  let dentroComillas = false;

  for (let i = 0; i < texto.length; i++) {

    const caracter = texto[i];
    const siguiente = texto[i + 1];

    if (
      caracter === '"' &&
      dentroComillas &&
      siguiente === '"'
    ) {

      campo += '"';
      i++;

    }

    else if (caracter === '"') {

      dentroComillas = !dentroComillas;

    }

    else if (
      caracter === "," &&
      !dentroComillas
    ) {

      fila.push(campo);
      campo = "";

    }

    else if (
      (caracter === "\n" ||
       caracter === "\r") &&
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
          valor => valor.trim() !== ""
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
        valor => valor.trim() !== ""
      )
    ) {
      filas.push(fila);
    }

  }

  return filas;

}


// ========================================
// CARGAR PERFIL DEL ADMIN
// ========================================

async function cargarPerfilAdmin(user) {

  try {

    const referencia =
      doc(
        db,
        "admins",
        user.uid
      );

    const documento =
      await getDoc(referencia);


    if (documento.exists()) {

      const datos =
        documento.data();

      nombreAdmin.textContent =
        datos.usuario || "Admin";

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
// CONTAR REPRESENTANTES
// ========================================

async function cargarTotalRepresentantes() {

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


    /*
      Contamos IDs válidos de la primera
      columna y evitamos contar el encabezado.
    */

    const ids = new Set();


    for (const fila of filas) {

      const id =
        (fila[0] || "")
          .trim()
          .toUpperCase();


      if (
        id.startsWith("FPHS-MX-")
      ) {

        ids.add(id);

      }

    }


    totalRepresentantes.textContent =
      ids.size;

  }

  catch (error) {

    console.error(
      "Error contando representantes:",
      error
    );

    totalRepresentantes.textContent =
      "—";

  }

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
      await getDocs(consulta);


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
// CARGAR DASHBOARD
// ========================================

async function cargarDashboard(user) {

  await cargarPerfilAdmin(user);

  await Promise.all([
    cargarTotalRepresentantes(),
    cargarGafetesEnviados()
  ]);

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

      await cargarDashboard(user);

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

    await signOut(auth);

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
    tema === "dark" ? "☀️" : "🌙";

}


const temaGuardado =
  localStorage.getItem("temaAdmin") || "dark";

aplicarTema(temaGuardado);


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

    aplicarTema(nuevoTema);

    localStorage.setItem(
      "temaAdmin",
      nuevoTema
    );

  }
);
