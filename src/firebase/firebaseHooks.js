/* eslint-disable no-unused-vars */
import { useDispatch } from 'react-redux';
import { ref, uploadBytes } from "firebase/storage";
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword, useUpdateProfile } from 'react-firebase-hooks/auth';
import { useUploadFile } from 'react-firebase-hooks/storage';
import { loginUser, turnOfAuth } from '../context/userSlice';
import { firebaseAuth, storage } from './config';



const useLogin = () => {
    const dispatch = useDispatch();
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(firebaseAuth);
    const login = (email, password) => {
        signInWithEmailAndPassword(email, password)
        if (!error && !loading) {

            dispatch(loginUser(user))
        }
        else {
            dispatch(turnOfAuth())
        }
    }
    return { loading, error, login }
}

const useSignup = () => {
    const dispatch = useDispatch();
    const [
        createUserWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useCreateUserWithEmailAndPassword(firebaseAuth);

    const [uploadFile, uploading, snapshot, err] = useUploadFile();
    // const { updateUserProfile } = useUpdateUserProfile()

    const registerUser = async (email, password, displayName, thumbnail) => {
        try {

            createUserWithEmailAndPassword(email, password);
            console.log("in login func");
            dispatch(loginUser(user))
            const uploadPath = `thumbnails/${user.uid}/${thumbnail.name}`
            const refer = ref(storage, uploadPath)
            console.log("type-->", thumbnail.type);
            const metadata = {
                contentType: `${thumbnail.type}`,
            };
            const meta = uploadBytes(refer, thumbnail, metadata).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });
            console.log("meta", meta);
        } catch (e) {
            console.log("err while creating");
            dispatch(turnOfAuth())
            return;

        }



        //Add image to storage
        console.log("before timer-->", user);
        // setTimeout(async()=>{
        //     // const result = await uploadFile(refer, thumbnail)
        //     // console.log(err);
        //     // console.log(result);
        // },10000)

    }
    // updateUserProfile({ displayName, photoUrl })

    return { loading, error, registerUser, uploading, snapshot }
}


// const imageToStorage = () => {
//     const [uploadFile, uploading, snapshot, error] = useUploadFile();
//     const uploadImage = async (uploadPath,thumbnail) => {
//         const refer = ref(storage, uploadPath)
//         const result =await uploadFile(refer, thumbnail)
//         console.log(result);
//     }
//     return{
//         uploadImage,uploading,snapshot,error
//     }
// }


const useUpdateUserProfile = () => {
    const [updateProfile, updating, error] = useUpdateProfile(firebaseAuth);
    const updateUserProfile = (dataObject) => {
        updateProfile(dataObject)
    }
    return {
        updateUserProfile, updating, error
    }
}
export { useSignup, useUpdateUserProfile, useLogin }