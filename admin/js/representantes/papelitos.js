// ========================================
// CONTROLADOR DE PAPELITOS
// ========================================

export function crearPapelitosController({
  auth,
  apiUrl,
  tablaRepresentantes,

  estadoPapelitos,
  detallePapelitos,
  cambiarPapelitos,

  crearClavePapelitos,
  normalizarTexto,
  mostrarToast,
  formatearFechaConfirmacion,

  obtenerRepresentanteSeleccionado
}) {

  let registrosPapelitos = [];
  let papelitosSeleccionado = null;


  function obtenerPapelitos(
    representante
  ) {

    const clave =
      crearClavePapelitos(
        representante.id,
        representante.fecha,
        representante.zona
      );


    const registroControl =
      registrosPapelitos.find(
        registro =>
          crearClavePapelitos(
            registro.id,
            registro.fecha,
            registro.zona
          ) === clave
      );


    if (registroControl) {

      return registroControl;

    }


    const estadoOriginal =
      normalizarTexto(
        representante.estado
      );


    if (
      estadoOriginal ===
      "confirmado"
    ) {

      return {
        id: representante.id,
        fecha: representante.fecha,
        zona: representante.zona,

        confirmado: true,

        confirmadoPor:
          "Registro previo",

        fechaConfirmacion:
          ""
      };

    }


    if (
      estadoOriginal ===
      "cancelado"
    ) {

      return {
        id: representante.id,
        fecha: representante.fecha,
        zona: representante.zona,

        confirmado: false,
        cancelado: true,

        confirmadoPor: "",
        fechaConfirmacion: ""
      };

    }


    return {
      id: representante.id,
      fecha: representante.fecha,
      zona: representante.zona,

      confirmado: false,

      confirmadoPor: "",
      fechaConfirmacion: ""
    };

  }


  async function peticionPapelitos(
    datos
  ) {

    const user =
      auth.currentUser;


    if (!user) {

      throw new Error(
        "No hay una sesión activa."
      );

    }


    const idToken =
      await user.getIdToken();


    const respuesta =
      await fetch(
        apiUrl,
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify({
              ...datos,
              idToken
            })
        }
      );


    if (!respuesta.ok) {

      throw new Error(
        "No se pudo conectar con el control de papelitos."
      );

    }


    const resultado =
      await respuesta.json();


    if (!resultado.ok) {

      throw new Error(
        resultado.error ||
        "Ocurrió un error con el control de papelitos."
      );

    }


    return resultado;

  }


  async function cargarPapelitos() {

    const resultado =
      await peticionPapelitos({
        accion:
          "listar"
      });


    registrosPapelitos =
      Array.isArray(
        resultado.registros
      )
        ? resultado.registros
        : [];

  }


  function mostrarEstadoPapelitos(
    representante
  ) {

    papelitosSeleccionado =
      obtenerPapelitos(
        representante
      );


    const confirmado =
      papelitosSeleccionado &&
      papelitosSeleccionado.confirmado ===
        true;


    if (confirmado) {

      estadoPapelitos.textContent =
        "✅ Confirmados";


      const partes =
        [];


      if (
        papelitosSeleccionado.confirmadoPor
      ) {

        partes.push(
          `Confirmado por: ${papelitosSeleccionado.confirmadoPor}`
        );

      }


      const fecha =
        formatearFechaConfirmacion(
          papelitosSeleccionado.fechaConfirmacion
        );


      if (fecha) {

        partes.push(
          fecha
        );

      }


      detallePapelitos.textContent =
        partes.join(
          " · "
        );

      cambiarPapelitos.textContent =
        "Marcar como pendiente";

    }

    else {

      estadoPapelitos.textContent =
        "⏳ Pendiente";

      detallePapelitos.textContent =
        "Aún no se ha confirmado la entrega de papelitos.";

      cambiarPapelitos.textContent =
        "Confirmar papelitos";

    }


    cambiarPapelitos.disabled =
      false;

  }


  function actualizarPapelitosEnTabla(
    representante
  ) {

    const filas =
      tablaRepresentantes.querySelectorAll(
        "tr"
      );


    const claveBuscada =
      crearClavePapelitos(
        representante.id,
        representante.fecha,
        representante.zona
      );


    for (
      const fila
      of filas
    ) {

      const celdas =
        fila.querySelectorAll(
          "td"
        );


      if (
        celdas.length < 8
      ) {

        continue;

      }


      const claveFila =
        crearClavePapelitos(
          celdas[0].textContent.trim(),
          celdas[3].textContent.trim(),
          celdas[4].textContent.trim()
        );


      if (
        claveFila ===
        claveBuscada
      ) {

        const registro =
          obtenerPapelitos(
            representante
          );


        celdas[5].textContent =
          registro &&
          registro.confirmado ===
            true
            ? "✅ Confirmados"
            : "⏳ Pendiente";

        break;

      }

    }

  }


  cambiarPapelitos.addEventListener(
    "click",
    async () => {

      const representante =
        obtenerRepresentanteSeleccionado();


      if (!representante) {

        return;

      }


      const registroActual =
        obtenerPapelitos(
          representante
        );


      const estaConfirmado =
        registroActual &&
        registroActual.confirmado ===
          true;


      const nuevoEstado =
        !estaConfirmado;


      cambiarPapelitos.disabled =
        true;

      cambiarPapelitos.textContent =
        nuevoEstado
          ? "Confirmando..."
          : "Actualizando...";


      try {

        const resultado =
          await peticionPapelitos({
            accion:
              "actualizar",

            id:
              representante.id,

            fecha:
              representante.fecha,

            zona:
              representante.zona,

            confirmado:
              nuevoEstado
          });


        const clave =
          crearClavePapelitos(
            representante.id,
            representante.fecha,
            representante.zona
          );


        registrosPapelitos =
          registrosPapelitos.filter(
            registro =>
              crearClavePapelitos(
                registro.id,
                registro.fecha,
                registro.zona
              ) !== clave
          );


        registrosPapelitos.push({
          id:
            representante.id,

          fecha:
            representante.fecha,

          zona:
            representante.zona,

          confirmado:
            resultado.confirmado ===
              true,

          confirmadoPor:
            resultado.confirmadoPor ||
            "",

          fechaConfirmacion:
            resultado.fechaConfirmacion ||
            ""
        });


        mostrarEstadoPapelitos(
          representante
        );


        actualizarPapelitosEnTabla(
          representante
        );


        mostrarToast(
          nuevoEstado
            ? "Papelitos confirmados"
            : "Papelitos marcados como pendientes"
        );

      }

      catch (error) {

        console.error(error);


        mostrarToast(
          error.message ||
          "No se pudo actualizar"
        );


        mostrarEstadoPapelitos(
          representante
        );

      }

    }
  );


  function limpiarSeleccion() {

    papelitosSeleccionado =
      null;

  }


  function obtenerSeleccionado() {

    return papelitosSeleccionado;

  }


  return {
    cargarPapelitos,
    obtenerPapelitos,
    mostrarEstadoPapelitos,
    actualizarPapelitosEnTabla,
    limpiarSeleccion,
    obtenerSeleccionado
  };

}
