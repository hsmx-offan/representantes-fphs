import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  db
} from "../shared/firebase.js";


// ========================================
// CARGAR PERFIL DEL ADMIN
// ========================================

export async function cargarPerfilAdmin(user) {

  try {

    const referencia =
      doc(
        db,
        "admins",
        user.uid
      );

    const documento =
      await getDoc(
        referencia
      );

    if (
      documento.exists()
    ) {

      return (
        documento.data().usuario ||
        "Admin"
      );

    }

    return "Admin";

  }

  catch (error) {

    console.error(
      "Error cargando perfil del admin:",
      error
    );

    return "Admin";

  }

}
