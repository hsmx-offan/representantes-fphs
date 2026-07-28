// ========================================
// FICHA DEL REPRESENTANTE
// ========================================

export function formatearFechaConfirmacion(
  fecha
) {

  if (!fecha) {
    return "";
  }

  const objetoFecha =
    new Date(fecha);

  if (
    Number.isNaN(
      objetoFecha.getTime()
    )
  ) {
    return "";
  }

  return objetoFecha.toLocaleString(
    "es-MX",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  );

}


export function configurarFicha({

  fichaRepresentante,
  fichaNombre,
  fichaInstagram,
  fichaId,
  fichaFecha,
  fichaZona,
  fichaGafete,

  estadoPapelitos,
  detallePapelitos,
  cambiarPapelitos,
  cerrarFicha,
  irAGafete,

  consultarGafete,
  mostrarEstadoPapelitos,

  obtenerRepresentanteSeleccionado,
  establecerRepresentanteSeleccionado,
  establecerPapelitosSeleccionado

}) {

  cerrarFicha.addEventListener(
    "click",
    () => {

      fichaRepresentante.style.display =
        "none";

      establecerRepresentanteSeleccionado(
        null
      );

      establecerPapelitosSeleccionado(
        null
      );

    }
  );


  return async function abrirFicha(
    representante
  ) {

    establecerRepresentanteSeleccionado(
      representante
    );

    fichaNombre.textContent =
      representante.nombre ||
      "Sin nombre";

    fichaInstagram.textContent =
      representante.instagram
        ? "@" +
          representante.instagram.replace(
            /^@/,
            ""
          )
        : "Sin Instagram";

    fichaId.textContent =
      representante.id;

    fichaFecha.textContent =
      representante.fecha ||
      "—";

    fichaZona.textContent =
      representante.zona ||
      "—";

    fichaGafete.textContent =
      "Consultando...";

    estadoPapelitos.textContent =
      "Consultando...";

    detallePapelitos.textContent =
      "";

    cambiarPapelitos.textContent =
      "Consultando...";

    cambiarPapelitos.disabled =
      true;

    fichaRepresentante.style.display =
      "block";

    mostrarEstadoPapelitos(
      representante
    );

    try {

      const enviado =
        await consultarGafete(
          representante.id
        );

      fichaGafete.textContent =
        enviado
          ? "✅ Enviado"
          : "⏳ Pendiente";

    }

    catch {

      fichaGafete.textContent =
        "—";

    }

    irAGafete.href =
      `panel.html?id=${encodeURIComponent(
        representante.id
      )}`;

    fichaRepresentante.scrollIntoView({

      behavior: "smooth",

      block: "start"

    });

  };

}
