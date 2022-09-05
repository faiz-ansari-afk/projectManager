import { useEffect, useState } from 'react';
import { firebaseDb } from "../firebase/config"
import { getDoc, doc } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';


export const useDocument = (userCollection, id) => {
    const [document, setDocument] = useState(null)
    const [error, setError] = useState(null)

    // const colRef = collection(firebaseDb, userCollection)


    //realtime data 



    useEffect(() => {
        const docRef = doc(firebaseDb, userCollection, id);

        const unsubs = onSnapshot(docRef, snapshot => {
            if (snapshot.data()) {
                setDocument({ ...snapshot.data(), id: snapshot.id })
                setError(null)
            }
            else{
                setError(`No such ${userCollection} exists`)
            }
        },

            error => {
                console.error(error);
                setError(error)
            })

        return () => unsubs();
    }, [userCollection, id])
    // console.log(document);
    return { document, error }
}