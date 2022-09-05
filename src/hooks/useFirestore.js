import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { collection, addDoc, doc, deleteDoc, updateDoc, Timestamp } from "firebase/firestore";
import { firebaseDb } from "../firebase/config";

//redux action
import { IS_DOC_UPLOAD_PENDING, ADD_DOC_REF_TO_STATE, ERR0R_IN_ADDING_DOC, DELETED_DOC, ERR0R_IN_DELETING_DOC, ADD_UPDATED_DOC_REF_TO_STATE } from "../context/FirestoreSlice";

export const useFirestore = (userCollection) => {
    const [isCancelled, setIsCancelled] = useState(false);// don't update the state if this is true (cleanup function logic)
    const dispatch = useDispatch();
    //collection reference
    const ref = collection(firebaseDb, userCollection)
    //Add docs
    const addDocument = async (userDoc) => {

        dispatch(IS_DOC_UPLOAD_PENDING());
        try {
            const createdAt = Timestamp.fromDate(new Date())
            const docRef = await addDoc(ref, { ...userDoc, createdAt });
            dispatch(ADD_DOC_REF_TO_STATE(docRef))
        } catch (err) {
            console.log(err);
            dispatch(ERR0R_IN_ADDING_DOC(err))
        }
    }
    //delete docs
    const deleteDocument = async (id) => {
        dispatch(IS_DOC_UPLOAD_PENDING());
        try {
            await deleteDoc(doc(firebaseDb, userCollection, id))

            dispatch(DELETED_DOC())
        } catch (error) {
            console.log(error);
            dispatch(ERR0R_IN_DELETING_DOC("something went wrong while deleting..."))
        }
    }
    //update document
    const updateDocument = async (id, updates) => {
        dispatch(IS_DOC_UPLOAD_PENDING());
        try {
            // const docRef = await doc(firebaseDb,userCollection,id).update(updates)
            const docRef = doc(firebaseDb, userCollection, id)
            const updatedDocument = await updateDoc(docRef, updates);
            
            dispatch(ADD_UPDATED_DOC_REF_TO_STATE("Document updated"))

            return updatedDocument
        } catch (error) {
            dispatch(ERR0R_IN_DELETING_DOC("something went wrong while updating..."))

            return null
        }
    }
    // cleanup function if component is removed from DOM while async request is going on
    useEffect(() => {
        return () => setIsCancelled(true);
    }, [])
    const response = useSelector(state => state.firestoreDB)
    return { addDocument, deleteDocument, response, updateDocument }
}