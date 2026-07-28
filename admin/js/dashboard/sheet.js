import {
  parsearCSV
} from "../shared/utils.js";


// ========================================
// GOOGLE SHEETS
// ========================================

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRsmA9mpebsNjPcTYMsklHNKShcPVEdU_xTkn-oHVjqil9SP1KrjPO8V1lEqxqnY-dna2IJY0BOUvg-/pub?gid=77234656&single=true&output=csv";


// ========================================
// CARGAR DATOS DEL SHEET
// ========================================

export async function cargarRepresentantes() {

  const respuesta =
    await fetch(
      `${SHEET_URL}&t=${Date.now()}`
    );

  if (!respuesta.ok) {

    throw new Error(
      "No se pudo leer Google Sheets."
    );

  }

  const csv =
    await respuesta.text();

  const filas =
    parsearCSV(csv);

  const representantes = [];

  for (
    const fila
    of filas
  ) {

    const id =
      String(fila[0] || "")
        .trim();

    if (
      !id
        .toUpperCase()
        .startsWith("FPHS-MX-")
    ) {

      continue;

    }

    representantes.push({

      id,

      fecha:
        String(fila[1] || "")
          .trim(),

      zona:
        String(fila[2] || "")
          .trim(),

      nombre:
        String(fila[3] || "")
          .trim(),

      instagram:
        String(fila[4] || "")
          .trim(),

      estado:
        String(fila[9] || "")
          .trim()

    });

  }

  return representantes;

}
