/* ========================================
   COLOR MANAGER
   CONTROLADOR PRINCIPAL
   ======================================== */

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  auth
} from "./shared/firebase.js";

import {
  crearTemaController
} from "./shared/tema.js";

import {
  cargarPerfilAdmin
} from "./dashboard/perfil.js";

import {
  iniciarEventos,
  editarEventoSeleccionado
} from "./modulos/color-manager/eventos/index.js";

import {
  renderFechas
} from "./modulos/color-manager/fechas/index.js";
import {
  renderZonas
} from "./modulos/color-manager/zonas/index.js";
import {
  renderFanProjects
} from "./modulos/color-manager/fan-projects/index.js";


// ========================================
// ELEMENTOS GENERALES
// ========================================

const elementosGenerales = {

  cargando:
    document.getElementById(
      "cargando"
    ),

  contenido:
    document.getElementById(
      "contenido"
    ),

  nombreAdmin:
    document.getElementById(
      "nombreAdmin"
    ),

  themeToggle:
    document.getElementById(
      "themeToggle"
    ),

  logoutButton:
    document.getElementById(
      "logoutButton"
    ),

  toast:
    document.getElementById(
      "toast"
    )

};


// ========================================
// ELEMENTOS DE EDICIONES
// ========================================

const elementosEventos = {

  vistaPrincipal:
    document.getElementById(
      "vistaPrincipal"
    ),

  eventoActivo:
    document.getElementById(
      "eventoActivo"
    ),

  btnCrearEvento:
    document.getElementById(
      "btnCrearEvento"
    ),

  cargandoEventos:
    document.getElementById(
      "cargandoEventos"
    ),

  sinEventos:
    document.getElementById(
      "sinEventos"
    ),

  listaEventos:
    document.getElementById(
      "listaEventos"
    )

};


// ========================================
// ELEMENTOS DE LA VISTA INTERNA
// ========================================

const elementosVistaEvento = {

  vista:
    document.getElementById(
      "vistaEvento"
    ),

  volver:
    document.getElementById(
      "volverEventos"
    ),

  titulo:
    document.getElementById(
      "tituloEvento"
    ),

  descripcion:
    document.getElementById(
      "descripcionEvento"
    ),

  editar:
    document.getElementById(
      "editarEventoActual"
    ),

  contenidoManager:
    document.getElementById(
      "contenidoManager"
    ),

  tabs:
    document.querySelectorAll(
      ".tab-manager"
    )

};


// ========================================
// ESTADO DEL CONTROLADOR
// ========================================

const estado = {

  eventoSeleccionado:
    null,

  moduloActual:
    "fechas"

};


// ========================================
// TEMA
// ========================================

const temaController =
  crearTemaController({
    botonTema:
      elementosGenerales.themeToggle
  });

temaController.iniciarTema();


// ========================================
// INTERFAZ GENERAL
// ========================================

function mostrarInterfaz() {

  sessionStorage.setItem(
    "accesoAdmin",
    "1"
  );


  if (
    elementosGenerales.cargando
  ) {

    elementosGenerales.cargando.remove();

  }


  if (
    elementosGenerales.contenido
  ) {

    elementosGenerales.contenido.style.display =
      "block";

  }

}


// ========================================
// TOAST
// ========================================

let temporizadorToast =
  null;


function mostrarToast(
  mensaje
) {

  if (
    !elementosGenerales.toast
  ) {

    return;

  }


  clearTimeout(
    temporizadorToast
  );


  elementosGenerales.toast.textContent =
    mensaje;

  elementosGenerales.toast.classList.add(
    "visible"
  );


  temporizadorToast =
    setTimeout(
      () => {

        elementosGenerales.toast.classList.remove(
          "visible"
        );

      },
      2800
    );

}


// ========================================
// ESCAPAR HTML
// ========================================

