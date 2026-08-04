/* ========================================
   COLOR MANAGER
   CONTROLADOR PRINCIPAL
   ======================================== */

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  auth,
  db
} from "./shared/firebase.js";

import {
  crearTemaController
} from "./shared/tema.js";

import {
  cargarPerfilAdmin
} from "./dashboard/perfil.js";


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
// ELEMENTOS DE LA VISTA DEL EVENTO
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
// ELEMENTOS DEL MODAL
// ========================================

const elementosModal = {

  modal:
    document.getElementById(
      "modalEvento"
    ),

  fondo:
    document.getElementById(
      "fondoModalEvento"
    ),

  titulo:
    document.getElementById(
      "tituloFormularioEvento"
    ),

  cerrar:
    document.getElementById(
      "cerrarModalEvento"
    ),

  cancelar:
    document.getElementById(
      "cancelarModalEvento"
    ),

  formulario:
    document.getElementById(
      "formularioEvento"
    ),

  guardar:
    document.getElementById(
      "guardarEvento"
    )

};


// ========================================
// CAMPOS DEL FORMULARIO
// ========================================

const camposEvento = {

  id:
    document.getElementById(
      "eventoId"
    ),

  nombre:
    document.getElementById(
      "nombreEvento"
    ),

  anio:
    document.getElementById(
      "anioEvento"
    ),

  ciudad:
    document.getElementById(
      "ciudadEvento"
    ),

  pais:
    document.getElementById(
      "paisEvento"
    ),

  activo:
    document.getElementById(
      "eventoActivoFormulario"
    )

};


// ========================================
// ESTADO
// ========================================

const estado = {

  eventos: [],

  eventoSeleccionadoId:
    null,

  cargando:
    false,

  guardando:
    false,

  eliminando:
    false

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
// INTERFAZ
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
// UTILIDADES
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


function crearIdEvento({
  nombre,
  anio
}) {

  const base =
    String(
      nombre || "evento"
    )
      .normalize(
        "NFD"
      )
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        "" )
      .slice(
        0,
        35
      );


  const sufijo =
    String(
      anio || new Date().getFullYear()
    );


  return (
    `${base || "evento"}-${sufijo}`
  );

}


function obtenerEventoSeleccionado() {

  return estado.eventos.find(
    evento =>
      evento.id ===
      estado.eventoSeleccionadoId
  ) || null;

}


// Se usará después desde los módulos.
window.obtenerEventoSeleccionadoId =
  () =>
    estado.eventoSeleccionadoId;


// ========================================
// ESTADOS DE CARGA
// ========================================

function mostrarCargaEventos() {

  elementosEventos.cargandoEventos.style.display =
    "block";

  elementosEventos.sinEventos.style.display =
    "none";

  elementosEventos.listaEventos.style.display =
    "none";

}


function ocultarCargaEventos() {

  elementosEventos.cargandoEventos.style.display =
    "none";

}


// ========================================
// CARGAR EVENTOS
// ========================================

async function cargarEventos() {

  if (
    estado.cargando
  ) {

    return;

  }


  estado.cargando =
    true;

  mostrarCargaEventos();


  try {

    const snapshot =
      await getDocs(
        collection(
          db,
          "eventos"
        )
      );


    estado.eventos =
      snapshot.docs
        .map(
          documento => ({
            id:
              documento.id,

            ...documento.data()
          })
        )
        .filter(
          evento =>
            evento.archivado !== true
        )
        .sort(
          (a, b) =>
            Number(
              b.anio || 0
            ) -
            Number(
              a.anio || 0
            )
        );


    renderizarEventos();

  }

  catch (error) {

    console.error(
      "Error al cargar eventos:",
      error
    );


    elementosEventos.eventoActivo.textContent =
      "No fue posible cargar el evento activo.";

    elementosEventos.listaEventos.innerHTML =
      `
        <div class="sin-registros">

          <strong>
            No se pudieron cargar las ediciones
          </strong>

          <p>
            Revisa la conexión y las reglas de Firestore.
          </p>

        </div>
      `;

    elementosEventos.listaEventos.style.display =
      "block";

  }

  finally {

    estado.cargando =
      false;

    ocultarCargaEventos();

  }

}


