/* =========================================
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
                    Administra las fechas del evento.
                </p>

            </div>

            <button
                id="btnNuevaFecha"
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
            abrirModalFecha
        );

}


/* =========================================
   PINTAR FECHAS
========================================= */

function pintarFechas(){

    const lista =
        document.getElementById(
            "listaFechas"
        );

    lista.innerHTML = "";

    if(fechas.length===0){

        lista.innerHTML=`

            <div class="sin-registros">

                Aún no existen fechas.

            </div>

        `;

        return;

    }

    fechas.forEach(fecha=>{

        lista.appendChild(

            crearCardFecha(
                fecha
            )

        );

    });

}
