import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  auth
} from "../shared/firebase.js";

import {
  crearTemaController
} from "../shared/tema.js";

import {
  cargarPerfilAdmin
} from "../dashboard/perfil.js";

import {
  listarMateriales,
  agregarMaterial,
  editarMaterial,
  eliminarMaterial
} from "./api.js";

import {
  renderizarMateriales
} from "./render.js";
import {
  filtrarMateriales,
  llenarFiltroCategorias
} from "./filtros.js";

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
// ELEMENTOS DE MATERIALES
// ========================================

const elementosMateriales = {
  cargando:
    document.getElementById(
      "cargandoMateriales"
    ),

  error:
    document.getElementById(
      "errorMateriales"
    ),

  sinResultados:
    document.getElementById(
      "sinResultados"
    ),

  lista:
    document.getElementById(
      "listaMateriales"
    ),

  contador:
    document.getElementById(
      "contadorResultados"
    ),
  buscador:
  document.getElementById(
    "buscarMaterial"
  ),

filtroCategoria:
  document.getElementById(
    "filtroCategoria"
  ),

botonLimpiar:
  document.getElementById(
    "limpiarFiltros"
  ),
};


// ========================================
// ELEMENTOS DEL MODAL
// ========================================

const elementosModal = {
  modal:
    document.getElementById(
      "modalMaterial"
    ),

  botonAbrir:
    document.getElementById(
      "abrirFormularioMaterial"
    ),

  botonCerrar:
    document.getElementById(
      "cerrarFormularioMaterial"
    ),

  botonCancelar:
    document.getElementById(
      "cancelarFormularioMaterial"
    ),

  fondo:
    document.getElementById(
      "fondoModalMaterial"
    ),

  titulo:
    document.getElementById(
      "tituloFormularioMaterial"
    ),

  formulario:
    document.getElementById(
      "formularioMaterial"
    ),

  botonGuardar:
    document.getElementById(
      "guardarMaterial"
    )
};


// ========================================
// CAMPOS DEL FORMULARIO
// ========================================

const camposMaterial = {
  id:
    document.getElementById(
      "idMaterial"
    ),

  nombre:
    document.getElementById(
      "nombreMaterial"
    ),

  categoria:
    document.getElementById(
      "categoriaMaterial"
    ),

  tipo:
    document.getElementById(
      "tipoMaterial"
    ),

  descripcion:
    document.getElementById(
      "descripcionMaterial"
    ),

  url:
    document.getElementById(
      "urlMaterial"
    ),

  vistaPrevia:
    document.getElementById(
      "vistaPreviaMaterial"
    )
};


// ========================================
// ESTADO DE LA PÁGINA
// ========================================

