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


// ========================================
// ELEMENTOS GENERALES
// ========================================

const cargando =
  document.getElementById(
    "cargando"
  );

const contenido =
  document.getElementById(
    "contenido"
  );

const nombreAdmin =
  document.getElementById(
    "nombreAdmin"
  );

const themeToggle =
  document.getElementById(
    "themeToggle"
  );

const logoutButton =
  document.getElementById(
    "logoutButton"
  );

const toast =
  document.getElementById(
    "toast"
  );


// ========================================
// ELEMENTOS DE MATERIALES
// ========================================

const cargandoMateriales =
  document.getElementById(
    "cargandoMateriales"
  );

const errorMateriales =
  document.getElementById(
    "errorMateriales"
  );

const sinResultados =
  document.getElementById(
    "sinResultados"
  );

const listaMateriales =
  document.getElementById(
    "listaMateriales"
  );

const contadorResultados =
  document.getElementById(
    "contadorResultados"
  );


// ========================================
// ELEMENTOS DEL MODAL
// ========================================

const modalMaterial =
  document.getElementById(
    "modalMaterial"
  );

const abrirFormularioMaterial =
  document.getElementById(
    "abrirFormularioMaterial"
  );

const cerrarFormularioMaterial =
  document.getElementById(
    "cerrarFormularioMaterial"
  );

const cancelarFormularioMaterial =
  document.getElementById(
    "cancelarFormularioMaterial"
  );

const fondoModalMaterial =
  document.getElementById(
    "fondoModalMaterial"
  );

const tituloFormularioMaterial =
  document.getElementById(
    "tituloFormularioMaterial"
  );

const formularioMaterial =
  document.getElementById(
    "formularioMaterial"
  );

const filaMaterial =
  document.getElementById(
    "filaMaterial"
  );

const nombreMaterial =
  document.getElementById(
    "nombreMaterial"
  );

const categoriaMaterial =
  document.getElementById(
    "categoriaMaterial"
  );

const tipoMaterial =
  document.getElementById(
    "tipoMaterial"
  );

const descripcionMaterial =
  document.getElementById(
    "descripcionMaterial"
  );

const urlMaterial =
  document.getElementById(
    "urlMaterial"
  );

const vistaPreviaMaterial =
  document.getElementById(
    "vistaPreviaMaterial"
  );

const guardarMaterial =
  document.getElementById(
    "guardarMaterial"
  );


// ========================================
// ESTADO
// ========================================

let materiales = [];


// ========================================
// TEMA
// ========================================

const temaController =
  crearTemaController({
    botonTema:
      themeToggle
  });

temaController.iniciarTema();


// ========================================
// INTERFAZ
// ========================================

function mostrarInterfaz() {

  sessionStorage.setItem(
    "accesoAdmin",
    "1"
  );


  if (cargando) {

    cargando.remove();

  }


  contenido.style.display =
    "block";

}


// ========================================
// TOAST
// ========================================

let temporizadorToast = null;


function mostrarToast(
  mensaje
) {

  clearTimeout(
    temporizadorToast
  );


  toast.textContent =
    mensaje;

  toast.classList.add(
    "visible"
  );


  temporizadorToast =
    setTimeout(
      () => {

        toast.classList.remove(
          "visible"
        );

      },
      2800
    );

}


// ========================================
// MODAL
// ========================================

function limpiarFormulario() {

  formularioMaterial.reset();

  filaMaterial.value =
    "";

}


function abrirModalNuevo() {

  limpiarFormulario();


  tituloFormularioMaterial.textContent =
    "Agregar material";

  guardarMaterial.textContent =
    "Guardar material";

  modalMaterial.hidden =
    false;

  document.body.classList.add(
    "modal-abierto"
  );


  setTimeout(
    () => {

      nombreMaterial.focus();

    },
    50
  );

}


function abrirModalEdicion(
  material
) {

  filaMaterial.value =
    material.fila;

  nombreMaterial.value =
    material.nombre || "";

  categoriaMaterial.value =
    material.categoria || "";

  tipoMaterial.value =
    material.tipo || "";

  descripcionMaterial.value =
    material.descripcion || "";

  urlMaterial.value =
    material.url || "";

  vistaPreviaMaterial.value =
    material.vistaPrevia || "";


  tituloFormularioMaterial.textContent =
    "Editar material";

  guardarMaterial.textContent =
    "Guardar cambios";

  modalMaterial.hidden =
    false;

  document.body.classList.add(
    "modal-abierto"
  );


  setTimeout(
    () => {

      nombreMaterial.focus();

    },
    50
  );

}


