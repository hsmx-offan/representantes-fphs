/* =========================================
   COLOR MANAGER
========================================= */

const eventosDemo = [

    {
        id: "2026",
        nombre: "Together Together Tour México 2026",
        activo: true
    },

    {
        id: "2028",
        nombre: "Harry Styles México 2028",
        activo: false
    }

];


/* =========================================
   ELEMENTOS
========================================= */

const lista =
    document.getElementById("listaEventos");

const activo =
    document.getElementById("eventoActivo");

const colorHome =
    document.querySelector(".color-home");

const vistaEvento =
    document.getElementById("vistaEvento");

const tituloEvento =
    document.getElementById("tituloEvento");

const volverEventos =
    document.getElementById("volverEventos");

const contenidoManager =
    document.getElementById("contenidoManager");

const tabs =
    document.querySelectorAll(".tab-manager");


/* =========================================
   CARGAR EVENTOS
========================================= */

function cargarEventos() {

    const eventoActivo =
        eventosDemo.find(
            evento => evento.activo
        );

    activo.textContent =
        eventoActivo
            ? eventoActivo.nombre
            : "No hay evento activo.";

    lista.innerHTML = "";

    eventosDemo.forEach(evento => {

        lista.innerHTML += `

        <div class="evento">

            <div>

                <strong>
                    ${evento.nombre}
                </strong>

                <small>
                    ${
                        evento.activo
                        ? "🟢 Activo"
                        : "⚪ Inactivo"
                    }
                </small>

            </div>

            <button
                class="abrirEvento"
                data-id="${evento.id}"
            >
                Abrir
            </button>

        </div>

        `;

    });

}


/* =========================================
   CAMBIAR PESTAÑA
========================================= */

function mostrarModulo(modulo){

    tabs.forEach(tab=>{

        tab.classList.toggle(
            "activa",
            tab.dataset.tab===modulo
        );

    });

    switch(modulo){

        case "fechas":

    renderFechas();

break;

            contenidoManager.innerHTML=`

                <h3>
                    📅 Fechas
                </h3>

                <p>

                    Aquí aparecerán todas las
                    fechas del evento.

                </p>

                <button>

                    ＋ Agregar fecha

                </button>

            `;

        break;



        case "zonas":

            contenidoManager.innerHTML=`

                <h3>
                    🪑 Zonas
                </h3>

                <p>

                    Aquí aparecerán todas las
                    zonas.

                </p>

                <button>

                    ＋ Agregar zona

                </button>

            `;

        break;



        case "fanprojects":

            contenidoManager.innerHTML=`

                <h3>
                    🌈 Fan Projects
                </h3>

                <p>

                    Aquí administrarás todos
                    los fan projects.

                </p>

                <button>

                    ＋ Nuevo Fan Project

                </button>

            `;

        break;



        case "informacion":

            contenidoManager.innerHTML=`

                <h3>
                    ⚙ Información
                </h3>

                <p>

                    Configuración general
                    del evento.

                </p>

            `;

        break;

    }

}


/* =========================================
   EVENTOS
========================================= */

document.addEventListener("click",(e)=>{

    if(e.target.classList.contains("abrirEvento")){

        const evento=
            eventosDemo.find(
                ev=>ev.id===e.target.dataset.id
            );

        if(!evento)return;

        tituloEvento.textContent=
            evento.nombre;

        colorHome.hidden=true;

        vistaEvento.hidden=false;

        mostrarModulo("fechas");

    }

});


volverEventos.addEventListener("click",()=>{

    vistaEvento.hidden=true;

    colorHome.hidden=false;

});


tabs.forEach(tab=>{

    tab.addEventListener("click",()=>{

        mostrarModulo(
            tab.dataset.tab
        );

    });

});


/* =========================================
   INICIO
========================================= */

cargarEventos();
