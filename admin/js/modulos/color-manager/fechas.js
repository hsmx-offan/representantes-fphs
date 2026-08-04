/* ========================================
   COLOR MANAGER
   MÓDULO FECHAS
   ======================================== */

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  db
} from "../../shared/firebase.js";


// ========================================
// ESTADO DEL MÓDULO
// ========================================

const estadoFechas = {

  eventoId:
    null,

  contenedor:
    null,

  fechas:
    [],

  fechaEditandoId:
    null,

  cargando:
    false,

  guardando:
    false,

  eliminando:
    false,

  mostrarToast:
    mensaje => {

      console.log(
        mensaje
      );

    }

};


// ========================================
// ESCAPAR TEXTO
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
// REFERENCIA DE FECHAS
// ========================================

function obtenerColeccionFechas() {

  if (
    !estadoFechas.eventoId
  ) {

    throw new Error(
      "No hay una edición seleccionada."
    );

  }


  return collection(
    db,
    "eventos",
    estadoFechas.eventoId,
    "fechas"
  );

}


// ========================================
// FORMATEAR FECHA
// ========================================

function formatearFecha(
  fecha
) {

  if (
    !fecha
  ) {

    return "Sin fecha";

  }


  const partes =
    String(
      fecha
    ).split(
      "-"
    );


  if (
    partes.length !== 3
  ) {

    return fecha;

  }


  const [
    anio,
    mes,
    dia
  ] = partes;


  const fechaLocal =
    new Date(
      Number(anio),
      Number(mes) - 1,
      Number(dia)
    );


  return fechaLocal.toLocaleDateString(
    "es-MX",
    {
      day:
        "numeric",

      month:
        "long",

      year:
        "numeric"
    }
  );

}


// ========================================
// ORDENAR FECHAS
// ========================================

function ordenarFechas(
  fechas
) {

  return [
    ...fechas
  ].sort(
    (a, b) => {

      const ordenA =
        Number(
          a.orden
        ) || 0;

      const ordenB =
        Number(
          b.orden
        ) || 0;


      if (
        ordenA !== ordenB
      ) {

        return ordenA - ordenB;

      }


      return String(
        a.fecha || ""
      ).localeCompare(
        String(
          b.fecha || ""
        )
      );

    }
  );

}


// ========================================
// MOSTRAR ESTRUCTURA DEL MÓDULO
// ========================================

function mostrarEstructura() {

  estadoFechas.contenedor.innerHTML = `

    <div class="header-modulo">

      <div>

        <p class="etiqueta-seccion">
          FECHAS
        </p>

        <h3>
          📅 Fechas del evento
        </h3>

        <p>
          Crea, ordena y administra las noches disponibles.
        </p>

      </div>

      <button
        type="button"
        id="btnNuevaFecha"
        class="btn-principal"
      >
        ＋ Nueva fecha
      </button>

    </div>


    <div
      id="cargandoFechas"
      class="sin-registros"
    >
      Cargando fechas...
    </div>


    <div
      id="listaFechas"
      class="lista-fechas"
      style="display: none;"
    ></div>

  `;


  const botonNuevaFecha =
    document.getElementById(
      "btnNuevaFecha"
    );


  botonNuevaFecha.addEventListener(
    "click",
    abrirModalNuevaFecha
  );

}


// ========================================
// CARGAR FECHAS DE FIRESTORE
// ========================================

async function cargarFechas() {

  if (
    estadoFechas.cargando
  ) {

    return;

  }


  estadoFechas.cargando =
    true;


  const cargandoFechas =
    document.getElementById(
      "cargandoFechas"
    );

  const listaFechas =
    document.getElementById(
      "listaFechas"
    );


  if (
    cargandoFechas
  ) {

    cargandoFechas.style.display =
      "block";

    cargandoFechas.textContent =
      "Cargando fechas...";

  }


  if (
    listaFechas
  ) {

    listaFechas.style.display =
      "none";

  }


  try {

    const snapshot =
      await getDocs(
        obtenerColeccionFechas()
      );


    estadoFechas.fechas =
      snapshot.docs.map(
        documento => ({

          id:
            documento.id,

          ...documento.data()

        })
      );


    pintarFechas();

  }

  catch (error) {

    console.error(
      "Error al cargar fechas:",
      error
    );


    if (
      cargandoFechas
    ) {

      cargandoFechas.textContent =
        "No se pudieron cargar las fechas.";

    }


    estadoFechas.mostrarToast(
      "No se pudieron cargar las fechas"
    );

  }

  finally {

    estadoFechas.cargando =
      false;

  }

}


