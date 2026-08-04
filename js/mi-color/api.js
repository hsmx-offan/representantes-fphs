/* ========================================
   MI COLOR
   API
   ======================================== */

import {

    collection,

    doc,

    getDoc,

    getDocs,

    query,

    where,

    orderBy,

    limit

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
  db
} from "../../admin/js/shared/firebase.js";


/* ========================================
   EVENTO ACTIVO
   ======================================== */

export async function obtenerEventoActivo() {

    const consulta = query(

        collection(
            db,
            "eventos"
        ),

        where(
            "activo",
            "==",
            true
        ),

        limit(1)

    );

    const snapshot =
        await getDocs(
            consulta
        );

    if (
        snapshot.empty
    ) {

        throw new Error(
            "No existe un evento activo."
        );

    }

    return {

        id:
            snapshot.docs[0].id,

        ...snapshot.docs[0].data()

    };

}


/* ========================================
   FECHAS
   ======================================== */

export async function listarFechas(
    eventoId
) {

    const consulta = query(

        collection(

            db,

            "eventos",

            eventoId,

            "fechas"

        ),

        orderBy(
            "fecha"
        )

    );

    const snapshot =
        await getDocs(
            consulta
        );

    return snapshot.docs.map(

        doc => ({

            id:
                doc.id,

            ...doc.data()

        })

    );

}


/* ========================================
   ZONAS
   ======================================== */

export async function listarZonas(
    eventoId
) {

    const consulta = query(

        collection(

            db,

            "eventos",

            eventoId,

            "zonas"

        ),

        orderBy(
            "orden"
        )

    );

    const snapshot =
        await getDocs(
            consulta
        );

    return snapshot.docs.map(

        doc => ({

            id:
                doc.id,

            ...doc.data()

        })

    );

}


/* ========================================
   FAN PROJECTS
   ======================================== */

export async function listarFanProjects(
    eventoId
) {

    const consulta = query(

        collection(

            db,

            "eventos",

            eventoId,

            "fanProjects"

        ),

        orderBy(
            "orden"
        )

    );

    const snapshot =
        await getDocs(
            consulta
        );

    return snapshot.docs.map(

        doc => ({

            id:
                doc.id,

            ...doc.data()

        })

    );

}


/* ========================================
   COLOR
   ======================================== */

export async function obtenerColor({

    eventoId,

    fanProjectId,

    zonaId

}) {

    const referencia = doc(

        db,

        "eventos",

        eventoId,

        "fanProjects",

        fanProjectId,

        "colores",

        zonaId

    );

    const snapshot =
        await getDoc(
            referencia
        );

    if (
        !snapshot.exists()
    ) {

        return null;

    }

    return {

        id:
            snapshot.id,

        ...snapshot.data()

    };

}
