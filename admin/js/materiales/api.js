import {
  auth
} from "../shared/firebase.js";


// ========================================
// URL DEL APPS SCRIPT
// ========================================

const API_URL =
  "PEGA_AQUÍ_TU_MISMA_URL_DEL_APPS_SCRIPT";


// ========================================
// PETICIÓN GENERAL
// ========================================

async function peticionMateriales(
  datos
) {

  const usuario =
    auth.currentUser;


  if (!usuario) {

    throw new Error(
      "No hay una sesión activa."
    );

  }


  const idToken =
    await usuario.getIdToken();


  const respuesta =
    await fetch(
      API_URL,
      {
        method: "POST",

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
      "Ocurrió un error inesperado."
    );

  }


  return resultado;

}


// ========================================
// LISTAR MATERIALES
// ========================================

export async function listarMateriales() {

  const resultado =
    await peticionMateriales({
      accion:
        "listar_materiales"
    });


  return (
    resultado.materiales ||
    []
  );

}


// ========================================
// AGREGAR MATERIAL
// ========================================

export async function agregarMaterial(
  material
) {

  const resultado =
    await peticionMateriales({

      accion:
        "agregar_material",

      nombre:
        material.nombre,

      categoria:
        material.categoria,

      tipo:
        material.tipo,

      descripcion:
        material.descripcion,

      url:
        material.url,

      vistaPrevia:
        material.vistaPrevia

    });


  return resultado.material;

}


// ========================================
// EDITAR MATERIAL
// ========================================

export async function editarMaterial(
  material
) {

  const resultado =
    await peticionMateriales({

      accion:
        "editar_material",

      id:
        material.id,

      nombre:
        material.nombre,

      categoria:
        material.categoria,

      tipo:
        material.tipo,

      descripcion:
        material.descripcion,

      url:
        material.url,

      vistaPrevia:
        material.vistaPrevia

    });


  return resultado.material;

}


// ========================================
// ELIMINAR MATERIAL
// ========================================

export async function eliminarMaterial(
  id
) {

  const resultado =
    await peticionMateriales({

      accion:
        "eliminar_material",

      id:
        id

    });


  return resultado;

}
