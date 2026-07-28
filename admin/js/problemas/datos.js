import {
  cargarRepresentantes
} from "../dashboard/sheet.js";

export async function obtenerRepresentantes() {

  return await cargarRepresentantes();

}
