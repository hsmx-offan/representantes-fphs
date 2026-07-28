// ========================================
// CONTROLADOR DE PDF
// ========================================

export function crearPdfController({
  botonDescargar,
  logoPdf,

  busqueda,
  filtroFecha,
  filtroZona,

  obtenerResultadosActuales,
  obtenerPapelitos,
  mostrarToast
}) {

  // ========================================
  // ESPERAR A QUE CARGUE EL LOGO
  // ========================================

  function esperarImagen(imagen) {

    return new Promise(
      (resolve, reject) => {

        if (!imagen) {

          reject(
            new Error(
              "No se encontró el logo para el PDF."
            )
          );

          return;

        }


        if (
          imagen.complete &&
          imagen.naturalWidth > 0 &&
          imagen.naturalHeight > 0
        ) {

          resolve();
          return;

        }


        function limpiarEventos() {

          imagen.removeEventListener(
            "load",
            alCargar
          );

          imagen.removeEventListener(
            "error",
            alFallar
          );

        }


        function alCargar() {

          limpiarEventos();
          resolve();

        }


        function alFallar() {

          limpiarEventos();

          reject(
            new Error(
              "No se pudo cargar el logo."
            )
          );

        }


        imagen.addEventListener(
          "load",
          alCargar
        );


        imagen.addEventListener(
          "error",
          alFallar
        );

      }
    );

  }


  // ========================================
  // CONVERTIR LOGO
  // ========================================

 function convertirImagenADataURL(imagen) {

  if (
    !imagen ||
    imagen.naturalWidth <= 0 ||
    imagen.naturalHeight <= 0
  ) {

    throw new Error(
      "El logo no tiene dimensiones válidas."
    );

  }


  const lado =
    Math.min(
      imagen.naturalWidth,
      imagen.naturalHeight
    );


  const canvas =
    document.createElement(
      "canvas"
    );


  canvas.width = lado;
  canvas.height = lado;


  const contexto =
    canvas.getContext(
      "2d"
    );


  if (!contexto) {

    throw new Error(
      "No se pudo preparar el logo."
    );

  }


  const origenX =
    (
      imagen.naturalWidth -
      lado
    ) / 2;


  const origenY =
    (
      imagen.naturalHeight -
      lado
    ) / 2;


  contexto.clearRect(
    0,
    0,
    lado,
    lado
  );


  contexto.save();


  contexto.beginPath();


  contexto.arc(
    lado / 2,
    lado / 2,
    lado / 2,
    0,
    Math.PI * 2
  );


  contexto.closePath();


  contexto.clip();


  contexto.drawImage(
    imagen,
    origenX,
    origenY,
    lado,
    lado,
    0,
    0,
    lado,
    lado
  );


  contexto.restore();


  return canvas.toDataURL(
    "image/png",
    1
  );

}


  // ========================================
  // ESTADO DE PAPELITOS
  // ========================================

  function obtenerEstadoPapelitos(
    representante
  ) {

    const papelitos =
      obtenerPapelitos(
        representante
      );


    if (
      papelitos &&
      papelitos.confirmado === true
    ) {

      return "Confirmado";

    }


    if (
      papelitos &&
      papelitos.cancelado === true
    ) {

      return "Cancelado";

    }


    return "Pendiente";

  }


  // ========================================
  // DATOS DE LA TABLA
  // ========================================

  function crearFilasPDF(
    resultados
  ) {

    return resultados.map(
      representante => [

        representante.id || "",

        representante.nombre || "",

        representante.instagram
          ? `@${representante.instagram.replace(/^@/, "")}`
          : "",

        representante.fecha || "",

        representante.zona || "",

        obtenerEstadoPapelitos(
          representante
        )

      ]
    );

  }


  // ========================================
  // TEXTO DE FILTROS
  // ========================================

  function crearDetalleFiltros(
    cantidad
  ) {

    const detalles = [];


    if (
      filtroFecha?.value
    ) {

      detalles.push(
        `Fecha: ${filtroFecha.value}`
      );

    }


    if (
      filtroZona?.value
    ) {

      detalles.push(
        `Zona: ${filtroZona.value}`
      );

    }


    if (
      busqueda?.value.trim()
    ) {

      detalles.push(
        `Búsqueda: ${busqueda.value.trim()}`
      );

    }


    detalles.push(
      `Registros: ${cantidad}`
    );


    return detalles.join(
      "   ·   "
    );

  }


  // ========================================
  // NOMBRE DEL ARCHIVO
  // ========================================

  function limpiarNombreArchivo(
    texto
  ) {

    return String(texto || "")
      .trim()
      .replace(
        /[<>:"/\\|?*]+/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      );

  }


  function crearNombreArchivo() {

    const partes = [
      "Representantes"
    ];


    if (
      filtroFecha?.value
    ) {

      partes.push(
        limpiarNombreArchivo(
          filtroFecha.value
        )
      );

    }


    if (
      filtroZona?.value
    ) {

      partes.push(
        limpiarNombreArchivo(
          filtroZona.value
        )
      );

    }


    if (
      busqueda?.value.trim()
    ) {

      partes.push(
        limpiarNombreArchivo(
          busqueda.value
        )
      );

    }


    return `${partes.join("_")}.pdf`;

  }


  // ========================================
  // GENERAR PDF
  // ========================================

  async function generarPDF() {

    const resultados =
      obtenerResultadosActuales();


    if (
      resultados.length === 0
    ) {

      mostrarToast(
        "No hay resultados para descargar"
      );

      return;

    }


    if (
      !window.jspdf ||
      !window.jspdf.jsPDF
    ) {

      mostrarToast(
        "No se pudo cargar el generador de PDF"
      );

      return;

    }


    if (
      typeof window.jspdf.jsPDF !==
      "function"
    ) {

      mostrarToast(
        "El generador de PDF no está disponible"
      );

      return;

    }


    botonDescargar.disabled =
      true;

    botonDescargar.textContent =
      "Generando PDF...";


    try {

      const {
        jsPDF
      } = window.jspdf;


      const pdf =
        new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4"
        });


      if (
        typeof pdf.autoTable !==
        "function"
      ) {

        throw new Error(
          "No se pudo cargar la tabla del PDF."
        );

      }


      const anchoPagina =
        pdf.internal.pageSize
          .getWidth();


      await esperarImagen(
        logoPdf
      );


      const logoDataURL =
        convertirImagenADataURL(
          logoPdf
        );


      // ========================================
      // ENCABEZADO
      // ========================================

      pdf.setFillColor(
        231,
        43,
        145
      );


      pdf.rect(
        0,
        0,
        anchoPagina,
        36,
        "F"
      );


      pdf.addImage(
        logoDataURL,
        "PNG",
        11,
        4,
        28,
        28,
        undefined,
        "FAST"
      );


      pdf.setTextColor(
        255,
        249,
        252
      );


      pdf.setFont(
        "helvetica",
        "bold"
      );


      pdf.setFontSize(
        17
      );


      pdf.text(
        "HARRY STYLES MÉXICO OFFAN",
        45,
        15
      );


      pdf.setFont(
        "helvetica",
        "normal"
      );


      pdf.setFontSize(
        10
      );


      pdf.text(
        "LISTA DE REPRESENTANTES · FAN PROJECT 2026",
        45,
        23
      );


      // ========================================
      // TÍTULO Y FILTROS
      // ========================================

      pdf.setTextColor(
        23,
        19,
        27
      );


      pdf.setFont(
        "helvetica",
        "bold"
      );


      pdf.setFontSize(
        12
      );


      pdf.text(
        "Lista de representantes",
        14,
        47
      );


      pdf.setFont(
        "helvetica",
        "normal"
      );


      pdf.setFontSize(
        9
      );


      pdf.text(
        crearDetalleFiltros(
          resultados.length
        ),
        14,
        54
      );


      // ========================================
      // TABLA
      // ========================================

      pdf.autoTable({

        startY: 61,

        head: [[
          "ID",
          "REPRESENTANTE",
          "INSTAGRAM",
          "FECHA",
          "ZONA",
          "PAPELITOS"
        ]],

        body:
          crearFilasPDF(
            resultados
          ),

        theme:
          "grid",

        margin: {
          left: 14,
          right: 14,
          bottom: 16
        },

        styles: {
          font: "helvetica",
          fontSize: 8,
          cellPadding: 2.5,
          textColor: [23, 19, 27],
          lineColor: [214, 203, 210],
          lineWidth: 0.2,
          overflow: "linebreak",
          valign: "middle"
        },

        headStyles: {
          fillColor: [231, 43, 145],
          textColor: [255, 249, 252],
          fontStyle: "bold",
          halign: "left",
          valign: "middle"
        },

        alternateRowStyles: {
          fillColor: [255, 249, 252]
        },

        columnStyles: {

          0: {
            cellWidth: 28
          },

          1: {
            cellWidth: 55
          },

          2: {
            cellWidth: 48
          },

          3: {
            cellWidth: 30
          },

          4: {
            cellWidth: 48
          },

          5: {
            cellWidth: 30
          }

        },

        didDrawPage: () => {

          const altoPagina =
            pdf.internal.pageSize
              .getHeight();


          const paginaActual =
            pdf.internal
              .getCurrentPageInfo()
              .pageNumber;


          pdf.setDrawColor(
            231,
            43,
            145
          );


          pdf.setLineWidth(
            0.2
          );


          pdf.line(
            14,
            altoPagina - 12,
            anchoPagina - 14,
            altoPagina - 12
          );


          pdf.setFont(
            "helvetica",
            "normal"
          );


          pdf.setFontSize(
            7
          );


          pdf.setTextColor(
            111,
            101,
            112
          );


          pdf.text(
            "Documento generado desde el Panel Administrativo · HSMX OFFAN",
            14,
            altoPagina - 7
          );


          pdf.text(
            `Página ${paginaActual}`,
            anchoPagina - 14,
            altoPagina - 7,
            {
              align: "right"
            }
          );

        }

      });


      pdf.save(
        crearNombreArchivo()
      );


      mostrarToast(
        resultados.length === 1
          ? "PDF generado con 1 registro"
          : `PDF generado con ${resultados.length} registros`
      );

    }

    catch (error) {

      console.error(
        "Error generando PDF:",
        error
      );


      mostrarToast(
        error?.message ||
        "No se pudo generar el PDF"
      );

    }

    finally {

      botonDescargar.disabled =
        false;

      botonDescargar.textContent =
        "📄 Descargar PDF";

    }

  }


  // ========================================
  // CONECTAR BOTÓN
  // ========================================

  function iniciarPDF() {

  if (!botonDescargar) {

    console.error(
      'No se encontró el botón con id="descargarLista".'
    );

    return;

  }

  botonDescargar.disabled = false;
  botonDescargar.removeAttribute("disabled");
  botonDescargar.style.pointerEvents = "auto";

  botonDescargar.addEventListener(
    "click",
    generarPDF
  );

}


  return {
    generarPDF,
    iniciarPDF,
    crearNombreArchivo
  };

}
