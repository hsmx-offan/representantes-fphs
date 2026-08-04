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

    mostrarCarga,

    mostrarContenido,

    mostrarError

} from "./render.js";


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


const resultado =
    document.getElementById(
        "resultadoColor"
    );

const sinColor =
    document.getElementById(
        "sinColor"
    );

const muestra =
    document.getElementById(
        "muestraColor"
    );

const nombre =
    document.getElementById(
        "nombreColor"
    );

const detalle =
    document.getElementById(
        "detalleResultado"
    );


let evento = null;

let fechas = [];

let zonas = [];

let fanProjects = [];


/* ========================================
   INICIAR
======================================== */

async function iniciar() {

    try {

        mostrarCarga({

            cargando,

            contenido,

            error

        });

        evento =
            await obtenerEventoActivo();

        fechas =
            await listarFechas(
                evento.id
            );

        zonas =
            await listarZonas(
                evento.id
            );

        fanProjects =
            await listarFanProjects(
                evento.id
            );

        llenarSelect(

            fechaSelect,

            fechas,

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

                item =>
                    item.activo !== false

            ),

            "Selecciona una canción"

        );

        mostrarContenido({

            cargando,

            contenido,

            error

        });

    }

    catch(err){

        console.error(
            err
        );

        mostrarError({

            cargando,

            contenido,

            error,

            mensaje:
                err.message,

            textoError:
                mensajeError

        });

    }

}

iniciar();


/* ========================================
   CAMBIOS
======================================== */

fechaSelect.addEventListener(

    "change",

    actualizarResultado

);

zonaSelect.addEventListener(

    "change",

    actualizarResultado

);

fanProjectSelect.addEventListener(

    "change",

    actualizarResultado

);


/* ========================================
   RESULTADO
======================================== */

async function actualizarResultado(){

    limpiarResultado({

        resultado,

        sinColor

    });

    if(

        !fechaSelect.value ||

        !zonaSelect.value ||

        !fanProjectSelect.value

    ){

        return;

    }

    const color =
        await obtenerColor({

            eventoId:
                evento.id,

            fanProjectId:
                fanProjectSelect.value,

            zonaId:
                zonaSelect.value

        });

    mostrarColor({

        resultado,

        sinColor,

        muestra,

        nombre,

        detalle,

        color

    });

}
