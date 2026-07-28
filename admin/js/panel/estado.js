import {
  db
} from "../shared/firebase.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


export function crearControlEstadoGafete({
  estadoGafete,
  textoEstadoGafete,
  detalleEstadoGafete,
  cambiarEstadoGafete
}) {

  let idRepresentanteActual = "";
  let gafeteEstaEnviado = false;
  let nombreAdminActual = "Admin";


  function establecerNombreAdmin(nombre) {

    nombreAdminActual =
      nombre || "Admin";

  }


  function limpiarEstadoGafete() {

    idRepresentanteActual = "";
    gafeteEstaEnviado = false;

    estadoGafete.style.display =
      "none";

    textoEstadoGafete.textContent =
      "";

    detalleEstadoGafete.textContent =
      "";

    cambiarEstadoGafete.textContent =
      "Marcar como enviado";

    cambiarEstadoGafete.disabled =
      false;

  }


  function mostrarEstadoGafete(datos) {

    estadoGafete.style.display =
      "block";

    gafeteEstaEnviado =
      datos?.enviado === true;


    if (gafeteEstaEnviado) {

      textoEstadoGafete.textContent =
        "✅ Enviado";

      cambiarEstadoGafete.textContent =
        "Marcar como pendiente";


      let detalle = "";


      if (
        datos.fechaEnvio &&
        typeof datos.fechaEnvio.toDate === "function"
      ) {

        const fecha =
          datos.fechaEnvio.toDate();

        detalle =
          fecha.toLocaleString(
            "es-MX",
            {
              dateStyle: "medium",
              timeStyle: "short"
            }
          );

      }


      if (datos.admin) {

        if (detalle) {
          detalle += " · ";
        }

        detalle +=
          `Marcado por ${datos.admin}`;

      }


      detalleEstadoGafete.textContent =
        detalle;

    }

    else {

      textoEstadoGafete.textContent =
        "⏳ Pendiente de envío";

      detalleEstadoGafete.textContent =
        "";

      cambiarEstadoGafete.textContent =
        "Marcar como enviado";

    }

  }


  async function consultarEstadoGafete(
    idRepresentante
  ) {

    idRepresentanteActual =
      idRepresentante;

    estadoGafete.style.display =
      "block";

    textoEstadoGafete.textContent =
      "Consultando...";

    detalleEstadoGafete.textContent =
      "";

    cambiarEstadoGafete.disabled =
      true;


    try {

      const referencia =
        doc(
          db,
          "gafetes",
          idRepresentante
        );

      const documento =
        await getDoc(referencia);


      if (!documento.exists()) {

        mostrarEstadoGafete({
          enviado: false
        });

        return;

      }


      mostrarEstadoGafete(
        documento.data()
      );

    }

    catch (error) {

      console.error(
        "Error consultando estado del gafete:",
        error
      );

      textoEstadoGafete.textContent =
        "No se pudo consultar el estado.";

      detalleEstadoGafete.textContent =
        "";

    }

    finally {

      cambiarEstadoGafete.disabled =
        false;

    }

  }


  async function cambiarEstado() {

    if (!idRepresentanteActual) {
      return;
    }


    cambiarEstadoGafete.disabled =
      true;


    try {

      const referencia =
        doc(
          db,
          "gafetes",
          idRepresentanteActual
        );


      if (!gafeteEstaEnviado) {

        await setDoc(
          referencia,
          {
            enviado: true,
            fechaEnvio: serverTimestamp(),
            admin: nombreAdminActual
          },
          {
            merge: true
          }
        );

      }

      else {

        await setDoc(
          referencia,
          {
            enviado: false,
            fechaEnvio: null,
            admin: ""
          },
          {
            merge: true
          }
        );

      }


      await consultarEstadoGafete(
        idRepresentanteActual
      );

    }

    catch (error) {

      console.error(
        "Error cambiando estado del gafete:",
        error
      );

      textoEstadoGafete.textContent =
        "No se pudo guardar el cambio.";

    }

    finally {

      cambiarEstadoGafete.disabled =
        false;

    }

  }


  cambiarEstadoGafete.addEventListener(
    "click",
    cambiarEstado
  );


  return {
    limpiarEstadoGafete,
    consultarEstadoGafete,
    establecerNombreAdmin
  };

}