// ========================================
// PINTAR FECHAS
// ========================================

function pintarFechas() {

  const cargandoFechas =
    document.getElementById(
      "cargandoFechas"
    );

  const listaFechas =
    document.getElementById(
      "listaFechas"
    );


  if (
    !listaFechas
  ) {

    return;

  }


  if (
    cargandoFechas
  ) {

    cargandoFechas.style.display =
      "none";

  }


  listaFechas.innerHTML =
    "";

  listaFechas.style.display =
    "grid";


  const fechasOrdenadas =
    ordenarFechas(
      estadoFechas.fechas
    );


  if (
    fechasOrdenadas.length === 0
  ) {

    listaFechas.innerHTML = `

      <div class="sin-registros">

        <span class="estado-icono">
          📅
        </span>

        <strong>
          No hay fechas
        </strong>

        <p>
          Agrega la primera fecha de esta edición.
        </p>

      </div>

    `;

    return;

  }


  const fragmento =
    document.createDocumentFragment();


  for (
    const fecha
    of fechasOrdenadas
  ) {

    fragmento.appendChild(
      crearCardFecha(
        fecha
      )
    );

  }


  listaFechas.appendChild(
    fragmento
  );

}


// ========================================
// CREAR TARJETA
// ========================================

function crearCardFecha(
  fecha
) {

  const card =
    document.createElement(
      "article"
    );


  card.className =
    "card-fecha";


  card.innerHTML = `

    <div class="card-fecha-info">

      <div class="evento-titulo">

        <h4>
          ${escaparHTML(
            fecha.nombre || "Fecha sin nombre"
          )}
        </h4>

        ${
          fecha.activa === false
            ? `
              <span class="estado-inactivo">
                Inactiva
              </span>
            `
            : `
              <span class="estado-activo">
                Activa
              </span>
            `
        }

      </div>

      <span>
        📅
        ${escaparHTML(
          formatearFecha(
            fecha.fecha
          )
        )}
      </span>

      <span>
        🕘
        ${escaparHTML(
          fecha.hora || "Sin hora"
        )}
      </span>

      <span>
        Orden:
        ${escaparHTML(
          fecha.orden ?? "Sin definir"
        )}
      </span>

    </div>


    <div class="card-fecha-acciones">

      <button
        type="button"
        class="editar-fecha"
        data-id="${escaparHTML(
          fecha.id
        )}"
        aria-label="Editar fecha"
        title="Editar fecha"
      >
        ✏️
      </button>

      <button
        type="button"
        class="eliminar-fecha"
        data-id="${escaparHTML(
          fecha.id
        )}"
        aria-label="Eliminar fecha"
        title="Eliminar fecha"
      >
        🗑️
      </button>

    </div>

  `;


  card
    .querySelector(
      ".editar-fecha"
    )
    .addEventListener(
      "click",
      () => {

        abrirModalEditarFecha(
          fecha.id
        );

      }
    );


  card
    .querySelector(
      ".eliminar-fecha"
    )
    .addEventListener(
      "click",
      () => {

        eliminarFecha(
          fecha.id
        );

      }
    );


  return card;

}


// ========================================
// LIMPIAR MODAL EXISTENTE
// ========================================

function eliminarModalExistente() {

  const modalExistente =
    document.querySelector(
      ".modal-fecha"
    );


  if (
    modalExistente
  ) {

    modalExistente.remove();

  }

}


// ========================================
// ABRIR MODAL NUEVO
// ========================================

function abrirModalNuevaFecha() {

  estadoFechas.fechaEditandoId =
    null;


  abrirModalFecha({

    nombre:
      "",

    fecha:
      "",

    hora:
      "21:00",

    orden:
      estadoFechas.fechas.length + 1,

    activa:
      true

  });

}


// ========================================
// ABRIR MODAL DE EDICIÓN
// ========================================

