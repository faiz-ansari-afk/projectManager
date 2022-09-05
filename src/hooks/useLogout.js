import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { doc, updateDoc,getDoc  } from "firebase/firestore";
import { firebaseAuth, firebaseDb } from '../firebase/config';
import { signOut } from "firebase/auth";
// import { logoutUser, turnOfAuth } from '../context/UserSlice';
import { logoutUser } from '../context/userSlice';

export const useLogout = () => {
    const [isCancelled, setIsCancelled] = useState(false) // logic for cleanup function
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user)
    
    const logout = async () => {
        setError(null);
        setIsPending(true);

        //logging out user
        try {
            const userRef = doc(firebaseDb, "users",user.uid);

            await updateDoc(userRef, {
                online: false
              });
            await signOut(firebaseAuth);

            //dispatch logout action
            dispatch(logoutUser())
            // dispatch(turnOfAuth()) if we do this then after logout none of our component will render

            //update state
            setIsPending(false)
            if (!isCancelled) {
                setError(null)
            }
        } catch (err) {
            if (!isCancelled) {
                console.log(err)
                setError(err.code);
                setIsPending(false);
            }
        }
    }
    useEffect(() => {
        return () => setIsCancelled(true)
    })
    return { error, isPending, logout }
}