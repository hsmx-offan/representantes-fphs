import {
  auth
} from "../shared/firebase.js";
const API_URL =
  "AQUI_VA_LA_MISMA_URL_DE_TU_APPS_SCRIPT";

async function peticion(datos) {

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

  const resultado =
    await respuesta.json();

  if (!resultado.ok) {

    throw new Error(
      resultado.error ||
      "Ocurrió un error."
    );

  }

  return resultado;

}

export async function listarMateriales() {

  return peticion({
    accion:
      "listar_materiales"
  });

}

export async function agregarMaterial(material) {

  return peticion({
    accion:
      "agregar_material",
    ...material
  });

}

export async function editarMaterial(material) {

  return peticion({
    accion:
      "editar_material",
    ...material
  });

}

export async function eliminarMaterial(fila) {

  return peticion({
    accion:
      "eliminar_material",
    fila
  });

}