function abrirModalEditarFecha(
  fechaId
) {

  const fecha =
    estadoFechas.fechas.find(
      item =>
        item.id === fechaId
    );


  if (
    !fecha
  ) {

    estadoFechas.mostrarToast(
      "No se encontró la fecha"
    );

    return;

  }


  estadoFechas.fechaEditandoId =
    fecha.id;


  abrirModalFecha(
    fecha
  );

}


// ========================================
// CREAR MODAL
// ========================================

function abrirModalFecha(
  fecha
) {

  eliminarModalExistente();


  const esEdicion =
    Boolean(
      estadoFechas.fechaEditandoId
    );


  const modal =
    document.createElement(
      "div"
    );


  modal.className =
    "modal-fecha";


  modal.innerHTML = `

    <section
      class="modal-fecha-contenido"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tituloModalFecha"
    >

      <h3 id="tituloModalFecha">
        ${
          esEdicion
            ? "Editar fecha"
            : "Nueva fecha"
        }
      </h3>


      <label>

        Nombre

        <input
          id="nombreFecha"
          type="text"
          value="${escaparHTML(
            fecha.nombre || ""
          )}"
          placeholder="Noche 1"
          autocomplete="off"
        >

      </label>


      <label>

        Fecha

        <input
          id="valorFecha"
          type="date"
          value="${escaparHTML(
            fecha.fecha || ""
          )}"
        >

      </label>


      <label>

        Hora

        <input
          id="horaFecha"
          type="time"
          value="${escaparHTML(
            fecha.hora || "21:00"
          )}"
        >

      </label>


      <label>

        Orden

        <input
          id="ordenFecha"
          type="number"
          min="1"
          value="${escaparHTML(
            fecha.orden || 1
          )}"
        >

      </label>


      <label class="campo-check">

        <input
          id="activaFecha"
          type="checkbox"
          ${
            fecha.activa !== false
              ? "checked"
              : ""
          }
        >

        <span>
          Fecha activa
        </span>

      </label>


      <div class="acciones-modal">

        <button
          type="button"
          id="cancelarFecha"
        >
          Cancelar
        </button>

        <button
          type="button"
          id="guardarFecha"
        >
          ${
            esEdicion
              ? "Guardar cambios"
              : "Guardar fecha"
          }
        </button>

      </div>

    </section>

  `;


  document.body.appendChild(
    modal
  );


  modal.addEventListener(
    "click",
    evento => {

      if (
        evento.target === modal
      ) {

        cerrarModalFecha();

      }

    }
  );


  document
    .getElementById(
      "cancelarFecha"
    )
    .addEventListener(
      "click",
      cerrarModalFecha
    );


  document
    .getElementById(
      "guardarFecha"
    )
    .addEventListener(
      "click",
      guardarFecha
    );


  setTimeout(
    () => {

      document
        .getElementById(
          "nombreFecha"
        )
        .focus();

    },
    50
  );

}


// ========================================
// CERRAR MODAL
// ========================================

function cerrarModalFecha() {

  if (
    estadoFechas.guardando
  ) {

    return;

  }


  eliminarModalExistente();


  estadoFechas.fechaEditandoId =
    null;

}


// ========================================
// OBTENER DATOS DEL FORMULARIO
// ========================================

function obtenerDatosFecha() {

  return {

    nombre:
      document
        .getElementById(
          "nombreFecha"
        )
        .value
        .trim(),

    fecha:
      document
        .getElementById(
          "valorFecha"
        )
        .value,

    hora:
      document
        .getElementById(
          "horaFecha"
        )
        .value,

    orden:
      Number(
        document
          .getElementById(
            "ordenFecha"
          )
          .value
      ),

    activa:
      document
        .getElementById(
          "activaFecha"
        )
        .checked

  };

}


// ========================================
// GUARDAR FECHA
// ========================================