const estado = {
  materiales: [],
  busqueda: "",
  categoria: "",
  cargando: false,
  guardando: false,
  eliminando: false
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

let temporizadorToast = null;


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
// ESTADOS DE MATERIALES
// ========================================

function ocultarEstadosMateriales() {

  elementosMateriales.cargando.style.display =
    "none";

  elementosMateriales.error.style.display =
    "none";

  elementosMateriales.sinResultados.style.display =
    "none";

  elementosMateriales.lista.style.display =
    "none";

}


function mostrarEstadoCarga() {

  ocultarEstadosMateriales();


  elementosMateriales.cargando.style.display =
    "flex";

}


function mostrarEstadoError() {

  ocultarEstadosMateriales();


  elementosMateriales.error.style.display =
    "flex";

  elementosMateriales.contador.textContent =
    "0 materiales";

}


// ========================================
// RENDERIZADO
// ========================================

function renderizarVistaActual() {

  const materialesFiltrados =
    filtrarMateriales({
      materiales:
        estado.materiales,

      busqueda:
        estado.busqueda,

      categoria:
        estado.categoria
    });


  renderizarMateriales({
    materiales:
      materialesFiltrados,

    listaMateriales:
      elementosMateriales.lista,

    sinResultados:
      elementosMateriales.sinResultados,

    contadorResultados:
      elementosMateriales.contador
  });

}


// ========================================
// FORMULARIO
// ========================================

function limpiarFormulario() {

  elementosModal.formulario.reset();

  camposMaterial.id.value =
    "";

}


function obtenerMaterialFormulario() {

  return {
    id:
      camposMaterial.id.value.trim(),

    nombre:
      camposMaterial.nombre.value.trim(),

    categoria:
      camposMaterial.categoria.value.trim(),

    tipo:
      camposMaterial.tipo.value.trim(),

    descripcion:
      camposMaterial.descripcion.value.trim(),

    url:
      camposMaterial.url.value.trim(),

    vistaPrevia:
      camposMaterial.vistaPrevia.value.trim()
  };

}


function llenarFormulario(
  material
) {

  camposMaterial.id.value =
    material.id || "";

  camposMaterial.nombre.value =
    material.nombre || "";

  camposMaterial.categoria.value =
    material.categoria || "";

  camposMaterial.tipo.value =
    material.tipo || "";

  camposMaterial.descripcion.value =
    material.descripcion || "";

  camposMaterial.url.value =
    material.url || "";

  camposMaterial.vistaPrevia.value =
    material.vistaPrevia || "";

}


// ========================================
// MODAL
// ========================================

function mostrarModal() {

  elementosModal.modal.hidden =
    false;

  document.body.classList.add(
    "modal-abierto"
  );


  setTimeout(
    () => {

      camposMaterial.nombre.focus();

    },
    50
  );

}


function abrirModalNuevo() {

  limpiarFormulario();


  elementosModal.titulo.textContent =
    "Agregar material";

  elementosModal.botonGuardar.textContent =
    "Guardar material";


  mostrarModal();

}


function abrirModalEdicion(
  material
) {

  limpiarFormulario();

  llenarFormulario(
    material
  );


  elementosModal.titulo.textContent =
    "Editar material";

  elementosModal.botonGuardar.textContent =
    "Guardar cambios";


  mostrarModal();

}


function cerrarModal() {

  if (
    estado.guardando
  ) {

    return;

  }


  elementosModal.modal.hidden =
    true;

  document.body.classList.remove(
    "modal-abierto"
  );

  limpiarFormulario();

}


// ========================================
// BOTÓN GUARDAR
// ========================================

function actualizarBotonGuardar({
  guardando,
  esEdicion
}) {

  elementosModal.botonGuardar.disabled =
    guardando;


  if (
    guardando
  ) {

    elementosModal.botonGuardar.textContent =
      esEdicion
        ? "Guardando cambios..."
        : "Guardando...";

    return;

  }


  elementosModal.botonGuardar.textContent =
    esEdicion
      ? "Guardar cambios"
      : "Guardar material";

}


// ========================================
// CARGAR MATERIALES
// ========================================

async function cargarMateriales() {

  if (
    estado.cargando
  ) {

    return;

  }


  estado.cargando =
    true;

  mostrarEstadoCarga();


  try {

    const respuesta =
      await listarMateriales();


    estado.materiales =
      Array.isArray(
        respuesta
      )
        ? respuesta
        : [];
llenarFiltroCategorias({
  selector:
    elementosMateriales.filtroCategoria,

  materiales:
    estado.materiales
});

    renderizarVistaActual();

  }

  catch (error) {

    console.error(
      "Error al cargar materiales:",
      error
    );


    estado.materiales =
      [];

    mostrarEstadoError();

  }

  finally {

    estado.cargando =
      false;


    elementosMateriales.cargando.style.display =
      "none";

  }

}


// ========================================
// GUARDAR MATERIAL
// ========================================

async function guardarMaterial(
  evento
) {

  evento.preventDefault();


  if (
    estado.guardando
  ) {

    return;

  }


  const material =
    obtenerMaterialFormulario();

  const esEdicion =
    Boolean(
      material.id
    );


  estado.guardando =
    true;


  actualizarBotonGuardar({
    guardando: true,
    esEdicion
  });


  try {

    if (
      esEdicion
    ) {

      await editarMaterial(
        material
      );


      mostrarToast(
        "Material actualizado"
      );

    }

    else {

      await agregarMaterial(
        material
      );


      mostrarToast(
        "Material agregado"
      );

    }


    estado.guardando =
      false;

    cerrarModal();

    await cargarMateriales();

  }

  catch (error) {

    console.error(
      "Error al guardar material:",
      error
    );


    mostrarToast(
      error.message ||
      "No se pudo guardar el material"
    );

  }

  finally {

    estado.guardando =
      false;


    actualizarBotonGuardar({
      guardando: false,
      esEdicion
    });

  }

}


// ========================================
// ELIMINAR MATERIAL
// ========================================

async function procesarEliminacion(
  material
) {

  if (
    estado.eliminando
  ) {

    return;

  }


  const confirmar =
    window.confirm(
      `¿Eliminar "${material.nombre}" (${material.id})?`
    );


  if (
    !confirmar
  ) {

    return;

  }


  estado.eliminando =
    true;


  try {

    await eliminarMaterial(
      material.id
    );


    mostrarToast(
      "Material eliminado"
    );


    await cargarMateriales();

  }

  catch (error) {

    console.error(
      "Error al eliminar material:",
      error
    );


    mostrarToast(
      error.message ||
      "No se pudo eliminar el material"
    );

  }

  finally {

    estado.eliminando =
      false;

  }

}


// ========================================
// EVENTOS DE LAS TARJETAS
// ========================================

function manejarEdicion(
  evento
) {

  abrirModalEdicion(
    evento.detail
  );

}


async function manejarEliminacion(
  evento
) {

  await procesarEliminacion(
    evento.detail
  );

}


// ========================================
// EVENTOS DEL TECLADO
// ========================================

function manejarTeclado(
  evento
) {

  const modalAbierto =
    !elementosModal.modal.hidden;


  if (
    evento.key === "Escape" &&
    modalAbierto
  ) {

    cerrarModal();

  }

}


// ========================================
// AUTENTICACIÓN
// ========================================

async function iniciarSesionAdmin(
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
      "Error al cargar perfil:",
      error
    );

  }


  await cargarMateriales();

}


