/* =========================================
   COLOR MANAGER
   MÓDULO FECHAS
========================================= */

let fechas = [];

let fechaEditando = null;


/* =========================================
   RENDER
========================================= */

function renderFechas() {

    contenidoManager.innerHTML = `

        <div class="header-modulo">

            <div>

                <h3>📅 Fechas</h3>

                <p>

                    Administra todas las fechas
                    del evento.

                </p>

            </div>

            <button
                id="btnNuevaFecha"
                class="btn-principal"
            >

                ＋ Nueva fecha

            </button>

        </div>

        <div
            id="listaFechas"
            class="lista-fechas"
        >

        </div>

    `;

    pintarFechas();

    document
        .getElementById("btnNuevaFecha")
        .addEventListener(
            "click",
            () => abrirModalFecha()
        );

}


/* =========================================
   PINTAR
========================================= */

function pintarFechas(){

    const lista =
        document.getElementById(
            "listaFechas"
        );

    if(!lista)return;

    lista.innerHTML="";

    if(fechas.length===0){

        lista.innerHTML=`

            <div class="sin-registros">

                <h3>

                    No hay fechas.

                </h3>

                <p>

                    Agrega la primera fecha
                    del evento.

                </p>

            </div>

        `;

        return;

    }

    fechas
    .sort(
        (a,b)=>
        new Date(a.fecha)-new Date(b.fecha)
    )
    .forEach(fecha=>{

        lista.appendChild(

            crearCardFecha(fecha)

        );

    });

}


/* =========================================
   CARD
========================================= */

function crearCardFecha(fecha){

    const card =
        document.createElement("div");

    card.className =
        "card-fecha";

    card.innerHTML=`

        <div class="card-fecha-info">

            <h4>

                ${fecha.nombre}

            </h4>

            <span>

                📅 ${fecha.fecha}

            </span>

            <span>

                🕘 ${fecha.hora}

            </span>

        </div>

        <div
            class="card-fecha-acciones"
        >

            <button
                class="editar-fecha"
                data-id="${fecha.id}"
            >

                ✏️

            </button>

            <button
                class="eliminar-fecha"
                data-id="${fecha.id}"
            >

                🗑️

            </button>

        </div>

    `;

    return card;

}
/* =========================================
   MODAL
========================================= */

function abrirModalFecha() {

    const fecha = fechaEditando || {
        nombre: "",
        fecha: "",
        hora: "21:00"
    };

    const modal = document.createElement("div");

    modal.className = "modal-fecha";

    modal.innerHTML = `

        <div class="modal-fecha-contenido">

            <h3>

                ${
                    fechaEditando
                        ? "Editar fecha"
                        : "Nueva fecha"
                }

            </h3>

            <label>

                Nombre

                <input
                    id="nombreFecha"
                    type="text"
                    value="${fecha.nombre}"
                    placeholder="Noche 1"
                >

            </label>

            <label>

                Fecha

                <input
                    id="valorFecha"
                    type="date"
                    value="${fecha.fecha}"
                >

            </label>

            <label>

                Hora

                <input
                    id="horaFecha"
                    type="time"
                    value="${fecha.hora}"
                >

            </label>

            <div class="acciones-modal">

                <button
                    id="cancelarFecha"
                >
                    Cancelar
                </button>

                <button
                    id="guardarFecha"
                >
                    Guardar
                </button>

            </div>

        </div>

    `;

    document.body.appendChild(modal);

    document
        .getElementById("cancelarFecha")
        .addEventListener(
            "click",
            cerrarModalFecha
        );

    document
        .getElementById("guardarFecha")
        .addEventListener(
            "click",
            guardarFecha
        );

}


/* =========================================
   CERRAR MODAL
========================================= */

function cerrarModalFecha() {

    const modal =
        document.querySelector(
            ".modal-fecha"
        );

    if (modal) {

        modal.remove();

    }

    fechaEditando = null;

}


/* =========================================
   GUARDAR
========================================= */

function guardarFecha() {

    const nombre =
        document
            .getElementById("nombreFecha")
            .value
            .trim();

    const fecha =
        document
            .getElementById("valorFecha")
            .value;

    const hora =
        document
            .getElementById("horaFecha")
            .value;

    if (
        !nombre ||
        !fecha ||
        !hora
    ) {

        alert(
            "Completa todos los campos."
        );

        return;

    }

    if (fechaEditando) {

        fechaEditando.nombre = nombre;
        fechaEditando.fecha = fecha;
        fechaEditando.hora = hora;

    } else {

        fechas.push({

            id: Date.now(),

            nombre,

            fecha,

            hora

        });

    }

    cerrarModalFecha();

    pintarFechas();

}
/* =========================================
   EDITAR
========================================= */

function editarFecha(id){

    const fecha =
        fechas.find(
            item => item.id === id
        );

    if(!fecha)return;

    fechaEditando = fecha;

    abrirModalFecha();

}


/* =========================================
   ELIMINAR
========================================= */

function eliminarFecha(id){

    const confirmar =
        confirm(
            "¿Deseas eliminar esta fecha?"
        );

    if(!confirmar)return;

    fechas =
        fechas.filter(
            item => item.id !== id
        );

    pintarFechas();

}


/* =========================================
   EVENTOS
========================================= */

document.addEventListener("click",(e)=>{

    const botonEditar =
        e.target.closest(".editar-fecha");

    if(botonEditar){

        editarFecha(

            Number(
                botonEditar.dataset.id
            )

        );

        return;

    }

    const botonEliminar =
        e.target.closest(".eliminar-fecha");

    if(botonEliminar){

        eliminarFecha(

            Number(
                botonEliminar.dataset.id
            )

        );

    }

});


/* =========================================
   DATOS INICIALES
========================================= */

fechas = [

    {
        id:1,
        nombre:"Noche 1",
        fecha:"2026-07-31",
        hora:"21:00"
    },

    {
        id:2,
        nombre:"Noche 2",
        fecha:"2026-08-01",
        hora:"21:00"
    }

];
