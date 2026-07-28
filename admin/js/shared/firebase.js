// ========================================
// CONFIGURACIÓN COMPARTIDA DE FIREBASE
// ========================================

import {
  initializeApp,
  getApps,
  getApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


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


// Evita inicializar Firebase más de una vez.
export const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);


export const auth =
  getAuth(app);


export const db =
  getFirestore(app);
