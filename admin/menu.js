// ========================================
// MENÚ GENERAL DEL PANEL ADMIN
// ========================================

const paginaActual =
  window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();


const opcionesMenu = [

  {
    nombre: "Inicio",
    archivo: "dashboard.html",
    disponible: true
  },

  {
    nombre: "Representantes",
    archivo: "representantes.html",
    disponible: true
  },

  {
    nombre: "Gafetes",
    archivo: "panel.html",
    disponible: true
  },

  {
    nombre: "Problemas",
    archivo: "problemas.html",
    disponible: true
  },

  {
    nombre: "Publicaciones",
    archivo: "publicaciones.html",
    disponible: false
  },

  {
    nombre: "Material",
    archivo: "material.html",
    disponible: false
  },

  {
    nombre: "Comunicados",
    archivo: "comunicados.html",
    disponible: false
  }

];


function crearMenuAdmin() {

  const contenedor =
    document.getElementById(
      "menuAdmin"
    );


  if (!contenedor) {

    return;

  }


  const nav =
    document.createElement("nav");

  nav.className =
    "menu";


  for (
    const opcion
    of opcionesMenu
  ) {

    const enlace =
      document.createElement("a");


    enlace.textContent =
      opcion.nombre;


    enlace.className =
      "menu-item";


    // Página en la que estamos

    if (
      paginaActual ===
      opcion.archivo.toLowerCase()
    ) {

      enlace.classList.add(
        "activo"
      );

    }


    // Apartados todavía no disponibles

    if (
      !opcion.disponible
    ) {

      enlace.href =
        "#";

      enlace.classList.add(
        "deshabilitado"
      );

    }

    else {

      enlace.href =
        opcion.archivo;

    }


    nav.appendChild(
      enlace
    );

  }


  contenedor.appendChild(
    nav
  );

}


crearMenuAdmin();
