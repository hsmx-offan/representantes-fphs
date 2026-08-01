import {
  db
} from "../admin/js/shared/firebase.js";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const grid =
  document.getElementById(
    "gridRecuerdos"
  );


cargarRecuerdos();


async function cargarRecuerdos() {

  try {

    const consulta =
      query(

        collection(
          db,
          "recuerdos"
        ),

        where(
          "estado",
          "==",
          "aprobado"
        ),

        orderBy(
          "fechaCreacion",
          "desc"
        )

      );

    const snapshot =
      await getDocs(
        consulta
      );

    grid.innerHTML = "";

    snapshot.forEach(doc => {

      const recuerdo =
        doc.data();

      crearTarjeta(
        recuerdo
      );

    });

  }

  catch(error){

    console.error(error);

  }

}
