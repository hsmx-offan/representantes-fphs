/* ========================================
   COLOR MANAGER
   RENDER DE EVENTOS
   ======================================== */


// ========================================
// ESCAPAR HTML
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
// MOSTRAR CARGA
// ========================================

export function mostrarCargaEventos({
  cargandoEventos,
  sinEventos,
  listaEventos
}) {

  cargandoEventos.style.display =
    "block";

  sinEventos.style.display =
    "none";

  listaEventos.style.display =
    "none";

}


// ========================================
// OCULTAR CARGA
// ========================================

export function ocultarCargaEventos(
  cargandoEventos
) {

  cargandoEventos.style.display =
    "none";

}


// ========================================
// MOSTRAR ERROR
// ========================================

export function mostrarErrorEventos({
  eventoActivo,
  cargandoEventos,
  sinEventos,
  listaEventos
}) {

  cargandoEventos.style.display =
    "none";

  sinEventos.style.display =
    "none";

  listaEventos.style.display =
    "block";


  eventoActivo.className =
    "evento-activo-vacio";

  eventoActivo.textContent =
    "No fue posible cargar el evento activo.";


  listaEventos.innerHTML = `

    <div class="sin-registros">

      <span class="estado-icono">
        ⚠️
      </span>

      <strong>
        No se pudieron cargar las ediciones
      </strong>

      <p>
        Revisa la conexión y las reglas de Firestore.
      </p>

    </div>

  `;

}


// ========================================
// RENDERIZAR EVENTO ACTIVO
// ========================================

function renderizarEventoActivo({
  eventos,
  contenedor
}) {

  const eventoActivo =
    eventos.find(
      evento =>
        evento.activo === true
    );


  if (
    !eventoActivo
  ) {

    contenedor.className =
      "evento-activo-vacio";

    contenedor.textContent =
      "No hay evento activo.";

    return;

  }


  contenedor.className =
    "evento-activo-card";


  contenedor.innerHTML = `

    <div>

      <strong>
        ${escaparHTML(
          eventoActivo.nombre ||
          eventoActivo.id
        )}
      </strong>

      <p>
        ${escaparHTML(
          eventoActivo.ciudad ||
          "Sin ciudad"
        )},
        ${escaparHTML(
          eventoActivo.pais ||
          "Sin país"
        )}
        ·
        ${escaparHTML(
          eventoActivo.anio ||
          "Sin año"
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


  tarjeta.innerHTML = `

    <div class="evento-informacion">

      <div class="evento-titulo">

        <strong>
          ${escaparHTML(
            evento.nombre ||
            evento.id
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
          evento.ciudad ||
          "Sin ciudad"
        )},
        ${escaparHTML(
          evento.pais ||
          "Sin país"
        )}
        ·
        ${escaparHTML(
          evento.anio ||
          "Sin año"
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
// RENDERIZAR EVENTOS
// ========================================

export function renderizarEventos({
  eventos,
  eventoActivo,
  cargandoEventos,
  sinEventos,
  listaEventos
}) {

  const lista =
    Array.isArray(
      eventos
    )
      ? eventos
      : [];


  renderizarEventoActivo({
    eventos:
      lista,

    contenedor:
      eventoActivo
  });


  cargandoEventos.style.display =
    "none";

  listaEventos.innerHTML =
    "";


  if (
    lista.length === 0
  ) {

    listaEventos.style.display =
      "none";

    sinEventos.style.display =
      "block";

    return;

  }


  sinEventos.style.display =
    "none";

  listaEventos.style.display =
    "grid";


  const fragmento =
    document.createDocumentFragment();


  for (
    const evento
    of lista
  ) {

    fragmento.appendChild(
      crearTarjetaEvento(
        evento
      )
    );

  }


  listaEventos.appendChild(
    fragmento
  );

}
