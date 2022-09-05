import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import { signInWithEmailAndPassword } from "firebase/auth";
import { updateDoc, doc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '../firebase/config';
//import action from redux slice
import { loginUser } from '../context/userSlice'


export const useLogin = () => {
    const [isCancelled, setIsCancelled] = useState(false) // logic for cleanup function
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();
    const login = async (email, password) => {
        setError(null);
        setIsPending(true);

        try {
            //login user 
            const loginResponse = await signInWithEmailAndPassword(firebaseAuth, email, password);
            const userRef = doc(firebaseDb, "users", loginResponse.user.uid);

            await updateDoc(userRef, {
                online: true
            });
            //dispatch login action
            dispatch(loginUser(loginResponse.user))


            //update state
            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        } catch (err) {
            console.log(err)
            setError(err.code);
            setIsPending(false);
            // if (!isCancelled) {
            // }
        }
    }
    useEffect(() => {
        return () => setIsCancelled(true)
    })
    return { error, isPending, login }
}