async function guardarFecha() {

  if (
    estadoFechas.guardando
  ) {

    return;

  }


  const datos =
    obtenerDatosFecha();


  if (
    !datos.nombre ||
    !datos.fecha ||
    !datos.hora ||
    !Number.isInteger(
      datos.orden
    ) ||
    datos.orden < 1
  ) {

    estadoFechas.mostrarToast(
      "Completa correctamente todos los campos"
    );

    return;

  }


  const fechaAnteriorId =
    estadoFechas.fechaEditandoId;

  const nuevoId =
    datos.fecha;


  const fechaDuplicada =
    estadoFechas.fechas.some(
      fecha =>
        fecha.id === nuevoId &&
        fecha.id !== fechaAnteriorId
    );


  if (
    fechaDuplicada
  ) {

    estadoFechas.mostrarToast(
      "Ya existe una fecha con ese día"
    );

    return;

  }


  const botonGuardar =
    document.getElementById(
      "guardarFecha"
    );


  estadoFechas.guardando =
    true;

  botonGuardar.disabled =
    true;

  botonGuardar.textContent =
    fechaAnteriorId
      ? "Guardando cambios..."
      : "Guardando...";


  try {

    const referenciaNueva =
      doc(
        db,
        "eventos",
        estadoFechas.eventoId,
        "fechas",
        nuevoId
      );


    const datosFirestore = {

      nombre:
        datos.nombre,

      fecha:
        datos.fecha,

      hora:
        datos.hora,

      orden:
        datos.orden,

      activa:
        datos.activa,

      fechaActualizacion:
        serverTimestamp()

    };


    if (
      fechaAnteriorId &&
      fechaAnteriorId !== nuevoId
    ) {

      const batch =
        writeBatch(
          db
        );


      const referenciaAnterior =
        doc(
          db,
          "eventos",
          estadoFechas.eventoId,
          "fechas",
          fechaAnteriorId
        );


      batch.set(
        referenciaNueva,
        {
          ...datosFirestore,

          fechaCreacion:
            serverTimestamp()
        }
      );


      batch.delete(
        referenciaAnterior
      );


      await batch.commit();

    }

    else {

      await setDoc(
        referenciaNueva,
        {
          ...datosFirestore,

          ...(
            fechaAnteriorId
              ? {}
              : {
                  fechaCreacion:
                    serverTimestamp()
                }
          )
        },
        {
          merge: true
        }
      );

    }


    estadoFechas.mostrarToast(
      fechaAnteriorId
        ? "Fecha actualizada"
        : "Fecha creada"
    );


    estadoFechas.guardando =
      false;

    cerrarModalFecha();

    await cargarFechas();

  }

  catch (error) {

    console.error(
      "Error al guardar fecha:",
      error
    );


    estadoFechas.mostrarToast(
      error.message ||
      "No se pudo guardar la fecha"
    );

  }

  finally {

    estadoFechas.guardando =
      false;


    if (
      botonGuardar
    ) {

      botonGuardar.disabled =
        false;

    }

  }

}


// ========================================
// ELIMINAR FECHA
// ========================================

async function eliminarFecha(
  fechaId
) {

  if (
    estadoFechas.eliminando
  ) {

    return;

  }


  const fecha =
    estadoFechas.fechas.find(
      item =>
        item.id === fechaId
    );


  if (
    !fecha
  ) {

    return;

  }


  const confirmar =
    window.confirm(
      `¿Eliminar "${fecha.nombre}" (${formatearFecha(fecha.fecha)})?`
    );


  if (
    !confirmar
  ) {

    return;

  }


  estadoFechas.eliminando =
    true;


  try {

    await deleteDoc(
      doc(
        db,
        "eventos",
        estadoFechas.eventoId,
        "fechas",
        fechaId
      )
    );


    estadoFechas.mostrarToast(
      "Fecha eliminada"
    );


    await cargarFechas();

  }

  catch (error) {

    console.error(
      "Error al eliminar fecha:",
      error
    );


    estadoFechas.mostrarToast(
      "No se pudo eliminar la fecha"
    );

  }

  finally {

    estadoFechas.eliminando =
      false;

  }

}


// ========================================
// FUNCIÓN PÚBLICA DEL MÓDULO
// ========================================

export async function renderFechas({
  eventoId,
  contenedor,
  mostrarToast
}) {

  if (
    !eventoId
  ) {

    throw new Error(
      "No se recibió el ID del evento."
    );

  }


  if (
    !contenedor
  ) {

    throw new Error(
      "No se recibió el contenedor de Fechas."
    );

  }


  estadoFechas.eventoId =
    eventoId;

  estadoFechas.contenedor =
    contenedor;

  estadoFechas.fechaEditandoId =
    null;


  if (
    typeof mostrarToast ===
    "function"
  ) {

    estadoFechas.mostrarToast =
      mostrarToast;

  }


  mostrarEstructura();

  await cargarFechas();

}
