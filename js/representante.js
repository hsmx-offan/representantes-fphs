const parametros = new URLSearchParams(window.location.search);

const id = parametros.get("id");

const resultado = document.getElementById("resultado");

resultado.innerHTML = `
    <p>ID buscado:</p>
    <h2>${id}</h2>
`;

function volver() {
    window.location.href = "index.html";
}
