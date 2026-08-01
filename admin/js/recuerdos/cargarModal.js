export async function cargarModalRecuerdo() {

    const contenedor =
        document.getElementById(
            "contenedorModalRecuerdo"
        );

    if (!contenedor) {
        return;
    }

    try {

        const respuesta =
            await fetch(
                "html/modal-recuerdo.html"
            );

        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar el modal."
            );

        }

        const html =
            await respuesta.text();

        contenedor.innerHTML =
            html;

    } catch (error) {

        console.error(
            "Error cargando modal:",
            error
        );

    }

}
