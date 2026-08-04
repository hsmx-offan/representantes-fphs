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
  initializeFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ========================================
// CONFIGURACIÓN
// ========================================

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


// ========================================
// INICIALIZAR FIREBASE
// ========================================

export const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(
        firebaseConfig
      );


// ========================================
// AUTENTICACIÓN
// ========================================

export const auth =
  getAuth(
    app
  );


// ========================================
// FIRESTORE
// Compatibilidad con redes móviles
// ========================================

export const db =
  initializeFirestore(

    app,

    {

      experimentalAutoDetectLongPolling:
        true

    }

  );
