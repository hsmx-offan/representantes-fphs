export function inicializarDescarga({
  descargarButton,
  gafeteBase,
  qrContainer,
  datoNombre,
  datoId,
  estado
}) {

  descargarButton.addEventListener(
    "click",
    async () => {

      const nombre =
        datoNombre.textContent.trim();

      const id =
        datoId.textContent.trim();

      if (!id) {

        estado.textContent =
          "Primero busca un representante.";

        return;

      }

      const canvas =
        document.createElement("canvas");

      canvas.width =
        gafeteBase.naturalWidth;

      canvas.height =
        gafeteBase.naturalHeight;

      const ctx =
        canvas.getContext("2d");


      // ==========================
      // IMAGEN BASE
      // ==========================

      ctx.drawImage(
        gafeteBase,
        0,
        0,
        canvas.width,
        canvas.height
      );


      // ==========================
      // TEXTO
      // ==========================

      ctx.fillStyle =
        "#ffffff";

      ctx.font =
        `600 ${canvas.width * 0.050}px Arial`;

      ctx.textBaseline =
        "top";


      // Nombre

      ctx.fillText(
        nombre,
        canvas.width * 0.35,
        canvas.height * 0.528
      );


      // ID

      ctx.fillText(
        id,
        canvas.width * 0.35,
        canvas.height * 0.617
      );


      // ==========================
      // QR
      // ==========================

      const qrCanvas =
        qrContainer.querySelector("canvas");

      const qrImagen =
        qrContainer.querySelector("img");

      const qrX =
        canvas.width * 0.39;

      const qrY =
        canvas.height * 0.665;

      const qrSize =
        canvas.width * 0.22;


      if (qrCanvas) {

        ctx.drawImage(
          qrCanvas,
          qrX,
          qrY,
          qrSize,
          qrSize
        );

      }

      else if (qrImagen) {

        await new Promise(resolve => {

          if (qrImagen.complete) {

            resolve();

          }

          else {

            qrImagen.onload =
              resolve;

          }

        });

        ctx.drawImage(
          qrImagen,
          qrX,
          qrY,
          qrSize,
          qrSize
        );

      }


      // ==========================
      // DESCARGAR
      // ==========================

      const enlace =
        document.createElement("a");

      enlace.download =
        `Gafete-${id}.png`;

      enlace.href =
        canvas.toDataURL("image/png");

      enlace.click();

    }
  );

}
