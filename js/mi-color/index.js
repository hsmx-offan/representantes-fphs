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
// PASOS
// ========================================

const pasoFecha =
  document.getElementById(
    "pasoFecha"
  );

const pasoZona =
  document.getElementById(
    "pasoZona"
  );

const pasoCancion =
  document.getElementById(
    "pasoCancion"
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
// MOSTRAR PASO
// ========================================

function mostrarPaso(
  paso
) {

  pasoFecha.hidden =
    paso !== "fecha";

  pasoZona.hidden =
    paso !== "zona";

  pasoCancion.hidden =
    paso !== "cancion";

}


// ========================================
// REINICIAR FLUJO
// ========================================

function reiniciarFlujo() {

  fechaSelect.value =
    "";

  zonaSelect.value =
    "";

  fanProjectSelect.value =
    "";


  zonaSelect.disabled =
    true;

  fanProjectSelect.disabled =
    true;


 limpiarResultado({

  resultado,

  sinColor,

  contenido

});


  mostrarPaso(
    "fecha"
  );

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


    reiniciarFlujo();


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

 limpiarResultado({

  resultado,

  sinColor,

  contenido

});


  if (
    !fechaSelect.value
  ) {

    return;

  }


  zonaSelect.value =
    "";

  fanProjectSelect.value =
    "";


  zonaSelect.disabled =
    false;

  fanProjectSelect.disabled =
    true;


  mostrarPaso(
    "zona"
  );


  zonaSelect.focus();

}


// ========================================
// CAMBIO DE ZONA
// ========================================

function manejarCambioZona() {

  limpiarResultado({

  resultado,

  sinColor,

  contenido

});


  if (
    !zonaSelect.value
  ) {

    return;

  }


  fanProjectSelect.value =
    "";

  fanProjectSelect.disabled =
    false;


  mostrarPaso(
    "cancion"
  );


  fanProjectSelect.focus();

}


// ========================================
// ACTUALIZAR RESULTADO
// ========================================

async function actualizarResultado() {

  limpiarResultado({

  resultado,

  sinColor,

  contenido

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

  contenido,

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
// VOLVER AL INICIO
// ========================================

function volverAlSelector() {

  cerrarPantallaColor({

    resultado,

    contenido

  });

  reiniciarFlujo();

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
