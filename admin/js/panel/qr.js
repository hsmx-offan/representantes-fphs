const REPRESENTANTE_URL =
  "https://hsmx-offan.github.io/representantes-fphs/representante.html?id=";

export function generarQR(
  qrContainer,
  idRepresentante
) {

  const urlRepresentante =
    REPRESENTANTE_URL +
    encodeURIComponent(
      idRepresentante
    );

  qrContainer.innerHTML =
    "";

  new QRCode(
    qrContainer,
    {
      text:
        urlRepresentante,

      width:
        260,

      height:
        260,

      colorDark:
        "#ffffff",

      colorLight:
        "#000000",

      correctLevel:
        QRCode.CorrectLevel.H
    }
  );

}
