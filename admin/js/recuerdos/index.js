// ========================================
// IMPORTS
// ========================================

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  auth
} from "../shared/firebase.js";

import {
  crearToastController
} from "../shared/toast.js";

import {
  crearTemaController
} from "../shared/tema.js";

import {
  cargarPerfilAdmin
} from "../dashboard/perfil.js";

import {
  obtenerRecuerdos,
  cambiarEstadoRecuerdo,
  cambiarDestacadoRecuerdo
} from "./firebase.js";

import {
  crearTarjetaRecuerdo
} from "./cards.js";
import {
  cargarModalRecuerdo
} from "./cargarModal.js";
import {
  iniciarModalRecuerdo,
  abrirModalRecuerdo
} from "./modal.js";

// ========================================
// ELEMENTOS DEL HTML
// ========================================

const elementos = {
  cargando:
    document.getElementById("cargando"),

  contenido:
    document.getElementById("contenido"),

  nombreAdmin:
    document.getElementById("nombreAdmin"),

  themeToggle:
    document.getElementById("themeToggle"),

  logoutButton:
    document.getElementById("logoutButton"),

  toast:
    document.getElementById("toast"),

  totalPendientes:
    document.getElementById("totalPendientes"),

  totalAprobados:
    document.getElementById("totalAprobados"),

  totalDestacados:
    document.getElementById("totalDestacados"),

  totalRechazados:
    document.getElementById("totalRechazados"),

  busqueda:
    document.getElementById("busqueda"),

  filtroEstado:
    document.getElementById("filtroEstado"),

  filtroFecha:
    document.getElementById("filtroFecha"),

  gridRecuerdos:
    document.getElementById("gridRecuerdos"),

  estadoVacio:
    document.getElementById("estadoVacio")
};


// ========================================
// ESTADO
// ========================================

let recuerdos = [];
let usuarioActual = null;
let nombreAdminActual = "Admin";
let procesandoAccion = false;


// ========================================
// TEMA
// ========================================

const temaController =
  crearTemaController({
    botonTema:
      elementos.themeToggle
  });

temaController.iniciarTema();
// ========================================
// CARGAR MODAL
// ========================================

await cargarModalRecuerdo();

iniciarModalRecuerdo();

// ========================================
// TOAST
// ========================================

const {
  mostrarToast
} = crearToastController({
  toast:
    elementos.toast
});


// ========================================
// MOSTRAR INTERFAZ
// ========================================

function mostrarInterfaz() {

  sessionStorage.setItem(
    "accesoAdmin",
    "1"
  );

  if (elementos.cargando) {
    elementos.cargando.style.display =
      "none";
  }

  if (elementos.contenido) {
    elementos.contenido.style.display =
      "block";
  }

}


// ========================================
// NORMALIZAR TEXTO
// ========================================

