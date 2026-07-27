import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAesU9F4Oc7Lr8TPOFUk-Oi-lT086XjRKw",
    authDomain: "hsmx-representantes.firebaseapp.com",
    projectId: "hsmx-representantes",
    storageBucket: "hsmx-representantes.firebasestorage.app",
    messagingSenderId: "821385801252",
    appId: "1:821385801252:web:c95ba9ffdeb90fe03732b1"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>

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
