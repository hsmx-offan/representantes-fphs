import {
  auth
} from "../shared/firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  crearTemaController
} from "../shared/tema.js";

import {
  cargarPerfilAdmin
} from "../dashboard/perfil.js";
import {
  cargarPerfilAdmin
} from "../dashboard/perfil.js";
import {
  crearControlEstadoGafete
} from "./estado.js";

import {
  crearBuscadorRepresentante
} from "./busqueda.js";

import {
  inicializarDescarga
} from "./descarga.js";


// ========================================
// ELEMENTOS GENERALES
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


// ========================================
// ELEMENTOS DEL BUSCADOR
// ========================================

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


// ========================================
// ELEMENTOS DEL GAFETE
// ========================================

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


// ========================================
// ELEMENTOS DEL ESTADO
// ========================================

const estadoGafete =
  document.getElementById("estadoGafete");

const textoEstadoGafete =
  document.getElementById("textoEstadoGafete");

const detalleEstadoGafete =
  document.getElementById("detalleEstadoGafete");

const cambiarEstadoGafete =
  document.getElementById("cambiarEstadoGafete");


// ========================================
// TEMA
// ========================================

crearTemaController({
  botonTema: themeToggle
}).iniciarTema();


// ========================================
// MOSTRAR INTERFAZ
// ========================================

function mostrarInterfaz() {

  sessionStorage.setItem(
    "accesoAdmin",
    "1"
  );

  if (cargando) {

    cargando.style.display =
      "none";

  }

  if (contenido) {

    contenido.style.display =
      "block";

  }

}


// ========================================
// CONTROL DEL ESTADO DEL GAFETE
// ========================================

const controlEstadoGafete =
  crearControlEstadoGafete({
    estadoGafete,
    textoEstadoGafete,
    detalleEstadoGafete,
    cambiarEstadoGafete
  });


// ========================================
// BUSCADOR
// ========================================

const buscadorRepresentante =
  crearBuscadorRepresentante({
    idInput,
    estado,
    datosEncontrados,
    datoNombre,
    datoId,
    textoNombre,
    textoId,
    qrContainer,
    controlEstadoGafete
  });


// ========================================
// DESCARGA
// ========================================

inicializarDescarga({
  descargarButton,
  gafeteBase,
  qrContainer,
  datoNombre,
  datoId,
  estado
});


// ========================================
// BOTÓN BUSCAR
// ========================================

buscarButton.addEventListener(
  "click",
  () => {

    buscadorRepresentante
      .buscarRepresentante();

  }
);


// ========================================
// BUSCAR CON ENTER
// ========================================

idInput.addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {

      buscadorRepresentante
        .buscarRepresentante();

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

      sessionStorage.removeItem(
        "accesoAdmin"
      );

      await signOut(auth);

      window.location.href =
        "./";

    }

    catch (error) {

      console.error(
        "Error cerrando sesión:",
        error
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

      sessionStorage.removeItem(
        "accesoAdmin"
      );

      window.location.href =
        "./";

      return;

    }

    /*
      Mostramos el panel inmediatamente
      después de confirmar la sesión.

      El perfil y la búsqueda automática
      pueden seguir cargando después.
    */

    mostrarInterfaz();


    try {

      const nombreAdmin =
  await cargarPerfilAdmin(user);

controlEstadoGafete
  .establecerNombreAdmin(
    nombreAdmin
  );

if (nombreAdminElemento) {

  nombreAdminElemento.textContent =
    nombreAdmin;

}


      // ==================================
      // ID RECIBIDO DESDE REPRESENTANTES
      // ==================================

      const parametros =
        new URLSearchParams(
          window.location.search
        );

      const idRecibido =
        parametros.get("id");


      if (idRecibido) {

        idInput.value =
          idRecibido
            .trim()
            .toUpperCase();

        await buscadorRepresentante
          .buscarRepresentante();

      }

    }

    catch (error) {

      console.error(
        "Error iniciando el panel:",
        error
      );

      estado.textContent =
        "No se pudo cargar completamente el panel.";

    }

  }
);
