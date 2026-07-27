
    import {
      initializeApp
    } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

    import {
      getAuth,
      onAuthStateChanged,
      signOut
    } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


    const firebaseConfig = {

      apiKey:
        "AIzaSyAesU9F4Oc7Lr8TPOFUk-Oi-lT086XjRKw",

      authDomain:
        "hsmx-representantes.firebaseapp.com",

      projectId:
        "hsmx-representantes",

      storageBucket:
        "hsmx-representantes.firebasestorage.app",

      messagingSenderId:
        "821385801252",

      appId:
        "1:821385801252:web:c95ba9ffdeb90fe03732b1"

    };


    const app =
      initializeApp(firebaseConfig);

    const auth =
      getAuth(app);


    const cargando =
      document.getElementById("cargando");

    const contenido =
      document.getElementById("contenido");

    const logoutButton =
      document.getElementById("logoutButton");


    onAuthStateChanged(auth, (user) => {

      if (user) {

        cargando.style.display = "none";

        contenido.style.display = "block";

      } else {

        window.location.href = "./";

      }

    });


    logoutButton.addEventListener(
      "click",
      async () => {

        await signOut(auth);

        window.location.href = "./";

      }
    );
const nombreInput = document.getElementById("nombre");
const zonaInput = document.getElementById("zona");
const idInput = document.getElementById("idRepresentante");

const textoNombre = document.getElementById("textoNombre");
const textoZona = document.getElementById("textoZona");
const textoId = document.getElementById("textoId");

const generarGafete = document.getElementById("generarGafete");

generarGafete.addEventListener("click", () => {

  textoNombre.textContent = nombreInput.value;
  textoZona.textContent = zonaInput.value;
  textoId.textContent = idInput.value;

});