// ========================================
// RENDERIZAR EVENTO ACTIVO
// ========================================

function renderizarEventoActivo() {

  const eventoActivo =
    estado.eventos.find(
      evento =>
        evento.activo === true
    );


  if (
    !eventoActivo
  ) {

    elementosEventos.eventoActivo.className =
      "evento-activo-vacio";

    elementosEventos.eventoActivo.textContent =
      "No hay evento activo.";

    return;

  }


  elementosEventos.eventoActivo.className =
    "evento-activo-card";


  elementosEventos.eventoActivo.innerHTML =
    `
      <div>

        <strong>
          ${escaparHTML(
            eventoActivo.nombre
          )}
        </strong>

        <p>
          ${escaparHTML(
            eventoActivo.ciudad
          )},
          ${escaparHTML(
            eventoActivo.pais
          )}
          ·
          ${escaparHTML(
            eventoActivo.anio
          )}
        </p>

      </div>

      <button
        type="button"
        class="boton-secundario abrir-evento"
        data-id="${escaparHTML(
          eventoActivo.id
        )}"
      >
        Abrir
      </button>
    `;

}


// ========================================
// CREAR TARJETA DE EVENTO
// ========================================

function crearTarjetaEvento(
  evento
) {

  const tarjeta =
    document.createElement(
      "article"
    );

  tarjeta.className =
    "evento";


  tarjeta.innerHTML =
    `
      <div class="evento-informacion">

        <div class="evento-titulo">

          <strong>
            ${escaparHTML(
              evento.nombre || evento.id
            )}
          </strong>

          ${
            evento.activo === true
              ? `
                <span class="estado-activo">
                  Activo
                </span>
              `
              : `
                <span class="estado-inactivo">
                  Inactivo
                </span>
              `
          }

        </div>

        <p>
          ${escaparHTML(
            evento.ciudad || "Sin ciudad"
          )},
          ${escaparHTML(
            evento.pais || "Sin país"
          )}
          ·
          ${escaparHTML(
            evento.anio || "Sin año"
          )}
        </p>

      </div>

      <div class="evento-acciones">

        <button
          type="button"
          class="boton-secundario abrir-evento"
          data-id="${escaparHTML(
            evento.id
          )}"
        >
          Abrir
        </button>

        <button
          type="button"
          class="boton-secundario editar-evento"
          data-id="${escaparHTML(
            evento.id
          )}"
        >
          Editar
        </button>

        ${
          evento.activo === true
            ? ""
            : `
              <button
                type="button"
                class="boton-principal activar-evento"
                data-id="${escaparHTML(
                  evento.id
                )}"
              >
                Activar
              </button>
            `
        }

        <button
          type="button"
          class="boton-eliminar eliminar-evento"
          data-id="${escaparHTML(
            evento.id
          )}"
        >
          Eliminar
        </button>

      </div>
    `;


  return tarjeta;

}


// ========================================
// RENDERIZAR LISTA DE EVENTOS
// ========================================

function renderizarEventos() {

  renderizarEventoActivo();


  elementosEventos.listaEventos.innerHTML =
    "";


  if (
    estado.eventos.length === 0
  ) {

    elementosEventos.listaEventos.style.display =
      "none";

    elementosEventos.sinEventos.style.display =
      "block";

    return;

  }


  elementosEventos.sinEventos.style.display =
    "none";

  elementosEventos.listaEventos.style.display =
    "grid";


  const fragmento =
    document.createDocumentFragment();


  for (
    const evento
    of estado.eventos
  ) {

    fragmento.appendChild(
      crearTarjetaEvento(
        evento
      )
    );

  }


  elementosEventos.listaEventos.appendChild(
    fragmento
  );

}


// ========================================
// FORMULARIO
// ========================================

function limpiarFormularioEvento() {

  elementosModal.formulario.reset();

  camposEvento.id.value =
    "";

  camposEvento.anio.value =
    new Date().getFullYear();

}


