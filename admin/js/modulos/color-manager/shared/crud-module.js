/* ========================================
   CRUD MODULE
   BASE REUTILIZABLE
   ======================================== */

export function crearCrudModule(
  configuracion
) {

  if (
    !configuracion
  ) {

    throw new Error(
      "No se recibió la configuración del módulo."
    );

  }


  if (
    !configuracion.titulo
  ) {

    throw new Error(
      "El módulo necesita un título."
    );

  }


  if (
    !configuracion.subcoleccion
  ) {

    throw new Error(
      "El módulo necesita una subcolección."
    );

  }


  return {

    configuracion,


    async iniciar({
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
          "No se recibió el contenedor del módulo."
        );

      }


      console.log(
        `Iniciando ${configuracion.titulo}`,
        {
          eventoId,
          subcoleccion:
            configuracion.subcoleccion
        }
      );


      contenedor.innerHTML = `

        <div class="sin-registros">

          <strong>
            ${configuracion.titulo}
          </strong>

          <p>
            Motor CRUD conectado correctamente.
          </p>

        </div>

      `;


      if (
        typeof mostrarToast ===
        "function"
      ) {

        mostrarToast(
          `${configuracion.titulo} iniciado`
        );

      }

    }

  };

}
