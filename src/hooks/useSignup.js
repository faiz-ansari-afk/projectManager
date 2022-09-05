import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore';
import { firebaseAuth, firebaseDb, storage } from '../firebase/config';
import { imageUploaded, loginUser } from '../context/userSlice';

export const useSignup = () => {
    const dispatch = useDispatch();
    const [isCancelled, setIsCancelled] = useState(false) // logic for cleanup function

    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);

    const signup = async (email, password, displayName, thumbnail) => {
        setError(null)
        setIsPending(true)
        try {
            //signup user
            // const response = await createUserWithEmailAndPassword(firebaseAuth, email, password)
            // if (!response) {
            //     throw new Error('Could not complete registration...')
            // }

            createUserWithEmailAndPassword(firebaseAuth, email, password).then(
                response => {
                    const { user } = response

                    const uploadPath = `thumbnails/${response.user.uid}/${thumbnail.name}`
                    const fileRef = ref(storage, uploadPath)
                    const uploadTask = uploadBytesResumable(fileRef, thumbnail);
                    uploadTask.on('state_changed',
                        snapshot => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log("Upload is", progress, "%");
                        },
                        error => {
                            console.log("Error uploading image", error);
                        },
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
                                updateProfile(user, { displayName: displayName, photoURL: downloadUrl }).then(
                                    () => {
                                        const docdata = {
                                            displayName: user.displayName,
                                            online: true,
                                            photoURL: downloadUrl
                                        };
                                        setDoc(doc(firebaseDb, "users", `${user.uid}`), docdata).then(() => {
                                            setIsPending(false);
                                            dispatch(loginUser(user))
                                        })
                                    }
                                )
                            })
                        }
                    )
                    // updateProfile(response.user, { displayName: displayName }).then(
                    //     () => {
                    //         dispatch(loginUser(user))
                    //         uploadTask.on('state_changed', snapshot => {
                    //             const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    //             console.log("Upload is", progress, "%");
                    //         },
                    //             error => {
                    //                 console.log("Something went wrong while uploading image", error)
                    //             },
                    //             () => {
                    //                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    //                     console.log('File available at', downloadURL);

                    //                     // create docs
                    //                     const docdata = {
                    //                         online: true,
                    //                         displayName: user.displayName,
                    //                         photoUrl: downloadURL
                    //                     }
                    //                     console.log(docdata);
                    //                     setDoc(doc(firebaseDb, "users", `${user.uid}`), docdata).then(() => {

                    //                         setIsPending(false);
                    //                         dispatch(imageUploaded())
                    //                     })

                    //                 });
                    //             }
                    //         )
                    //     }
                    // ).catch(err => {
                    //     console.log("error while updating name", err);
                    // })

                },
                error => {
                    setIsPending(false);
                    setError(error.code);
                    // throw new Error(error)
                }
            )


            //adding user to global state in redux
            // dispatch(loginUser(response.user))
            if (!isCancelled) {
                setIsPending(false)
                setError(null)
            }
        } catch (err) {
            console.log(err);
            setError(err.code);
            setIsPending(false);
            // if (!isCancelled) {
            // }
        }
    }
    useEffect(() => {
        return () => setIsCancelled(true)
    })
    return { error, isPending, signup }
}