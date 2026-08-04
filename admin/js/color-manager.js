const eventosDemo=[

{

id:"2026",

nombre:"Together Together Tour México 2026",

activo:true

},

{

id:"2028",

nombre:"Harry Styles México 2028",

activo:false

}

];

const lista=document.getElementById("listaEventos");

const activo=document.getElementById("eventoActivo");
const vistaEvento =
document.getElementById("vistaEvento");

const colorHome =
document.querySelector(".color-home");

const tituloEvento =
document.getElementById("tituloEvento");

const volverEventos =
document.getElementById("volverEventos");

function cargarEventos(){

const eventoActivo=eventosDemo.find(e=>e.activo);

activo.textContent=eventoActivo.nombre;

lista.innerHTML="";

eventosDemo.forEach(evento=>{

lista.innerHTML+=`

<div class="evento">

<div>

<strong>${evento.nombre}</strong>

<br>

<small>

${evento.activo?"🟢 Activo":"⚪ Inactivo"}

</small>

</div>

<button>

Abrir

</button>

</div>

`;

});

}

cargarEventos();