function escaparHTML(
  texto
) {

  return String(
    texto ?? ""
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


// ========================================
// OBTENER EVENTO SELECCIONADO
// ========================================

function obtenerEventoSeleccionado() {

  return estado.eventoSeleccionado;

}


// ========================================
// MARCAR PESTAÑA ACTIVA
// ========================================

function marcarPestanaActiva(
  modulo
) {

  for (
    const tab
    of elementosVistaEvento.tabs
  ) {

    const seleccionada =
      tab.dataset.tab === modulo;


    tab.classList.toggle(
      "activa",
      seleccionada
    );


    tab.setAttribute(
      "aria-selected",
      seleccionada
        ? "true"
        : "false"
    );

  }

}


// ========================================
// MOSTRAR INFORMACIÓN
// ========================================

function mostrarInformacionEvento() {

  const evento =
    obtenerEventoSeleccionado();


  if (
    !evento
  ) {

    elementosVistaEvento.contenidoManager.innerHTML =
      `
        <div class="sin-registros">

          <strong>
            No hay una edición seleccionada
          </strong>

        </div>
      `;

    return;

  }


  elementosVistaEvento.contenidoManager.innerHTML =
    `
      <div class="informacion-evento">

        <h3>
          Información de la edición
        </h3>

        <p>
          <strong>Nombre:</strong>
          ${escaparHTML(
            evento.nombre
          )}
        </p>

        <p>
          <strong>Año:</strong>
          ${escaparHTML(
            evento.anio
          )}
        </p>

        <p>
          <strong>Ciudad:</strong>
          ${escaparHTML(
            evento.ciudad
          )}
        </p>

        <p>
          <strong>País:</strong>
          ${escaparHTML(
            evento.pais
          )}
        </p>

        <p>
          <strong>Estado:</strong>
          ${
            evento.activo === true
              ? "Activo"
              : "Inactivo"
          }
        </p>

      </div>
    `;

}


// ========================================
// MÓDULOS TEMPORALES
// ========================================

function mostrarModuloPendiente({
  titulo,
  descripcion
}) {

  elementosVistaEvento.contenidoManager.innerHTML =
    `
      <div class="sin-registros">

        <strong>
          ${escaparHTML(
            titulo
          )}
        </strong>

        <p>
          ${escaparHTML(
            descripcion
          )}
        </p>

      </div>
    `;

}


// ========================================
// MOSTRAR MÓDULO
// ========================================

async function mostrarModulo(
  modulo
) {

  if (
    !estado.eventoSeleccionado
  ) {

    return;

  }


  estado.moduloActual =
    modulo;


  marcarPestanaActiva(
    modulo
  );


  try {

    switch (
      modulo
    ) {

      case "fechas":

        await renderFechas({

          eventoId:
            estado.eventoSeleccionado.id,

          contenedor:
            elementosVistaEvento.contenidoManager,

          mostrarToast

        });

        break;


      case "zonas":

  await renderZonas({

    eventoId:
      estado.eventoSeleccionado.id,

    contenedor:
      elementosVistaEvento.contenidoManager,

    mostrarToast

  });

  break;


      case "fanprojects":

  await renderFanProjects({

    eventoId:
      estado.eventoSeleccionado.id,

    contenedor:
      elementosVistaEvento.contenidoManager,

    mostrarToast,

    alAbrirColores:
      fanProject => {

        mostrarToast(
          `Administrar colores de ${fanProject.nombre}`
        );

      }

  });

  break;


      case "informacion":

        mostrarInformacionEvento();

        break;


      default:

        mostrarModuloPendiente({

          titulo:
            "Módulo no disponible",

          descripcion:
            "No se encontró la sección solicitada."

        });

    }

  }

  catch (error) {

    console.error(
      `Error cargando el módulo ${modulo}:`,
      error
    );


    mostrarToast(
      "No se pudo cargar el módulo"
    );


    elementosVistaEvento.contenidoManager.innerHTML =
      `
        <div class="sin-registros">

          <span class="estado-icono">
            ⚠️
          </span>

          <strong>
            No se pudo cargar esta sección
          </strong>

          <p>
            Revisa la consola del navegador.
          </p>

        </div>
      `;

  }

}


// ========================================
// ABRIR EDICIÓN
// ========================================

async function abrirEvento(
  evento
) {

  if (
    !evento
  ) {

    mostrarToast(
      "No se encontró la edición"
    );

    return;

  }


  estado.eventoSeleccionado =
    evento;


  elementosVistaEvento.titulo.textContent =
    evento.nombre ||
    evento.id;


  elementosVistaEvento.descripcion.textContent =
    `${evento.ciudad || ""}, ${evento.pais || ""} · ${evento.anio || ""}`;


  elementosEventos.vistaPrincipal.hidden =
    true;

  elementosVistaEvento.vista.hidden =
    false;


  await mostrarModulo(
    "fechas"
  );

}


// ========================================
// VOLVER A EDICIONES
// ========================================

function volverAEdiciones() {

  estado.eventoSeleccionado =
    null;

  estado.moduloActual =
    "fechas";


  elementosVistaEvento.vista.hidden =
    true;

  elementosEventos.vistaPrincipal.hidden =
    false;


  elementosVistaEvento.contenidoManager.innerHTML =
    "";

}


// ========================================
// EDITAR EDICIÓN ABIERTA
// ========================================

function editarEdicionActual() {

  if (
    !estado.eventoSeleccionado
  ) {

    return;

  }


  editarEventoSeleccionado(
    estado.eventoSeleccionado.id
  );

}


// ========================================
// CERRAR SESIÓN
// ========================================

async function cerrarSesion() {

  elementosGenerales.logoutButton.disabled =
    true;


  try {

    sessionStorage.removeItem(
      "accesoAdmin"
    );


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


    elementosGenerales.logoutButton.disabled =
      false;


    mostrarToast(
      "No se pudo cerrar la sesión"
    );

  }

}


// ========================================
// REGISTRAR EVENTOS GENERALES
// ========================================

function registrarEventos() {

  elementosVistaEvento.volver.addEventListener(
    "click",
    volverAEdiciones
  );


  elementosVistaEvento.editar.addEventListener(
    "click",
    editarEdicionActual
  );


  for (
    const tab
    of elementosVistaEvento.tabs
  ) {

    tab.addEventListener(
      "click",
      async () => {

        await mostrarModulo(
          tab.dataset.tab
        );

      }
    );

  }


  elementosGenerales.logoutButton.addEventListener(
    "click",
    cerrarSesion
  );

}


// ========================================
// INICIAR ADMIN
// ========================================

async function iniciarAdmin(
  user
) {

  mostrarInterfaz();


  try {

    const nombre =
      await cargarPerfilAdmin(
        user
      );


    if (
      elementosGenerales.nombreAdmin
    ) {

      elementosGenerales.nombreAdmin.textContent =
        nombre;

    }

  }

  catch (error) {

    console.error(
      "Error cargando perfil:",
      error
    );

  }


  await iniciarEventos({

    elementos:
      elementosEventos,

    mostrarToast,

    alAbrirEvento:
      abrirEvento

  });

}


// ========================================
// REDIRIGIR AL LOGIN
// ========================================

function redirigirAlLogin() {

  sessionStorage.removeItem(
    "accesoAdmin"
  );


  window.location.href =
    "./";

}


// ========================================
// INICIAR PÁGINA
// ========================================

function iniciarPagina() {

  registrarEventos();


  onAuthStateChanged(
    auth,
    async user => {

      if (
        !user
      ) {

        redirigirAlLogin();

        return;

      }


      await iniciarAdmin(
        user
      );

    }
  );

}


iniciarPagina();