function normalizarTexto(valor) {

  return String(valor || "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim();

}


// ========================================
// ESTADÍSTICAS
// ========================================

function actualizarEstadisticas() {

  const pendientes =
    recuerdos.filter(
      recuerdo =>
        recuerdo.estado ===
        "pendiente"
    ).length;

  const aprobados =
    recuerdos.filter(
      recuerdo =>
        recuerdo.estado ===
        "aprobado"
    ).length;

  const destacados =
    recuerdos.filter(
      recuerdo =>
        recuerdo.estado ===
          "aprobado" &&
        recuerdo.destacada === true
    ).length;

  const rechazados =
    recuerdos.filter(
      recuerdo =>
        recuerdo.estado ===
          "rechazado" ||
        recuerdo.estado ===
          "oculto"
    ).length;

  if (elementos.totalPendientes) {
    elementos.totalPendientes.textContent =
      pendientes;
  }

  if (elementos.totalAprobados) {
    elementos.totalAprobados.textContent =
      aprobados;
  }

  if (elementos.totalDestacados) {
    elementos.totalDestacados.textContent =
      destacados;
  }

  if (elementos.totalRechazados) {
    elementos.totalRechazados.textContent =
      rechazados;
  }

}


// ========================================
// FILTRAR RECUERDOS
// ========================================

function obtenerRecuerdosFiltrados() {

  const textoBusqueda =
    normalizarTexto(
      elementos.busqueda?.value
    );

  const estadoSeleccionado =
    elementos.filtroEstado?.value || "";

  const fechaSeleccionada =
    elementos.filtroFecha?.value || "";

  return recuerdos.filter(
    recuerdo => {

      const nombre =
        normalizarTexto(
          recuerdo.nombre
        );

      const instagram =
        normalizarTexto(
          recuerdo.instagram
        );

      const mensaje =
        normalizarTexto(
          recuerdo.mensaje
        );

      const coincideBusqueda =
        !textoBusqueda ||
        nombre.includes(
          textoBusqueda
        ) ||
        instagram.includes(
          textoBusqueda
        ) ||
        mensaje.includes(
          textoBusqueda
        );

      let coincideEstado = true;

      if (
        estadoSeleccionado ===
        "destacado"
      ) {

        coincideEstado =
          recuerdo.estado ===
            "aprobado" &&
          recuerdo.destacada === true;

      } else if (
        estadoSeleccionado
      ) {

        coincideEstado =
          recuerdo.estado ===
          estadoSeleccionado;

      }

      const coincideFecha =
        !fechaSeleccionada ||
        recuerdo.fechaConcierto ===
          fechaSeleccionada;

      return (
        coincideBusqueda &&
        coincideEstado &&
        coincideFecha
      );

    }
  );

}


// ========================================
// ADMIN PARA REGISTRO
// ========================================

function obtenerAdminActual() {

  return {
    uid:
      usuarioActual?.uid || "",

    nombre:
      nombreAdminActual
  };

}


// ========================================
// APROBAR
// ========================================

async function aprobarRecuerdo(
  recuerdo
) {

  if (procesandoAccion) return;

  const confirmar =
    window.confirm(
      `¿Aprobar el recuerdo de ${
        recuerdo.nombre ||
        "esta persona"
      }?`
    );

  if (!confirmar) return;

  try {

    procesandoAccion = true;

    await cambiarEstadoRecuerdo(
      recuerdo.id,
      "aprobado",
      obtenerAdminActual()
    );

    recuerdo.estado =
      "aprobado";

    actualizarEstadisticas();
    renderizarRecuerdos();

    mostrarToast(
      "Recuerdo aprobado correctamente"
    );

  } catch (error) {

    console.error(
      "Error aprobando recuerdo:",
      error
    );

    mostrarToast(
      "No se pudo aprobar el recuerdo"
    );

  } finally {

    procesandoAccion = false;

  }

}


// ========================================
// RECHAZAR U OCULTAR
// ========================================

async function rechazarRecuerdo(
  recuerdo
) {

  if (procesandoAccion) return;

  const esAprobado =
    recuerdo.estado ===
    "aprobado";

  const nuevoEstado =
    esAprobado
      ? "oculto"
      : "rechazado";

  const accion =
    esAprobado
      ? "ocultar"
      : "rechazar";

  const confirmar =
    window.confirm(
      `¿Seguro que deseas ${accion} el recuerdo de ${
        recuerdo.nombre ||
        "esta persona"
      }?`
    );

  if (!confirmar) return;

  try {

    procesandoAccion = true;

    await cambiarEstadoRecuerdo(
      recuerdo.id,
      nuevoEstado,
      obtenerAdminActual()
    );

    recuerdo.estado =
      nuevoEstado;

    if (
      recuerdo.destacada === true
    ) {

      await cambiarDestacadoRecuerdo(
        recuerdo.id,
        false,
        obtenerAdminActual()
      );

      recuerdo.destacada =
        false;

    }

    actualizarEstadisticas();
    renderizarRecuerdos();

    mostrarToast(
      esAprobado
        ? "Recuerdo ocultado"
        : "Recuerdo rechazado"
    );

  } catch (error) {

    console.error(
      "Error cambiando estado:",
      error
    );

    mostrarToast(
      "No se pudo cambiar el estado"
    );

  } finally {

    procesandoAccion = false;

  }

}


// ========================================
// DESTACAR
// ========================================

async function destacarRecuerdo(
  recuerdo
) {

  if (procesandoAccion) return;

  if (
    recuerdo.estado !==
    "aprobado"
  ) {

    mostrarToast(
      "Primero debes aprobar el recuerdo"
    );

    return;

  }

  try {

    procesandoAccion = true;

    await cambiarDestacadoRecuerdo(
      recuerdo.id,
      true,
      obtenerAdminActual()
    );

    recuerdo.destacada =
      true;

    actualizarEstadisticas();
    renderizarRecuerdos();

    mostrarToast(
      "Recuerdo destacado"
    );

  } catch (error) {

    console.error(
      "Error destacando recuerdo:",
      error
    );

    mostrarToast(
      "No se pudo destacar el recuerdo"
    );

  } finally {

    procesandoAccion = false;

  }

}


// ========================================
// QUITAR DESTACADO
// ========================================

async function quitarDestacado(
  recuerdo
) {

  if (procesandoAccion) return;

  try {

    procesandoAccion = true;

    await cambiarDestacadoRecuerdo(
      recuerdo.id,
      false,
      obtenerAdminActual()
    );

    recuerdo.destacada =
      false;

    actualizarEstadisticas();
    renderizarRecuerdos();

    mostrarToast(
      "Se quitó de destacados"
    );

  } catch (error) {

    console.error(
      "Error quitando destacado:",
      error
    );

    mostrarToast(
      "No se pudo quitar el destacado"
    );

  } finally {

    procesandoAccion = false;

  }

}


// ========================================
// VER RECUERDO
// ========================================

function verRecuerdo(
  recuerdo
) {

  const cantidadFotos =
    Array.isArray(recuerdo.fotos)
      ? recuerdo.fotos.length
      : 0;

  mostrarToast(
    `${recuerdo.nombre || "Recuerdo"} · ${cantidadFotos} ${
      cantidadFotos === 1
        ? "fotografía"
        : "fotografías"
    }`
  );

  /*
    En el siguiente paso cambiaremos
    este toast por un modal completo
    con todas las fotografías.
  */

}


// ========================================
// RENDERIZAR
// ========================================

function renderizarRecuerdos() {

  if (
    !elementos.gridRecuerdos ||
    !elementos.estadoVacio
  ) {
    return;
  }

  const resultados =
    obtenerRecuerdosFiltrados();

  elementos.gridRecuerdos.innerHTML =
    "";

  if (!resultados.length) {

    elementos.gridRecuerdos.style.display =
      "none";

    elementos.estadoVacio.style.display =
      "flex";

    const titulo =
      elementos.estadoVacio
        .querySelector("strong");

    const texto =
      elementos.estadoVacio
        .querySelector("p");

    if (titulo) {
      titulo.textContent =
        recuerdos.length
          ? "No hay resultados"
          : "Todavía no hay recuerdos.";
    }

    if (texto) {
      texto.textContent =
        recuerdos.length
          ? "Prueba cambiando la búsqueda o los filtros."
          : "Las publicaciones aparecerán aquí cuando los usuarios comiencen a compartirlas.";
    }

    return;

  }

  elementos.estadoVacio.style.display =
    "none";

  elementos.gridRecuerdos.style.display =
    "grid";

  resultados.forEach(
    recuerdo => {

      const tarjeta =
        crearTarjetaRecuerdo({
          recuerdo,

          alAprobar:
            aprobarRecuerdo,

          alRechazar:
            rechazarRecuerdo,

          alDestacar:
            destacarRecuerdo,

          alQuitarDestacado:
            quitarDestacado,

          alVer:
            verRecuerdo
        });

      elementos.gridRecuerdos
        .appendChild(
          tarjeta
        );

    }
  );

}


// ========================================
// CARGAR RECUERDOS
// ========================================

async function cargarRecuerdos() {

  if (elementos.estadoVacio) {

    elementos.estadoVacio.style.display =
      "flex";

    const titulo =
      elementos.estadoVacio
        .querySelector("strong");

    const texto =
      elementos.estadoVacio
        .querySelector("p");

    if (titulo) {
      titulo.textContent =
        "Cargando recuerdos...";
    }

    if (texto) {
      texto.textContent =
        "Consultando las publicaciones enviadas.";
    }

  }

  try {

    recuerdos =
      await obtenerRecuerdos();

    actualizarEstadisticas();
    renderizarRecuerdos();

  } catch (error) {

    console.error(
      "Error cargando recuerdos:",
      error
    );

    if (elementos.gridRecuerdos) {
      elementos.gridRecuerdos.style.display =
        "none";
    }

    if (elementos.estadoVacio) {

      elementos.estadoVacio.style.display =
        "flex";

      const titulo =
        elementos.estadoVacio
          .querySelector("strong");

      const texto =
        elementos.estadoVacio
          .querySelector("p");

      if (titulo) {
        titulo.textContent =
          "No se pudieron cargar los recuerdos";
      }

      if (texto) {
        texto.textContent =
          "Revisa la conexión e intenta recargar la página.";
      }

    }

    mostrarToast(
      "No se pudieron cargar los recuerdos"
    );

  }

}


// ========================================
// FILTROS
// ========================================

elementos.busqueda
  ?.addEventListener(
    "input",
    renderizarRecuerdos
  );

elementos.filtroEstado
  ?.addEventListener(
    "change",
    renderizarRecuerdos
  );

elementos.filtroFecha
  ?.addEventListener(
    "change",
    renderizarRecuerdos
  );


// ========================================
// CERRAR SESIÓN
// ========================================

elementos.logoutButton
  ?.addEventListener(
    "click",
    async () => {

      try {

        sessionStorage.removeItem(
          "accesoAdmin"
        );

        await signOut(auth);

        window.location.href =
          "./";

      } catch (error) {

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
  async usuario => {

    if (!usuario) {

      sessionStorage.removeItem(
        "accesoAdmin"
      );

      window.location.href =
        "./";

      return;

    }

    usuarioActual = usuario;

    mostrarInterfaz();

    try {

      nombreAdminActual =
        await cargarPerfilAdmin(
          usuario
        );

      if (elementos.nombreAdmin) {

        elementos.nombreAdmin.textContent =
          nombreAdminActual;

      }

    } catch (error) {

      console.error(
        "Error cargando perfil:",
        error
      );

    }

    await cargarRecuerdos();

  }
);
