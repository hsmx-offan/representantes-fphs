import {
  auth
} from "../shared/firebase.js";


// ========================================
// CONFIGURACIÓN
// ========================================

const API_URL =
  "PEGA_AQUI_LA_URL_DEL_APPS_SCRIPT";


// ========================================
// PETICIÓN GENERAL
// ========================================

async function peticionMateriales(
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
      API_URL,
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
      "No se pudo conectar con el servidor."
    );

  }


  const resultado =
    await respuesta.json();


  if (!resultado.ok) {

    throw new Error(
      resultado.error ||
      "Ocurrió un error con los materiales."
    );

  }


  return resultado;

}


// ========================================
// LISTAR
// ========================================

export async function listarMateriales() {

  const resultado =
    await peticionMateriales({
      accion:
        "listar_materiales"
    });


  return Array.isArray(
    resultado.materiales
  )
    ? resultado.materiales
    : [];

}


// ========================================
// AGREGAR
// ========================================

export async function agregarMaterial(
  material
) {

  const resultado =
    await peticionMateriales({
      accion:
        "agregar_material",

      ...material
    });


  return resultado.material;

}


// ========================================
// EDITAR
// ========================================

export async function editarMaterial(
  material
) {

  const resultado =
    await peticionMateriales({
      accion:
        "editar_material",

      ...material
    });


  return resultado.material;

}


// ========================================
// ELIMINAR
// ========================================

export async function eliminarMaterial(
  fila
) {

  await peticionMateriales({
    accion:
      "eliminar_material",

    fila:
      fila
  });

}
