//subscribing to real time data from firestore
import { useEffect, useRef, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { firebaseDb } from "../firebase/config"

export const useCollection = (userCollection, _userQuery, _orderBy) => {
    const [documents, setDocuments] = useState(null);
    const [error, setError] = useState(null);

    const userQuery = useRef(_userQuery).current;
    const userOrderBy = useRef(_orderBy).current;
    const colRef = collection(firebaseDb, userCollection)
    let q = query(colRef)
    if (userQuery) {
        q = query(colRef, where(...userQuery))
    }
    if (userQuery && userOrderBy) {
        q = query(colRef, where(...userQuery), orderBy(...userOrderBy))
    }
    useEffect(() => {

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                let results = [];
                snapshot.docs.forEach(doc => {
                    results.push({ ...doc.data(), id: doc.id })
                })
                setDocuments(results);
                setError(null)
            },
            (error) => {
                console.log(error.code)
                setDocuments(null);
                setError(error.code)
            });

        //cleanup on unmount
        return () => unsubscribe();// stop this function on unmount
    }, [collection, query, orderBy])
    return { documents, error }
}