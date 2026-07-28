import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  db
} from "../shared/firebase.js";

import {
  normalizarTexto
} from "../shared/utils.js";


// ========================================
// REPRESENTANTES
// ========================================

export function obtenerTotalRepresentantes(
  representantes
) {

  const ids = new Set();

  for (
    const representante
    of representantes
  ) {

    ids.add(
      representante.id
        .trim()
        .toUpperCase()
    );

  }

  return ids.size;

}


// ========================================
// PAPELITOS
// ========================================

export function obtenerPapelitosConfirmados(
  representantes
) {

  let total = 0;

  for (
    const representante
    of representantes
  ) {

    if (
      normalizarTexto(
        representante.estado
      ) === "confirmado"
    ) {

      total++;

    }

  }

  return total;

}


// ========================================
// GAFETES
// ========================================

export async function obtenerGafetesEnviados() {

  const referencia =
    collection(
      db,
      "gafetes"
    );

  const consulta =
    query(
      referencia,
      where(
        "enviado",
        "==",
        true
      )
    );

  const resultado =
    await getDocs(
      consulta
    );

  return resultado.size;

}


// ========================================
// PROBLEMAS
// ========================================

export function obtenerTotalProblemas(
  representantes
) {

  let total = 0;


  // -----------------------------
  // Datos faltantes
  // -----------------------------

  for (
    const representante
    of representantes
  ) {

    if (!representante.zona)
      total++;

    if (!representante.fecha)
      total++;

    if (!representante.instagram)
      total++;

    if (!representante.nombre)
      total++;

  }


  // -----------------------------
  // IDs repetidos
  // -----------------------------

  const gruposId =
    new Map();

  for (
    const representante
    of representantes
  ) {

    const id =
      normalizarTexto(
        representante.id
      );

    if (
      !gruposId.has(id)
    ) {

      gruposId.set(
        id,
        []
      );

    }

    gruposId
      .get(id)
      .push(
        representante
      );

  }

  for (
    const registros
    of gruposId.values()
  ) {

    if (
      registros.length < 2
    ) {

      continue;

    }

    const nombres =
      new Set(
        registros
          .map(
            r =>
              normalizarTexto(
                r.nombre
              )
          )
          .filter(Boolean)
      );

    const instagrams =
      new Set(
        registros
          .map(
            r =>
              normalizarTexto(
                r.instagram.replace(
                  /^@/,
                  ""
                )
              )
          )
          .filter(Boolean)
      );

    if (
      nombres.size > 1 ||
      instagrams.size > 1
    ) {

      total++;

    }

  }


  // -----------------------------
  // Instagram repetido
  // -----------------------------

  const gruposInstagram =
    new Map();

  for (
    const representante
    of representantes
  ) {

    const instagram =
      normalizarTexto(
        representante.instagram.replace(
          /^@/,
          ""
        )
      );

    if (!instagram)
      continue;

    if (
      !gruposInstagram.has(
        instagram
      )
    ) {

      gruposInstagram.set(
        instagram,
        []
      );

    }

    gruposInstagram
      .get(instagram)
      .push(
        representante
      );

  }

  for (
    const registros
    of gruposInstagram.values()
  ) {

    const ids =
      new Set(
        registros.map(
          r =>
            normalizarTexto(
              r.id
            )
        )
      );

    if (
      ids.size > 1
    ) {

      total++;

    }

  }

  return total;

}
