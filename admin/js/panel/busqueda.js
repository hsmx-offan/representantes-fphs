import {
  cargarRepresentantes
} from "../dashboard/sheet.js";

import {
  generarQR
} from "./qr.js";


export function crearBuscadorRepresentante({
  idInput,
  estado,
  datosEncontrados,
  datoNombre,
  datoId,
  textoNombre,
  textoId,
  qrContainer,
  controlEstadoGafete
}) {

  function limpiarResultado() {

    datosEncontrados.style.display =
      "none";

    datoNombre.textContent =
      "";

    datoId.textContent =
      "";

    textoNombre.textContent =
      "";

    textoId.textContent =
      "";

    qrContainer.innerHTML =
      "";

    controlEstadoGafete
      .limpiarEstadoGafete();

  }


  async function buscarRepresentante() {

    const idBuscado =
      idInput.value
        .trim()
        .toUpperCase();


    if (!idBuscado) {

      estado.textContent =
        "Escribe un ID.";

      limpiarResultado();

      return;

    }


    estado.textContent =
      "Buscando representante...";

    limpiarResultado();


    try {

      const representantes =
        await cargarRepresentantes();


      const representante =
        representantes.find(
          item =>
            item.id
              .trim()
              .toUpperCase() === idBuscado
        );


      if (!representante) {

        estado.textContent =
          "No encontré ese ID.";

        return;

      }


      estado.textContent =
        "Representante encontrado.";


      datoNombre.textContent =
        representante.nombre;

      datoId.textContent =
        representante.id;

      datosEncontrados.style.display =
        "block";


      textoNombre.textContent =
        representante.nombre;

      textoId.textContent =
        representante.id;


      generarQR(
        qrContainer,
        representante.id
      );


      await controlEstadoGafete
        .consultarEstadoGafete(
          representante.id
        );

    }

    catch (error) {

      console.error(
        "Error buscando representante:",
        error
      );

      estado.textContent =
        "Hubo un error al leer la lista de representantes.";

      limpiarResultado();

    }

  }


  return {
    buscarRepresentante,
    limpiarResultado
  };

}
