/* ========================================
   CATÁLOGO OFICIAL DE COLORES
   Tonos centrales de las guías
   ======================================== */

export const COLORES = [

  {
    id: "blanco-gris-claro",
    nombre: "Blanco o gris claro",
    hex: "#A6AAB6"
  },

  {
    id: "azul",
    nombre: "Azul",
    hex: "#3F7FE8"
  },

  {
    id: "morado",
    nombre: "Morado",
    hex: "#7835E8"
  },

  {
    id: "vino",
    nombre: "Vino",
    hex: "#87213F"
  },

  {
    id: "azul-oscuro",
    nombre: "Azul oscuro",
    hex: "#1C2F66"
  },

  {
    id: "rosa",
    nombre: "Rosa",
    hex: "#DA2378"
  },

  {
    id: "rosa-claro",
    nombre: "Rosa claro",
    hex: "#F1CAE2"
  },

  {
    id: "rojo",
    nombre: "Rojo",
    hex: "#F52323"
  }

];


export function obtenerColorPorId(
  colorId
) {

  return COLORES.find(
    color =>
      color.id === colorId
  ) || null;

}
