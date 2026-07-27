import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

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

const cargando =
  document.getElementById("cargando");

const contenido =
  document.getElementById("contenido");

const logoutButton =
  document.getElementById("logoutButton");

const idInput =
  document.getElementById("idRepresentante");

const buscarButton =
  document.getElementById("buscarRepresentante");

const estado =
  document.getElementById("estado");

const datosEncontrados =
  document.getElementById("datosEncontrados");

const datoNombre =
  document.getElementById("datoNombre");

const datoZona =
  document.getElementById("datoZona");

const datoId =
  document.getElementById("datoId");

const textoNombre =
  document.getElementById("textoNombre");

const textoZona =
  document.getElementById("textoZona");

const textoId =
  document.getElementById("textoId");

const qrContainer =
  document.getElementById("qrContainer");


const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmA9mpebsNjPcTYMsklHNKShcPVEdU_xTkn-oHVjqil9SP1KrjPO8V1lEqxqnY-dna2IJY0BOUvg-/pub?gid=77234656&single=true&output=csv";


const REPRESENTANTE_URL =
  "https://hsmx-offan.github.io/representantes-fphs/representante.html?id=";


// ========================================
// VERIFICAR SESIÓN ADMIN
// ========================================

onAuthStateChanged(auth, (user) => {

  if (user) {

    cargando.style.display = "none";
    contenido.style.display = "block";

  } else {

    window.location.href = "./";

  }

});


// ========================================
// CERRAR SESIÓN
// ========================================

logoutButton.addEventListener(
  "click",
  async () => {

    await signOut(auth);

    window.location.href = "./";

  }
);


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
      (caracter === "\n" || caracter === "\r") &&
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
    filas.push(fila);

  }

  return filas;

}


// ========================================
// GENERAR QR
// ========================================

function generarQR(idRepresentante) {

  const urlRepresentante =
    REPRESENTANTE_URL +
    encodeURIComponent(idRepresentante);

  qrContainer.innerHTML = "";

new QRCode(qrContainer, {

  text: urlRepresentante,

  width: 260,

  height: 260,

  colorDark: "#ffffff",
  colorLight: "#000000",

  correctLevel:
    QRCode.CorrectLevel.H

});

}


// ========================================
// BUSCAR REPRESENTANTE
// ========================================

async function buscarRepresentante() {

  const idBuscado =
    idInput.value
      .trim()
      .toUpperCase();

  if (!idBuscado) {

    estado.textContent =
      "Escribe un ID.";

    datosEncontrados.style.display =
      "none";

    textoNombre.textContent = "";
    textoZona.textContent = "";
    textoId.textContent = "";

    qrContainer.innerHTML = "";

    return;

  }


  estado.textContent =
    "Buscando representante...";

  datosEncontrados.style.display =
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


    let representante = null;


    for (const fila of filas) {

      const id =
        (fila[0] || "")
          .trim()
          .toUpperCase();


      if (id === idBuscado) {

        representante = {

          id:
            (fila[0] || "")
              .trim(),

          zona:
            (fila[2] || "")
              .trim(),

          nombre:
            (fila[3] || "")
              .trim()

        };

        break;

      }

    }


    if (!representante) {

      estado.textContent =
        "No encontré ese ID.";

      textoNombre.textContent = "";
      textoZona.textContent = "";
      textoId.textContent = "";

      qrContainer.innerHTML = "";

      datosEncontrados.style.display =
        "none";

      return;

    }


    // DATOS ENCONTRADOS

    estado.textContent =
      "Representante encontrado.";

    datoNombre.textContent =
      representante.nombre;

    datoZona.textContent =
      representante.zona;

    datoId.textContent =
      representante.id;

    datosEncontrados.style.display =
      "block";


    // DATOS EN EL GAFETE

    textoNombre.textContent =
      representante.nombre;

    textoZona.textContent =
      representante.zona;

    textoId.textContent =
      representante.id;


    // QR AUTOMÁTICO

    generarQR(
      representante.id
    );

  }

  catch (error) {

    console.error(error);

    estado.textContent =
      "Hubo un error al leer la lista de representantes.";

    qrContainer.innerHTML = "";

  }

}


// ========================================
// BOTÓN BUSCAR
// ========================================

buscarButton.addEventListener(
  "click",
  buscarRepresentante
);


// ========================================
// BUSCAR AL PRESIONAR ENTER
// ========================================

idInput.addEventListener(
  "keydown",
  (event) => {

    if (event.key === "Enter") {

      buscarRepresentante();

    }

  }
);
// ========================================
// DESCARGAR GAFETE EN PNG
// ========================================

const descargarButton =
  document.getElementById("descargarGafete");

const gafeteBase =
  document.getElementById("gafeteBase");


descargarButton.addEventListener(
  "click",
  async () => {

    const nombre =
      datoNombre.textContent.trim();

    const zona =
      datoZona.textContent.trim();

    const id =
      datoId.textContent.trim();


    // Evitar descargar si no se ha buscado representante

    if (!id) {

      estado.textContent =
        "Primero busca un representante.";

      return;

    }


    // Crear canvas con el tamaño ORIGINAL del gafete

    const canvas =
      document.createElement("canvas");

    canvas.width =
      gafeteBase.naturalWidth;

    canvas.height =
      gafeteBase.naturalHeight;

    const ctx =
      canvas.getContext("2d");


    // Dibujar imagen base

    ctx.drawImage(
      gafeteBase,
      0,
      0,
      canvas.width,
      canvas.height
    );


    // ========================================
    // CONFIGURACIÓN DEL TEXTO
    // ========================================

    ctx.fillStyle = "#ffffff";

    ctx.font =
      `600 ${canvas.width * 0.031}px Arial`;

    ctx.textBaseline = "top";


    // Nombre

    ctx.fillText(
      nombre,
      canvas.width * 0.35,
      canvas.height * 0.522
    );


    // Zona

    ctx.fillText(
      zona,
      canvas.width * 0.35,
      canvas.height * 0.57
    );


    // ID

    ctx.fillText(
      id,
      canvas.width * 0.35,
      canvas.height * 0.62
    );


    // ========================================
    // DIBUJAR QR
    // ========================================

    const qrCanvas =
      qrContainer.querySelector("canvas");

    const qrImagen =
      qrContainer.querySelector("img");

    const qrX =
      canvas.width * 0.39;

    const qrY =
      canvas.height * 0.665;

    const qrSize =
      canvas.width * 0.22;


    if (qrCanvas) {

      ctx.drawImage(
        qrCanvas,
        qrX,
        qrY,
        qrSize,
        qrSize
      );

    }

    else if (qrImagen) {

      await new Promise((resolve) => {

        if (qrImagen.complete) {

          resolve();

        } else {

          qrImagen.onload = resolve;

        }

      });


      ctx.drawImage(
        qrImagen,
        qrX,
        qrY,
        qrSize,
        qrSize
      );

    }


    // ========================================
    // DESCARGAR PNG
    // ========================================

    const enlace =
      document.createElement("a");

    enlace.download =
      `Gafete-${id}.png`;

    enlace.href =
      canvas.toDataURL("image/png");

    enlace.click();

  }
);