function redirigirAlLogin() {

  sessionStorage.removeItem(
    "accesoAdmin"
  );

  window.location.href =
    "./";

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
      "Error al cerrar sesión:",
      error
    );


    mostrarToast(
      "No se pudo cerrar la sesión"
    );


    elementosGenerales.logoutButton.disabled =
      false;

  }

}


// ========================================
// REGISTRAR EVENTOS
// ========================================

function registrarEventos() {

  elementosModal.formulario.addEventListener(
    "submit",
    guardarMaterial
  );


  elementosMateriales.lista.addEventListener(
    "editarMaterial",
    manejarEdicion
  );


  elementosMateriales.lista.addEventListener(
    "eliminarMaterial",
    manejarEliminacion
  );


  elementosModal.botonAbrir.addEventListener(
    "click",
    abrirModalNuevo
  );


  elementosModal.botonCerrar.addEventListener(
    "click",
    cerrarModal
  );


  elementosModal.botonCancelar.addEventListener(
    "click",
    cerrarModal
  );


  elementosModal.fondo.addEventListener(
    "click",
    cerrarModal
  );


  document.addEventListener(
    "keydown",
    manejarTeclado
  );


  elementosGenerales.logoutButton.addEventListener(
    "click",
    cerrarSesion
  );

}


// ========================================
// INICIALIZAR PÁGINA
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


      await iniciarSesionAdmin(
        user
      );

    }
  );

}


iniciarPagina();
