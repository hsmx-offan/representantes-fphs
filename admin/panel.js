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
  setDoc,
  serverTimestamp
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

const datoId =
  document.getElementById("datoId");

const textoNombre =
  document.getElementById("textoNombre");

const textoId =
  document.getElementById("textoId");

const qrContainer =
  document.getElementById("qrContainer");

const descargarButton =
  document.getElementById("descargarGafete");

const gafeteBase =
  document.getElementById("gafeteBase");


// NUEVOS ELEMENTOS DEL ESTADO DEL GAFETE

const estadoGafete =
  document.getElementById("estadoGafete");

const textoEstadoGafete =
  document.getElementById("textoEstadoGafete");

const detalleEstadoGafete =
  document.getElementById("detalleEstadoGafete");

const cambiarEstadoGafete =
  document.getElementById("cambiarEstadoGafete");


// ========================================
// VARIABLES
// ========================================

let usuarioActual = null;

let idRepresentanteActual = "";

let gafeteEstaEnviado = false;


// ========================================
// URLS
// ========================================

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmA9mpebsNjPcTYMsklHNKShcPVEdU_xTkn-oHVjqil9SP1KrjPO8V1lEqxqnY-dna2IJY0BOUvg-/pub?gid=77234656&single=true&output=csv";

const REPRESENTANTE_URL =
  "https://hsmx-offan.github.io/representantes-fphs/representante.html?id=";


// ========================================
// VERIFICAR SESIÓN ADMIN
// ========================================

onAuthStateChanged(auth, (user) => {

  if (user) {

    usuarioActual = user;

    cargando.style.display = "none";
    contenido.style.display = "block";

  } else {

    usuarioActual = null;

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
// LIMPIAR ESTADO DEL GAFETE
// ========================================

function limpiarEstadoGafete() {

  idRepresentanteActual = "";

  gafeteEstaEnviado = false;

  estadoGafete.style.display = "none";

  textoEstadoGafete.textContent = "";

  detalleEstadoGafete.textContent = "";

  cambiarEstadoGafete.textContent =
    "Marcar como enviado";

}


// ========================================
// MOSTRAR ESTADO DEL GAFETE
// ========================================

function mostrarEstadoGafete(datos) {

  estadoGafete.style.display = "block";

  gafeteEstaEnviado =
    datos?.enviado === true;


  if (gafeteEstaEnviado) {

    textoEstadoGafete.textContent =
      "✅ Enviado";

    cambiarEstadoGafete.textContent =
      "Marcar como pendiente";


    let detalle = "";

    if (
      datos.fechaEnvio &&
      typeof datos.fechaEnvio.toDate === "function"
    ) {

      const fecha =
        datos.fechaEnvio.toDate();

      detalle =
        fecha.toLocaleString(
          "es-MX",
          {
            dateStyle: "medium",
            timeStyle: "short"
          }
        );

    }


    if (datos.admin) {

      if (detalle) {
        detalle += " · ";
      }

      detalle +=
        `Marcado por ${datos.admin}`;

    }


    detalleEstadoGafete.textContent =
      detalle;

  }

  else {

    textoEstadoGafete.textContent =
      "⏳ Pendiente de envío";

    detalleEstadoGafete.textContent =
      "";

    cambiarEstadoGafete.textContent =
      "Marcar como enviado";

  }

}


// ========================================
// CONSULTAR ESTADO DEL GAFETE
// ========================================

async function consultarEstadoGafete(
  idRepresentante
) {

  idRepresentanteActual =
    idRepresentante;

  estadoGafete.style.display =
    "block";

  textoEstadoGafete.textContent =
    "Consultando...";

  detalleEstadoGafete.textContent =
    "";

  cambiarEstadoGafete.disabled =
    true;


  try {

    const referencia =
      doc(
        db,
        "gafetes",
        idRepresentante
      );

    const documento =
      await getDoc(referencia);


    if (!documento.exists()) {

      mostrarEstadoGafete({
        enviado: false
      });

      return;

    }


    mostrarEstadoGafete(
      documento.data()
    );

  }

  catch (error) {

    console.error(
      "Error consultando estado del gafete:",
      error
    );

    textoEstadoGafete.textContent =
      "No se pudo consultar el estado.";

    detalleEstadoGafete.textContent =
      "";

  }

  finally {

    cambiarEstadoGafete.disabled =
      false;

  }

}


// ========================================
// CAMBIAR ESTADO DEL GAFETE
// ========================================

cambiarEstadoGafete.addEventListener(
  "click",
  async () => {

    if (!idRepresentanteActual) {

      return;

    }


    cambiarEstadoGafete.disabled =
      true;


    try {

      const referencia =
        doc(
          db,
          "gafetes",
          idRepresentanteActual
        );


      // ========================================
      // MARCAR COMO ENVIADO
      // ========================================

      if (!gafeteEstaEnviado) {

        await setDoc(
          referencia,
          {

            enviado: true,

            fechaEnvio:
              serverTimestamp(),

            admin:
              usuarioActual?.email || "Admin"

          },
          {
            merge: true
          }
        );

      }


      // ========================================
      // REGRESAR A PENDIENTE
      // ========================================

      else {

        await setDoc(
          referencia,
          {

            enviado: false,

            fechaEnvio: null,

            admin: ""

          },
          {
            merge: true
          }
        );

      }


      await consultarEstadoGafete(
        idRepresentanteActual
      );

  }

  catch (error) {

    console.error(
      "Error cambiando estado del gafete:",
      error
    );

    textoEstadoGafete.textContent =
      "No se pudo guardar el cambio.";

  }

  finally {

    cambiarEstadoGafete.disabled =
      false;

  }

});


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
    textoId.textContent = "";

    qrContainer.innerHTML = "";

    limpiarEstadoGafete();

    return;

  }


  estado.textContent =
    "Buscando representante...";

  datosEncontrados.style.display =
    "none";

  limpiarEstadoGafete();


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
      textoId.textContent = "";

      qrContainer.innerHTML = "";

      datosEncontrados.style.display =
        "none";

      limpiarEstadoGafete();

      return;

    }


    // ========================================
    // DATOS ENCONTRADOS
    // ========================================

    estado.textContent =
      "Representante encontrado.";

    datoNombre.textContent =
      representante.nombre;

    datoId.textContent =
      representante.id;

    datosEncontrados.style.display =
      "block";


    // ========================================
    // DATOS EN EL GAFETE
    // ========================================

    textoNombre.textContent =
      representante.nombre;

    textoId.textContent =
      representante.id;


    // ========================================
    // QR AUTOMÁTICO
    // ========================================

    generarQR(
      representante.id
    );


    // ========================================
    // CONSULTAR SI YA FUE ENVIADO
    // ========================================

    await consultarEstadoGafete(
      representante.id
    );

  }

  catch (error) {

    console.error(error);

    estado.textContent =
      "Hubo un error al leer la lista de representantes.";

    qrContainer.innerHTML = "";

    limpiarEstadoGafete();

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

descargarButton.addEventListener(
  "click",
  async () => {

    const nombre =
      datoNombre.textContent.trim();

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


    // ========================================
    // DIBUJAR IMAGEN BASE
    // ========================================

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
      `600 ${canvas.width * 0.050}px Arial`;

    ctx.textBaseline = "top";


    // ========================================
    // NOMBRE
    // ========================================

    ctx.fillText(
      nombre,
      canvas.width * 0.35,
      canvas.height * 0.528
    );


    // ========================================
    // ID
    // ========================================

    ctx.fillText(
      id,
      canvas.width * 0.35,
      canvas.height * 0.617
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

        }

        else {

          qrImagen.onload =
            resolve;

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
