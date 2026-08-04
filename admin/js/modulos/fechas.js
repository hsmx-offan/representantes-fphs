/* =========================================
   MÓDULO FECHAS
========================================= */

const fechasDemo = [

    {
        id: 1,
        nombre: "Noche 1",
        fecha: "31/07/2026",
        hora: "21:00"
    },

    {
        id: 2,
        nombre: "Noche 2",
        fecha: "01/08/2026",
        hora: "21:00"
    }

];

function renderFechas(){

    contenidoManager.innerHTML = `

        <div class="header-modulo">

            <div>

                <h3>
                    📅 Fechas del evento
                </h3>

                <p>
                    Administra las fechas del tour.
                </p>

            </div>

            <button id="btnNuevaFecha">

                ＋ Agregar fecha

            </button>

        </div>


        <table class="tabla-manager">

            <thead>

                <tr>

                    <th>Fecha</th>

                    <th>Nombre</th>

                    <th>Hora</th>

                    <th></th>

                </tr>

            </thead>

            <tbody id="tbodyFechas">

            </tbody>

        </table>

    `;

    const tbody =
        document.getElementById("tbodyFechas");

    fechasDemo.forEach(fecha=>{

        tbody.innerHTML += `

        <tr>

            <td>${fecha.fecha}</td>

            <td>${fecha.nombre}</td>

            <td>${fecha.hora}</td>

            <td>

                <button>

                    ✏️

                </button>

                <button>

                    🗑️

                </button>

            </td>

        </tr>

        `;

    });

}
