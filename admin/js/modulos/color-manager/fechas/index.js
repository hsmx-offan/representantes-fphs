import {
  listar,
  guardar,
  eliminar
} from "../shared/crud-manager.js";

import {
  abrirModalCompartido,
  cerrarModalCompartido,
  bloquearModalCompartido,
  cambiarTextoGuardar
} from "../shared/modal.js";

import {
  crearVistaFechas,
  mostrarCargaFechas,
  mostrarErrorFechas,
  renderizarFechas
} from "./render.js";


// ========================================
// CONFIGURACIÓN
// ========================================

const SUBCOLECCION =
  "fechas";


// ========================================
// ESTADO
// ========================================

const estadoFechas = {

  eventoId:
    null,

  contenedor:
    null,

  lista:
    null,

  botonNueva:
    null,

  fechas:
    [],

  fechaEditando:
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
// FORMATEAR FECHA
// ========================================

function formatearFecha(
  fecha
) {

  if (
    !fecha
  ) {

    return "";

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
      Number(
        anio
      ),
      Number(
        mes
      ) - 1,
      Number(
        dia
      )
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
// CARGAR FECHAS
// ========================================

async function cargarFechas() {

  if (
    estadoFechas.cargando
  ) {

    return;

  }


  estadoFechas.cargando =
    true;

  mostrarCargaFechas(
    estadoFechas.lista
  );


  try {

    estadoFechas.fechas =
      await listar({

        eventoId:
          estadoFechas.eventoId,

        subcoleccion:
          SUBCOLECCION,

        ordenarPor:
          "orden"

      });


    pintarFechas();

  }

  catch (error) {

    console.error(
      "Error cargando fechas:",
      error
    );


    mostrarErrorFechas(
      estadoFechas.lista
    );


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

  const fechasPreparadas =
    estadoFechas.fechas.map(
      fecha => ({

        ...fecha,

        fechaMostrada:
          formatearFecha(
            fecha.fecha
          )

      })
    );


  renderizarFechas({

    lista:
      estadoFechas.lista,

    fechas:
      fechasPreparadas,

    alEditar:
      abrirModalEditarFecha,

    alEliminar:
      procesarEliminacion

  });

}


// ========================================
// CREAR CONTENIDO DEL FORMULARIO
// ========================================

function crearContenidoFormulario(
  fecha
) {

  return `

    <div class="campo">

      <label for="nombreFecha">
        Nombre
      </label>

      <input
        type="text"
        id="nombreFecha"
        placeholder="Noche 1"
        value="${escaparHTML(
          fecha.nombre || ""
        )}"
        autocomplete="off"
        required
      >

    </div>


    <div class="formulario-grid">

      <div class="campo">

        <label for="valorFecha">
          Fecha
        </label>

        <input
          type="date"
          id="valorFecha"
          value="${escaparHTML(
            fecha.fecha || ""
          )}"
          required
        >

      </div>


      <div class="campo">

        <label for="horaFecha">
          Hora
        </label>

        <input
          type="time"
          id="horaFecha"
          value="${escaparHTML(
            fecha.hora || "21:00"
          )}"
          required
        >

      </div>

    </div>


    <div class="campo">

      <label for="ordenFecha">
        Orden
      </label>

      <input
        type="number"
        id="ordenFecha"
        min="1"
        value="${escaparHTML(
          fecha.orden || 1
        )}"
        required
      >

    </div>


    <label class="campo-check">

      <input
        type="checkbox"
        id="activaFecha"
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

  `;

}


// ========================================
// OBTENER DATOS DEL FORMULARIO
// ========================================

function obtenerDatosFormulario(
  formulario
) {

  return {

    nombre:
      formulario
        .querySelector(
          "#nombreFecha"
        )
        .value
        .trim(),

    fecha:
      formulario
        .querySelector(
          "#valorFecha"
        )
        .value,

    hora:
      formulario
        .querySelector(
          "#horaFecha"
        )
        .value,

    orden:
      Number(
        formulario
          .querySelector(
            "#ordenFecha"
          )
          .value
      ),

    activa:
      formulario
        .querySelector(
          "#activaFecha"
        )
        .checked

  };

}


// ========================================
// VALIDAR FECHA
// ========================================

function validarFecha(
  datos
) {

  if (
    !datos.nombre
  ) {

    throw new Error(
      "Escribe el nombre de la fecha."
    );

  }


  if (
    !datos.fecha
  ) {

    throw new Error(
      "Selecciona una fecha."
    );

  }


  if (
    !datos.hora
  ) {

    throw new Error(
      "Selecciona una hora."
    );

  }


  if (
    !Number.isInteger(
      datos.orden
    ) ||
    datos.orden < 1
  ) {

    throw new Error(
      "El orden debe ser un número mayor a cero."
    );

  }

}


// ========================================
// ABRIR MODAL NUEVO
// ========================================

function abrirModalNuevaFecha() {

  estadoFechas.fechaEditando =
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
// ABRIR MODAL EDITAR
// ========================================

function abrirModalEditarFecha(
  fecha
) {

  estadoFechas.fechaEditando =
    fecha;


  abrirModalFecha(
    fecha
  );

}


// ========================================
// ABRIR MODAL
// ========================================

function abrirModalFecha(
  fecha
) {

  const esEdicion =
    Boolean(
      estadoFechas.fechaEditando
    );


  abrirModalCompartido({

    titulo:
      esEdicion
        ? "Editar fecha"
        : "Nueva fecha",

    contenido:
      crearContenidoFormulario(
        fecha
      ),

    textoGuardar:
      esEdicion
        ? "Guardar cambios"
        : "Guardar fecha",

    selectorFocus:
      "#nombreFecha",

    alCerrar:
      () => {

        estadoFechas.fechaEditando =
          null;

      },

    alGuardar:
      async ({
        formulario
      }) => {

        await guardarFecha({
          formulario,
          esEdicion
        });

      }

  });

}


// ========================================
// GUARDAR FECHA
// ========================================

async function guardarFecha({
  formulario,
  esEdicion
}) {

  if (
    estadoFechas.guardando
  ) {

    return;

  }


  const datos =
    obtenerDatosFormulario(
      formulario
    );


  try {

    validarFecha(
      datos
    );

  }

  catch (error) {

    estadoFechas.mostrarToast(
      error.message
    );

    return;

  }


  const idAnterior =
    estadoFechas.fechaEditando?.id ||
    null;

  const nuevoId =
    datos.fecha;


  const fechaDuplicada =
    estadoFechas.fechas.some(
      fecha =>
        fecha.id === nuevoId &&
        fecha.id !== idAnterior
    );


  if (
    fechaDuplicada
  ) {

    estadoFechas.mostrarToast(
      "Ya existe una fecha con ese día"
    );

    return;

  }


  estadoFechas.guardando =
    true;

  bloquearModalCompartido(
    true
  );

  cambiarTextoGuardar(
    esEdicion
      ? "Guardando cambios..."
      : "Guardando..."
  );


  try {

    if (
      esEdicion &&
      idAnterior &&
      idAnterior !== nuevoId
    ) {

      await guardar({

        eventoId:
          estadoFechas.eventoId,

        subcoleccion:
          SUBCOLECCION,

        id:
          nuevoId,

        datos,

        esNuevo:
          true

      });


      await eliminar({

        eventoId:
          estadoFechas.eventoId,

        subcoleccion:
          SUBCOLECCION,

        id:
          idAnterior

      });

    }

    else {

      await guardar({

        eventoId:
          estadoFechas.eventoId,

        subcoleccion:
          SUBCOLECCION,

        id:
          nuevoId,

        datos,

        esNuevo:
          !esEdicion

      });

    }


    estadoFechas.mostrarToast(
      esEdicion
        ? "Fecha actualizada"
        : "Fecha creada"
    );


    bloquearModalCompartido(
      false
    );

    cerrarModalCompartido();


    estadoFechas.fechaEditando =
      null;


    await cargarFechas();

  }

  catch (error) {

    console.error(
      "Error guardando fecha:",
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

    bloquearModalCompartido(
      false
    );


    cambiarTextoGuardar(
      esEdicion
        ? "Guardar cambios"
        : "Guardar fecha"
    );

  }

}


// ========================================
// ELIMINAR FECHA
// ========================================

async function procesarEliminacion(
  fecha
) {

  if (
    estadoFechas.eliminando
  ) {

    return;

  }


  const confirmar =
    window.confirm(
      `¿Eliminar "${fecha.nombre}"?`
    );


  if (
    !confirmar
  ) {

    return;

  }


  estadoFechas.eliminando =
    true;


  try {

    await eliminar({

      eventoId:
        estadoFechas.eventoId,

      subcoleccion:
        SUBCOLECCION,

      id:
        fecha.id

    });


    estadoFechas.mostrarToast(
      "Fecha eliminada"
    );


    await cargarFechas();

  }

  catch (error) {

    console.error(
      "Error eliminando fecha:",
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
// INICIAR MÓDULO
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
      "No se recibió el contenedor."
    );

  }


  estadoFechas.eventoId =
    eventoId;

  estadoFechas.contenedor =
    contenedor;

  estadoFechas.fechaEditando =
    null;


  if (
    typeof mostrarToast ===
    "function"
  ) {

    estadoFechas.mostrarToast =
      mostrarToast;

  }


  const vista =
    crearVistaFechas(
      contenedor
    );


  estadoFechas.lista =
    vista.lista;

  estadoFechas.botonNueva =
    vista.botonNueva;


  estadoFechas.botonNueva.addEventListener(
    "click",
    abrirModalNuevaFecha
  );


  await cargarFechas();

}
