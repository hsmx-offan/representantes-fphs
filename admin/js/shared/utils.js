// ========================================
// PARSEAR CSV
// ========================================

export function parsearCSV(texto) {

  const filas = [];

  let fila = [];
  let campo = "";
  let dentroComillas = false;

  for (let i = 0; i < texto.length; i++) {

    const caracter = texto[i];
    const siguiente = texto[i + 1];

    if (
      caracter === '"' &&
      dentroComillas &&
      siguiente === '"'
    ) {

      campo += '"';
      i++;

    }

    else if (caracter === '"') {

      dentroComillas = !dentroComillas;

    }

    else if (
      caracter === "," &&
      !dentroComillas
    ) {

      fila.push(campo);
      campo = "";

    }

    else if (
      (
        caracter === "\n" ||
        caracter === "\r"
      ) &&
      !dentroComillas
    ) {

      if (
        caracter === "\r" &&
        siguiente === "\n"
      ) {
        i++;
      }

      fila.push(campo);

      if (
        fila.some(
          valor => valor.trim() !== ""
        )
      ) {
        filas.push(fila);
      }

      fila = [];
      campo = "";

    }

    else {

      campo += caracter;

    }

  }

  if (
    campo.length > 0 ||
    fila.length > 0
  ) {

    fila.push(campo);

    if (
      fila.some(
        valor => valor.trim() !== ""
      )
    ) {

      filas.push(fila);

    }

  }

  return filas;

}


// ========================================
// UTILIDADES
// ========================================

export function normalizarTexto(texto) {

  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

}


export function crearClavePapelitos(
  id,
  fecha,
  zona
) {

  return [
    normalizarTexto(id),
    normalizarTexto(fecha),
    normalizarTexto(zona)
  ].join("|");

}


export function escaparHTML(texto) {

  return String(texto || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
