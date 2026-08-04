/* ========================================
   OFFLINE MANAGER
   HSMX OFFAN
======================================== */

const DB_NAME =
    "mi-color-db-final";

const DB_VERSION =
    1;

const STORE =
    "configuracion";


/* ========================================
   CONVERTIR A DATOS GUARDABLES
======================================== */

function convertirADatoPlano(
    valor
) {

    if (
        valor === undefined
    ) {

        return null;

    }


    return JSON.parse(
        JSON.stringify(
            valor
        )
    );

}


/* ========================================
   ABRIR BASE DE DATOS
======================================== */

function abrirBD() {

    return new Promise(
        (
            resolve,
            reject
        ) => {

            const request =
                indexedDB.open(
                    DB_NAME,
                    DB_VERSION
                );


            request.onupgradeneeded =
                () => {

                    const db =
                        request.result;


                    if (
                        db.objectStoreNames.contains(
                            STORE
                        )
                    ) {

                        db.deleteObjectStore(
                            STORE
                        );

                    }


                    db.createObjectStore(
                        STORE
                    );

                };


            request.onsuccess =
                () => {

                    resolve(
                        request.result
                    );

                };


            request.onerror =
                () => {

                    reject(
                        request.error
                    );

                };


            request.onblocked =
                () => {

                    console.warn(
                        "La actualización de la base offline está bloqueada. Cierra otras pestañas de Mi Color."
                    );

                };

        }
    );

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


    const valorPlano =
        convertirADatoPlano(
            valor
        );


    return new Promise(
        (
            resolve,
            reject
        ) => {

            const tx =
                db.transaction(
                    STORE,
                    "readwrite"
                );


            tx.objectStore(
                STORE
            ).put(
                valorPlano,
                clave
            );


            tx.oncomplete =
                () => {

                    db.close();

                    resolve();

                };


            tx.onerror =
                () => {

                    const error =
                        tx.error;

                    db.close();

                    reject(
                        error
                    );

                };


            tx.onabort =
                () => {

                    const error =
                        tx.error;

                    db.close();

                    reject(
                        error
                    );

                };

        }
    );

}


/* ========================================
   LEER
======================================== */

export async function leerDato(
    clave
) {

    const db =
        await abrirBD();


    return new Promise(
        (
            resolve,
            reject
        ) => {

            const tx =
                db.transaction(
                    STORE,
                    "readonly"
                );


            const request =
                tx.objectStore(
                    STORE
                ).get(
                    clave
                );


            request.onsuccess =
                () => {

                    const resultado =
                        request.result;

                    db.close();

                    resolve(
                        resultado
                    );

                };


            request.onerror =
                () => {

                    const error =
                        request.error;

                    db.close();

                    reject(
                        error
                    );

                };

        }
    );

}


/* ========================================
   ELIMINAR
======================================== */

export async function eliminarDato(
    clave
) {

    const db =
        await abrirBD();


    return new Promise(
        (
            resolve,
            reject
        ) => {

            const tx =
                db.transaction(
                    STORE,
                    "readwrite"
                );


            tx.objectStore(
                STORE
            ).delete(
                clave
            );


            tx.oncomplete =
                () => {

                    db.close();

                    resolve();

                };


            tx.onerror =
                () => {

                    const error =
                        tx.error;

                    db.close();

                    reject(
                        error
                    );

                };

        }
    );

}


/* ========================================
   LIMPIAR TODO
======================================== */

export async function limpiarOffline() {

    const db =
        await abrirBD();


    return new Promise(
        (
            resolve,
            reject
        ) => {

            const tx =
                db.transaction(
                    STORE,
                    "readwrite"
                );


            tx.objectStore(
                STORE
            ).clear();


            tx.oncomplete =
                () => {

                    db.close();

                    resolve();

                };


            tx.onerror =
                () => {

                    const error =
                        tx.error;

                    db.close();

                    reject(
                        error
                    );

                };

        }
    );

}
