/* ========================================
   OFFLINE MANAGER
   HSMX OFFAN
======================================== */

const DB_NAME = "mi-color-db";

const DB_VERSION = 1;

const STORE = "configuracion";


function abrirBD() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(
                DB_NAME,
                DB_VERSION
            );

        request.onupgradeneeded = () => {

            const db =
                request.result;

            if (
                !db.objectStoreNames.contains(
                    STORE
                )
            ) {

                db.createObjectStore(
                    STORE
                );

            }

        };

        request.onsuccess = () => {

            resolve(
                request.result
            );

        };

        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}


/* ========================================
   GUARDAR
======================================== */

export async function guardarDato(

    clave,

    valor

) {

    const db =
        await abrirBD();

    return new Promise((resolve, reject) => {

        const tx =
            db.transaction(
                STORE,
                "readwrite"
            );

        tx.objectStore(STORE)
            .put(
                valor,
                clave
            );

        tx.oncomplete =
            () => resolve();

        tx.onerror =
            () => reject(
                tx.error
            );

    });

}


/* ========================================
   LEER
======================================== */

export async function leerDato(

    clave

) {

    const db =
        await abrirBD();

    return new Promise((resolve, reject) => {

        const tx =
            db.transaction(
                STORE,
                "readonly"
            );

        const request =
            tx.objectStore(STORE)
                .get(clave);

        request.onsuccess =
            () => resolve(
                request.result
            );

        request.onerror =
            () => reject(
                request.error
            );

    });

}


/* ========================================
   ELIMINAR
======================================== */

export async function eliminarDato(

    clave

) {

    const db =
        await abrirBD();

    return new Promise((resolve, reject) => {

        const tx =
            db.transaction(
                STORE,
                "readwrite"
            );

        tx.objectStore(STORE)
            .delete(
                clave
            );

        tx.oncomplete =
            () => resolve();

        tx.onerror =
            () => reject(
                tx.error
            );

    });

}


/* ========================================
   LIMPIAR TODO
======================================== */

export async function limpiarOffline() {

    const db =
        await abrirBD();

    return new Promise((resolve, reject) => {

        const tx =
            db.transaction(
                STORE,
                "readwrite"
            );

        tx.objectStore(STORE)
            .clear();

        tx.oncomplete =
            () => resolve();

        tx.onerror =
            () => reject(
                tx.error
            );

    });

}