function cerrarModal() {

  modalMaterial.hidden =
    true;

  document.body.classList.remove(
    "modal-abierto"
  );

  limpiarFormulario();

}


// ========================================
// CARGAR MATERIALES
// ========================================

async function cargarMateriales() {

  cargandoMateriales.style.display =
    "flex";

  errorMateriales.style.display =
    "none";

  sinResultados.style.display =
    "none";

  listaMateriales.style.display =
    "none";


  try {

    materiales =
      await listarMateriales();


    renderizarMateriales({
      materiales,
      listaMateriales,
      sinResultados,
      contadorResultados
    });

  }

  catch (error) {

    console.error(
      error
    );


    errorMateriales.style.display =
      "flex";

    contadorResultados.textContent =
      "0 materiales";

  }

  finally {

    cargandoMateriales.style.display =
      "none";

  }

}


// ========================================
// GUARDAR MATERIAL
// ========================================

formularioMaterial.addEventListener(
  "submit",
  async evento => {

    evento.preventDefault();


    const fila =
      Number(
        filaMaterial.value
      );


    const material = {

      nombre:
        nombreMaterial.value.trim(),

      categoria:
        categoriaMaterial.value,

      tipo:
        tipoMaterial.value,

      descripcion:
        descripcionMaterial.value.trim(),

      url:
        urlMaterial.value.trim(),

      vistaPrevia:
        vistaPreviaMaterial.value.trim()

    };


    guardarMaterial.disabled =
      true;

    guardarMaterial.textContent =
      fila
        ? "Guardando cambios..."
        : "Guardando...";


    try {

      if (fila) {

        await editarMaterial({
          fila,
          ...material
        });


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


      cerrarModal();

      await cargarMateriales();

    }

    catch (error) {

      console.error(
        error
      );


      mostrarToast(
        error.message ||
        "No se pudo guardar el material"
      );

    }

    finally {

      guardarMaterial.disabled =
        false;

      guardarMaterial.textContent =
        fila
          ? "Guardar cambios"
          : "Guardar material";

    }

  }
);


// ========================================
// EDITAR Y ELIMINAR
// ========================================

listaMateriales.addEventListener(
  "editarMaterial",
  evento => {

    abrirModalEdicion(
      evento.detail
    );

  }
);


listaMateriales.addEventListener(
  "eliminarMaterial",
  async evento => {

    const material =
      evento.detail;


    const confirmar =
      window.confirm(
        `¿Eliminar "${material.nombre}"?`
      );


    if (!confirmar) {

      return;

    }


    try {

      await eliminarMaterial(
        material.fila
      );


      mostrarToast(
        "Material eliminado"
      );

      await cargarMateriales();

    }

    catch (error) {

      console.error(
        error
      );


      mostrarToast(
        error.message ||
        "No se pudo eliminar el material"
      );

    }

  }
);


// ========================================
// EVENTOS DEL MODAL
// ========================================

abrirFormularioMaterial.addEventListener(
  "click",
  abrirModalNuevo
);

cerrarFormularioMaterial.addEventListener(
  "click",
  cerrarModal
);

cancelarFormularioMaterial.addEventListener(
  "click",
  cerrarModal
);

fondoModalMaterial.addEventListener(
  "click",
  cerrarModal
);


document.addEventListener(
  "keydown",
  evento => {

    if (
      evento.key === "Escape" &&
      !modalMaterial.hidden
    ) {

      cerrarModal();

    }

  }
);


// ========================================
// AUTENTICACIÓN
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


    mostrarInterfaz();


    const nombre =
      await cargarPerfilAdmin(
        user
      );


    if (nombreAdmin) {

      nombreAdmin.textContent =
        nombre;

    }


    await cargarMateriales();

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

      await signOut(
        auth
      );

      window.location.href =
        "./";

    }

    catch (error) {

      console.error(
        error
      );

      mostrarToast(
        "No se pudo cerrar la sesión"
      );

    }

  }
);
