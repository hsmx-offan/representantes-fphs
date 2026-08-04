// ========================================
// ESTADOS DE CARGA
// ========================================

export function mostrarCargando({

  contenedor,

  mensaje = "Cargando..."

}) {

  contenedor.innerHTML = `

    <div class="sin-registros">

      <strong>
        ${mensaje}
      </strong>

    </div>

  `;

}


// ========================================
// SIN REGISTROS
// ========================================

export function mostrarVacio({

  contenedor,

  icono = "📂",

  titulo,

  descripcion

}) {

  contenedor.innerHTML = `

    <div class="sin-registros">

      <span class="estado-icono">

        ${icono}

      </span>

      <strong>

        ${titulo}

      </strong>

      <p>

        ${descripcion}

      </p>

    </div>

  `;

}


// ========================================
// ERROR
// ========================================

export function mostrarError({

  contenedor,

  mensaje

}) {

  contenedor.innerHTML = `

    <div class="sin-registros">

      <span class="estado-icono">

        ⚠️

      </span>

      <strong>

        Ocurrió un error

      </strong>

      <p>

        ${mensaje}

      </p>

    </div>

  `;

}