function obtenerDatosFormularioEvento() {

  return {

    id:
      camposEvento.id.value.trim(),

    nombre:
      camposEvento.nombre.value.trim(),

    anio:
      Number(
        camposEvento.anio.value
      ),

    ciudad:
      camposEvento.ciudad.value.trim(),

    pais:
      camposEvento.pais.value.trim(),

    activo:
      camposEvento.activo.checked

  };

}


function llenarFormularioEvento(
  evento
) {

  camposEvento.id.value =
    evento.id || "";

  camposEvento.nombre.value =
    evento.nombre || "";

  camposEvento.anio.value =
    evento.anio || "";

  camposEvento.ciudad.value =
    evento.ciudad || "";

  camposEvento.pais.value =
    evento.pais || "";

  camposEvento.activo.checked =
    evento.activo === true;

}


// ========================================
// MODAL
// ========================================

function mostrarModalEvento() {

  elementosModal.modal.hidden =
    false;

  document.body.classList.add(
    "modal-abierto"
  );


  setTimeout(
    () => {

      camposEvento.nombre.focus();

    },
    50
  );

}


function abrirModalNuevoEvento() {

  limpiarFormularioEvento();


  elementosModal.titulo.textContent =
    "Crear nueva edición";

  elementosModal.guardar.textContent =
    "Guardar edición";


  mostrarModalEvento();

}


function abrirModalEditarEvento(
  eventoId
) {

  const evento =
    estado.eventos.find(
      item =>
        item.id === eventoId
    );


  if (
    !evento
  ) {

    mostrarToast(
      "No se encontró la edición"
    );

    return;

  }


  limpiarFormularioEvento();

  llenarFormularioEvento(
    evento
  );


  elementosModal.titulo.textContent =
    "Editar edición";

  elementosModal.guardar.textContent =
    "Guardar cambios";


  mostrarModalEvento();

}


function cerrarModalEvento() {

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

  limpiarFormularioEvento();

}


// ========================================
// ACTIVAR EVENTO
// ========================================

async function activarEvento(
  eventoId
) {

  const batch =
    writeBatch(
      db
    );


  for (
    const evento
    of estado.eventos
  ) {

    batch.update(
      doc(
        db,
        "eventos",
        evento.id
      ),
      {
        activo:
          evento.id === eventoId,

        fechaActualizacion:
          serverTimestamp()
      }
    );

  }


  await batch.commit();

}


// ========================================
// GUARDAR EVENTO
// ========================================

async function guardarEvento(
  event
) {

  event.preventDefault();


  if (
    estado.guardando
  ) {

    return;

  }


  const datos =
    obtenerDatosFormularioEvento();


  if (
    !datos.nombre ||
    !datos.anio ||
    !datos.ciudad ||
    !datos.pais
  ) {

    mostrarToast(
      "Completa todos los campos"
    );

    return;

  }


  const esEdicion =
    Boolean(
      datos.id
    );


  estado.guardando =
    true;

  elementosModal.guardar.disabled =
    true;

  elementosModal.guardar.textContent =
    esEdicion
      ? "Guardando cambios..."
      : "Creando edición...";


  try {

    let eventoId =
      datos.id;


    if (
      !esEdicion
    ) {

      eventoId =
        crearIdEvento(
          datos
        );


      const idYaExiste =
        estado.eventos.some(
          evento =>
            evento.id === eventoId
        );


      if (
        idYaExiste
      ) {

        eventoId =
          `${eventoId}-${Date.now()}`;

      }

    }


    if (
      datos.activo
    ) {

      await activarEvento(
        eventoId
      );

    }


    const referencia =
      doc(
        db,
        "eventos",
        eventoId
      );


    if (
      esEdicion
    ) {

      await updateDoc(
        referencia,
        {
          nombre:
            datos.nombre,

          anio:
            datos.anio,

          ciudad:
            datos.ciudad,

          pais:
            datos.pais,

          activo:
            datos.activo,

          fechaActualizacion:
            serverTimestamp()
        }
      );

    }

    else {

      await setDoc(
        referencia,
        {
          nombre:
            datos.nombre,

          anio:
            datos.anio,

          ciudad:
            datos.ciudad,

          pais:
            datos.pais,

          activo:
            datos.activo,

          archivado:
            false,

          fechaCreacion:
            serverTimestamp(),

          fechaActualizacion:
            serverTimestamp()
        }
      );

    }


    mostrarToast(
      esEdicion
        ? "Edición actualizada"
        : "Edición creada"
    );


    estado.guardando =
      false;

    cerrarModalEvento();

    await cargarEventos();

  }

  catch (error) {

    console.error(
      "Error al guardar evento:",
      error
    );


    mostrarToast(
      error.message ||
      "No se pudo guardar la edición"
    );

  }

  finally {

    estado.guardando =
      false;

    elementosModal.guardar.disabled =
      false;

    elementosModal.guardar.textContent =
      esEdicion
        ? "Guardar cambios"
        : "Guardar edición";

  }

}


