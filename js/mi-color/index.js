/* ========================================
   MI COLOR
   INDEX
   ======================================== */

import {
  obtenerEventoActivo,
  listarFechas,
  listarZonas,
  listarFanProjects,
  obtenerColor
} from "./api.js";

import {
  llenarSelect,
  mostrarColor,
  limpiarResultado,
  cerrarPantallaColor,
  mostrarCarga,
  mostrarContenido,
  mostrarError
} from "./render.js";


// ========================================
// ELEMENTOS GENERALES
// ========================================

const cargando =
  document.getElementById(
    "cargandoApp"
  );

const error =
  document.getElementById(
    "errorApp"
  );

const contenido =
  document.getElementById(
    "contenidoApp"
  );

const mensajeError =
  document.getElementById(
    "mensajeError"
  );


// ========================================
// CAMPOS PROGRESIVOS
// ========================================

const campoZona =
  document.getElementById(
    "campoZona"
  );

const campoFanProject =
  document.getElementById(
    "campoFanProject"
  );


// ========================================
// SELECTORES
// ========================================

const fechaSelect =
  document.getElementById(
    "fechaSelect"
  );

const zonaSelect =
  document.getElementById(
    "zonaSelect"
  );

const fanProjectSelect =
  document.getElementById(
    "fanProjectSelect"
  );


// ========================================
// RESULTADO
// ========================================

const resultado =
  document.getElementById(
    "resultadoColor"
  );

const sinColor =
  document.getElementById(
    "sinColor"
  );

const nombre =
  document.getElementById(
    "nombreColor"
  );

const cancionResultado =
  document.getElementById(
    "cancionResultado"
  );

const zonaResultado =
  document.getElementById(
    "zonaResultado"
  );

const volverSelector =
  document.getElementById(
    "volverSelector"
  );


// ========================================
// ESTADO
// ========================================

let evento =
  null;

let fechas =
  [];

let zonas =
  [];

let fanProjects =
  [];

let consultandoColor =
  false;


// ========================================
// OBTENER REGISTROS SELECCIONADOS
// ========================================

function obtenerZonaSeleccionada() {

  return zonas.find(
    zona =>
      zona.id ===
      zonaSelect.value
  ) || null;

}


function obtenerFanProjectSeleccionado() {

  return fanProjects.find(
    fanProject =>
      fanProject.id ===
      fanProjectSelect.value
  ) || null;

}


// ========================================
// REINICIAR DESDE FECHA
// ========================================

function reiniciarDespuesDeFecha() {

  zonaSelect.value =
    "";

  fanProjectSelect.value =
    "";


  campoFanProject.hidden =
    true;

  fanProjectSelect.disabled =
    true;


  limpiarResultado({

    resultado,

    sinColor

  });

}


// ========================================
// REINICIAR DESDE ZONA
// ========================================

function reiniciarDespuesDeZona() {

  fanProjectSelect.value =
    "";

  campoFanProject.hidden =
    true;

  fanProjectSelect.disabled =
    true;


  limpiarResultado({

    resultado,

    sinColor

  });

}


// ========================================
// INICIAR
// ========================================

async function iniciar() {

  try {

    mostrarCarga({

      cargando,

      contenido,

      error

    });


    evento =
      await obtenerEventoActivo();


    const resultados =
      await Promise.all([

        listarFechas(
          evento.id
        ),

        listarZonas(
          evento.id
        ),

        listarFanProjects(
          evento.id
        )

      ]);


    fechas =
      resultados[0];

    zonas =
      resultados[1];

    fanProjects =
      resultados[2];


    llenarSelect(

      fechaSelect,

      fechas.filter(
        fecha =>
          fecha.activa !== false
      ),

      "Selecciona una fecha"

    );


    llenarSelect(

      zonaSelect,

      zonas.filter(
        zona =>
          zona.activa !== false
      ),

      "Selecciona una zona"

    );


    llenarSelect(

      fanProjectSelect,

      fanProjects.filter(
        fanProject =>
          fanProject.activo !== false
      ),

      "Selecciona una canción"

    );


    campoZona.hidden =
      true;

    campoFanProject.hidden =
      true;


    zonaSelect.disabled =
      true;

    fanProjectSelect.disabled =
      true;


    mostrarContenido({

      cargando,

      contenido,

      error

    });

  }

  catch (
    err
  ) {

    console.error(
      "Error iniciando Mi Color:",
      err
    );


    mostrarError({

      cargando,

      contenido,

      error,

      mensaje:
        err.message ||
        "No se pudo cargar la configuración.",

      textoError:
        mensajeError

    });

  }

}


// ========================================
// CAMBIO DE FECHA
// ========================================

function manejarCambioFecha() {

  reiniciarDespuesDeFecha();


  if (
    !fechaSelect.value
  ) {

    campoZona.hidden =
      true;

    zonaSelect.disabled =
      true;

    return;

  }


  campoZona.hidden =
    false;

  zonaSelect.disabled =
    false;

}


// ========================================
// CAMBIO DE ZONA
// ========================================

function manejarCambioZona() {

  reiniciarDespuesDeZona();


  if (
    !zonaSelect.value
  ) {

    return;

  }


  campoFanProject.hidden =
    false;

  fanProjectSelect.disabled =
    false;

}


// ========================================
// ACTUALIZAR RESULTADO
// ========================================

async function actualizarResultado() {

  limpiarResultado({

    resultado,

    sinColor

  });


  if (
    !fechaSelect.value ||
    !zonaSelect.value ||
    !fanProjectSelect.value ||
    !evento ||
    consultandoColor
  ) {

    return;

  }


  const zona =
    obtenerZonaSeleccionada();

  const fanProject =
    obtenerFanProjectSeleccionado();


  if (
    !zona ||
    !fanProject
  ) {

    return;

  }


  consultandoColor =
    true;

  fanProjectSelect.disabled =
    true;


  try {

    const color =
      await obtenerColor({

        eventoId:
          evento.id,

        fanProjectId:
          fanProject.id,

        zonaId:
          zona.id

      });


    mostrarColor({

      resultado,

      sinColor,

      nombre,

      cancionResultado,

      zonaResultado,

      color,

      cancion:
        fanProject.nombre ||
        fanProject.id,

      zona:
        zona.nombre ||
        zona.id

    });

  }

  catch (
    err
  ) {

    console.error(
      "Error obteniendo el color:",
      err
    );


    mostrarError({

      cargando,

      contenido,

      error,

      mensaje:
        "No se pudo consultar el color.",

      textoError:
        mensajeError

    });

  }

  finally {

    consultandoColor =
      false;

    fanProjectSelect.disabled =
      false;

  }

}


// ========================================
// VOLVER AL SELECTOR
// ========================================

function volverAlSelector() {

  cerrarPantallaColor(
    resultado
  );

}


// ========================================
// EVENTOS
// ========================================

fechaSelect.addEventListener(
  "change",
  manejarCambioFecha
);

zonaSelect.addEventListener(
  "change",
  manejarCambioZona
);

fanProjectSelect.addEventListener(
  "change",
  actualizarResultado
);

volverSelector.addEventListener(
  "click",
  volverAlSelector
);


// ========================================
// INICIAR APP
// ========================================

iniciar();
