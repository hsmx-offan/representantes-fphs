import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// PEGA AQUÍ TU firebaseConfig DE FIREBASE
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  errorMessage.textContent = "";

  try {
    await signInWithEmailAndPassword(
      auth,
      emailInput.value.trim(),
      passwordInput.value
    );

    window.location.href = "panel.html";
  } catch (error) {
    console.error(error);
    errorMessage.textContent = "Correo o contraseña incorrectos.";
  }
});

onAuthStateChanged(auth, (user) => {
  if (user && window.location.pathname.endsWith("/admin/")) {
    window.location.href = "panel.html";
  }
});

window.logoutAdmin = async function () {
  await signOut(auth);
  window.location.href = "./";
};