// ========================================
// PROCESAR ACTIVACIÓN
// ========================================

async function procesarActivacion(
  eventoId
) {

  const evento =
    estado.eventos.find(
      item =>
        item.id === eventoId
    );


  if (
    !evento
  ) {

    return;

  }


  const confirmar =
    window.confirm(
      `¿Marcar "${evento.nombre}" como evento activo?`
    );


  if (
    !confirmar
  ) {

    return;

  }


  try {

    await activarEvento(
      eventoId
    );


    mostrarToast(
      "Evento activo actualizado"
    );

    await cargarEventos();

  }

  catch (error) {

    console.error(
      "Error al activar evento:",
      error
    );


    mostrarToast(
      "No se pudo activar la edición"
    );

  }

}


// ========================================
// ELIMINAR EVENTO
// ========================================

async function procesarEliminacion(
  eventoId
) {

  if (
    estado.eliminando
  ) {

    return;

  }


  const evento =
    estado.eventos.find(
      item =>
        item.id === eventoId
    );


  if (
    !evento
  ) {

    return;

  }


  if (
    evento.activo === true
  ) {

    mostrarToast(
      "No puedes eliminar el evento activo"
    );

    return;

  }


  const confirmar =
    window.confirm(
      `¿Eliminar definitivamente "${evento.nombre}"?`
    );


  if (
    !confirmar
  ) {

    return;

  }


  estado.eliminando =
    true;


  try {

    await deleteDoc(
      doc(
        db,
        "eventos",
        eventoId
      )
    );


    if (
      estado.eventoSeleccionadoId ===
      eventoId
    ) {

      volverAVistaPrincipal();

    }


    mostrarToast(
      "Edición eliminada"
    );

    await cargarEventos();

  }

  catch (error) {

    console.error(
      "Error al eliminar evento:",
      error
    );


    mostrarToast(
      "No se pudo eliminar la edición"
    );

  }

  finally {

    estado.eliminando =
      false;

  }

}


// ========================================
// ABRIR EVENTO
// ========================================

function abrirEvento(
  eventoId
) {

  const evento =
    estado.eventos.find(
      item =>
        item.id === eventoId
    );


  if (
    !evento
  ) {

    mostrarToast(
      "No se encontró la edición"
    );

    return;

  }


  estado.eventoSeleccionadoId =
    evento.id;


  elementosVistaEvento.titulo.textContent =
    evento.nombre || evento.id;

  elementosVistaEvento.descripcion.textContent =
    `${evento.ciudad || ""}, ${evento.pais || ""} · ${evento.anio || ""}`;


  elementosEventos.vistaPrincipal.hidden =
    true;

  elementosVistaEvento.vista.hidden =
    false;


  mostrarModulo(
    "fechas"
  );

}


// ========================================
// VOLVER A EDICIONES
// ========================================

function volverAVistaPrincipal() {

  estado.eventoSeleccionadoId =
    null;

  elementosVistaEvento.vista.hidden =
    true;

  elementosEventos.vistaPrincipal.hidden =
    false;

  elementosVistaEvento.contenidoManager.innerHTML =
    "";

}


// ========================================
// PESTAÑAS
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


