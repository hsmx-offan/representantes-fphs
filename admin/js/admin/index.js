// ========================================
// LOGIN DE ADMINISTRADORES
// ========================================

import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  auth
} from "../shared/firebase.js";


// ========================================
// ELEMENTOS
// ========================================

const loginForm =
  document.getElementById(
    "loginForm"
  );

const emailInput =
  document.getElementById(
    "email"
  );

const passwordInput =
  document.getElementById(
    "password"
  );

const errorMessage =
  document.getElementById(
    "errorMessage"
  );


// ========================================
// INICIAR SESIÓN
// ========================================

if (
  loginForm &&
  emailInput &&
  passwordInput &&
  errorMessage
) {

  loginForm.addEventListener(
    "submit",
    async event => {

      event.preventDefault();

      errorMessage.textContent =
        "";

      try {

        await signInWithEmailAndPassword(
          auth,
          emailInput.value.trim(),
          passwordInput.value
        );

        window.location.href =
          "dashboard.html";

      }

      catch (error) {

        console.error(
          "Error de inicio de sesión:",
          error
        );

        errorMessage.textContent =
          "Correo o contraseña incorrectos.";

      }

    }
  );

}


// ========================================
// COMPROBAR SESIÓN EXISTENTE
// ========================================

onAuthStateChanged(
  auth,
  user => {

    if (user) {

      window.location.href =
        "dashboard.html";

    }

  }
);


// ========================================
// CERRAR SESIÓN
// ========================================

window.logoutAdmin =
  async function () {

    try {

      await signOut(
        auth
      );

      window.location.href =
        "index.html";

    }

    catch (error) {

      console.error(
        "No se pudo cerrar la sesión:",
        error
      );

    }

  };
