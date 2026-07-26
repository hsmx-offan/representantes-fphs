function buscarRepresentante() {
    const id = document.getElementById("buscar").value.trim();

    if (id === "") {
        alert("Ingresa el ID del representante.");
        return;
    }

    window.location.href = "representante.html?id=" + encodeURIComponent(id);
}