function mostrarModulo(
  modulo
) {

  marcarPestanaActiva(
    modulo
  );


  switch (
    modulo
  ) {

    case "fechas":

      elementosVistaEvento.contenidoManager.innerHTML =
        `
          <div class="sin-registros">

            <strong>
              Módulo de Fechas
            </strong>

            <p>
              Ahora conectaremos este módulo con Firestore.
            </p>

          </div>
        `;

      break;


    case "zonas":

      elementosVistaEvento.contenidoManager.innerHTML =
        `
          <div class="sin-registros">

            <strong>
              Módulo de Zonas
            </strong>

            <p>
              Se conectará después de terminar Fechas.
            </p>

          </div>
        `;

      break;


    case "fanprojects":

      elementosVistaEvento.contenidoManager.innerHTML =
        `
          <div class="sin-registros">

            <strong>
              Módulo de Fan Projects
            </strong>

            <p>
              Se conectará después de Zonas.
            </p>

          </div>
        `;

      break;


    case "informacion":

      mostrarInformacionEvento();

      break;

  }

}


// ========================================
// INFORMACIÓN DEL EVENTO
// ========================================

function mostrarInformacionEvento() {

  const evento =
    obtenerEventoSeleccionado();


  if (
    !evento
  ) {

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
// EVENTOS DE LA LISTA
// ========================================

function manejarClickEventos(
  event
) {

  const boton =
    event.target.closest(
      "button[data-id]"
    );


  if (
    !boton
  ) {

    return;

  }


  const eventoId =
    boton.dataset.id;


  if (
    boton.classList.contains(
      "abrir-evento"
    )
  ) {

    abrirEvento(
      eventoId
    );

    return;

  }


  if (
    boton.classList.contains(
      "editar-evento"
    )
  ) {

    abrirModalEditarEvento(
      eventoId
    );

    return;

  }


  if (
    boton.classList.contains(
      "activar-evento"
    )
  ) {

    procesarActivacion(
      eventoId
    );

    return;

  }


  if (
    boton.classList.contains(
      "eliminar-evento"
    )
  ) {

    procesarEliminacion(
      eventoId
    );

  }

}


// ========================================
// AUTENTICACIÓN
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


    elementosGenerales.nombreAdmin.textContent =
      nombre;

  }

  catch (error) {

    console.error(
      "Error cargando perfil:",
      error
    );

  }


  await cargarEventos();

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
// REGISTRAR EVENTOS
// ========================================

function registrarEventos() {

  elementosEventos.btnCrearEvento.addEventListener(
    "click",
    abrirModalNuevoEvento
  );


  elementosEventos.listaEventos.addEventListener(
    "click",
    manejarClickEventos
  );


  elementosEventos.eventoActivo.addEventListener(
    "click",
    manejarClickEventos
  );


  elementosVistaEvento.volver.addEventListener(
    "click",
    volverAVistaPrincipal
  );


  elementosVistaEvento.editar.addEventListener(
    "click",
    () => {

      if (
        estado.eventoSeleccionadoId
      ) {

        abrirModalEditarEvento(
          estado.eventoSeleccionadoId
        );

      }

    }
  );


  for (
    const tab
    of elementosVistaEvento.tabs
  ) {

    tab.addEventListener(
      "click",
      () => {

        if (
          estado.eventoSeleccionadoId
        ) {

          mostrarModulo(
            tab.dataset.tab
          );

        }

      }
    );

  }


  elementosModal.formulario.addEventListener(
    "submit",
    guardarEvento
  );


  elementosModal.cerrar.addEventListener(
    "click",
    cerrarModalEvento
  );


  elementosModal.cancelar.addEventListener(
    "click",
    cerrarModalEvento
  );


  elementosModal.fondo.addEventListener(
    "click",
    cerrarModalEvento
  );


  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        !elementosModal.modal.hidden
      ) {

        cerrarModalEvento();

      }

    }
  );


  elementosGenerales.logoutButton.addEventListener(
    "click",
    cerrarSesion
  );

}


// ========================================
// INICIAR
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
