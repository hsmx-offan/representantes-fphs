import {
  normalizarTexto
} from "../shared/utils.js";


// ========================================
// DETECTAR PROBLEMAS
// ========================================

export function detectarProblemas(
  representantes
) {

  const problemas = [];

  detectarDatosFaltantes(
    representantes,
    problemas
  );

  detectarIdsDuplicados(
    representantes,
    problemas
  );

  detectarInstagramDuplicado(
    representantes,
    problemas
  );

  return problemas;

}


// ========================================
// DATOS FALTANTES
// ========================================

function detectarDatosFaltantes(
  representantes,
  problemas
) {

  for (
    const representante
    of representantes
  ) {

    if (!representante.zona) {

      problemas.push({

        tipo:
          "sin-zona",

        titulo:
          "Falta zona",

        descripcion:
          `${representante.id} no tiene una zona asignada.`,

        representante

      });

    }


    if (!representante.fecha) {

      problemas.push({

        tipo:
          "sin-fecha",

        titulo:
          "Falta fecha",

        descripcion:
          `${representante.id} no tiene una fecha asignada.`,

        representante

      });

    }


    if (!representante.instagram) {

      problemas.push({

        tipo:
          "sin-instagram",

        titulo:
          "Falta Instagram",

        descripcion:
          `${representante.id} no tiene usuario de Instagram registrado.`,

        representante

      });

    }


    if (!representante.nombre) {

      problemas.push({

        tipo:
          "sin-nombre",

        titulo:
          "Falta nombre",

        descripcion:
          `${representante.id} no tiene nombre registrado.`,

        representante

      });

    }

  }

}


// ========================================
// IDS DUPLICADOS
// ========================================

function detectarIdsDuplicados(
  representantes,
  problemas
) {

  const grupos =
    new Map();


  for (
    const representante
    of representantes
  ) {

    const id =
      normalizarTexto(
        representante.id
      );


    if (!grupos.has(id)) {

      grupos.set(
        id,
        []
      );

    }


    grupos
      .get(id)
      .push(
        representante
      );

  }


  for (
    const registros
    of grupos.values()
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
            registro =>
              normalizarTexto(
                registro.nombre
              )
          )
          .filter(Boolean)
      );


    const instagrams =
      new Set(
        registros
          .map(
            registro =>
              normalizarInstagram(
                registro.instagram
              )
          )
          .filter(Boolean)
      );


    /*
      Un mismo ID puede repetirse si la misma
      persona aparece en varias fechas.

      Solo se marca como problema cuando el ID
      está relacionado con nombres o cuentas
      de Instagram diferentes.
    */

    if (
      nombres.size <= 1 &&
      instagrams.size <= 1
    ) {

      continue;

    }


    const representante =
      registros[0];


    problemas.push({

      tipo:
        "id-duplicado",

      titulo:
        "ID asociado a datos distintos",

      descripcion:
        `${representante.id} aparece en registros que no parecen pertenecer a la misma persona.`,

      meta:
        `${registros.length} registros encontrados`,

      representante

    });

  }

}


// ========================================
// INSTAGRAM CON IDS DISTINTOS
// ========================================

function detectarInstagramDuplicado(
  representantes,
  problemas
) {

  const grupos =
    new Map();


  for (
    const representante
    of representantes
  ) {

    const instagram =
      normalizarInstagram(
        representante.instagram
      );


    if (!instagram) {

      continue;

    }


    if (!grupos.has(instagram)) {

      grupos.set(
        instagram,
        []
      );

    }


    grupos
      .get(instagram)
      .push(
        representante
      );

  }


  for (
    const [
      instagram,
      registros
    ]
    of grupos.entries()
  ) {

    const ids =
      new Set(
        registros.map(
          registro =>
            normalizarTexto(
              registro.id
            )
        )
      );


    if (
      ids.size <= 1
    ) {

      continue;

    }


    problemas.push({

      tipo:
        "instagram-duplicado",

      titulo:
        "Instagram con IDs distintos",

      descripcion:
        `@${instagram} aparece asociado a más de un ID.`,

      meta:
        `${ids.size} IDs diferentes`,

      representante:
        registros[0]

    });

  }

}


// ========================================
// NORMALIZAR INSTAGRAM
// ========================================

function normalizarInstagram(
  instagram
) {

  return normalizarTexto(
    String(instagram || "")
      .replace(
        /^@/,
        ""
      )
  );

}
