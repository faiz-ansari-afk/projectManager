import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore';

import { updateProfile } from "firebase/auth";
import { storage, firebaseDb } from '../firebase/config';
import { imageUploaded, imageUploadedOf } from '../context/userSlice';

export const useUpdateImageAndDisplayName = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const [imageUrl, setImageUrl] = useState(null)
    const [isCancelled, setIsCancelled] = useState(false) // logic for cleanup function
    const [error, setError] = useState(null);
    const [isPending, setIsPending] = useState(false);
    let progress = 0
    const updateImageAndDisplayName = async (name, thumbnail) => {
        // console.log("from updation page",user.uid);
        setError(null)
        setIsPending(true)
        const uploadPath = `thumbnails/${user.uid}/${thumbnail.name}`
        try {
            // set displayName of user after creating user
            await updateProfile(user, { displayName: name })
            // upload image
            const fileRef = ref(storage, uploadPath)
            const uploadTask = uploadBytesResumable(fileRef, thumbnail);

            uploadTask.on('state_changed', snapshot => {
                progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is", progress, "%");
            },
                error => {
                    console.log("Something went wrong while uploading image", error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                         
                        // create docs
                        const docdata = {
                            online: true,
                            displayName: user.displayName,
                            photoUrl: downloadURL
                        }
                        console.log(docdata);
                         setDoc(doc(firebaseDb, "users", `${user.uid}`), docdata).then( ()=> {

                             setIsPending(false);
                             dispatch(imageUploaded())
                         })

                    });
                }
            )
            // await updateProfile(user, { displayName: name })
            // // create docs
            // const docdata = {
            //     online: true,
            //     displayName: user.displayName,
            //     photoUrl: imageUrl
            // }
            // console.log(docdata);
            // await setDoc(doc(firebaseDb, "users", `${user.uid}`), docdata);

            // setIsPending(false);
            // dispatch(imageUploaded())
            if (!isCancelled) {
                setIsPending(false);
                setError(null);
            }
        } catch (err) {
            console.log(err);
            if (!isCancelled) {
                
                setError(err.code);
                setIsPending(false);
            }
        }
    }

    useEffect(() => {
        return () => setIsCancelled(true)
    })
    return { error, isPending, updateImageAndDisplayName }
}