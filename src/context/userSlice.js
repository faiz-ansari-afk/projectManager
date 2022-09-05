import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    authIsReady: false,//logic of users stay logged in after refresh page,\
    profilePic:false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginUser: (state, { payload }) => {
            state.user = payload
            state.authIsReady = true
        },
        logoutUser: (state, action) => {
            state.user = null;
            state.authIsReady = false
        },
        authIsReady: (state, { payload }) => {
            state.user = payload;
            state.authIsReady = true
        },
        turnOfAuth: (state, { payload }) => {
            state.user = null;
            state.authIsReady = false
        },
        imageUploaded: (state, action) =>{
            state.profilePic = true
        },
        imageUploadedOf: (state,action) =>{
            state.profilePic = false
        }
    }
})
// const { user } = payload;
// Object.assign(state, { user, b })

export const { loginUser, logoutUser, authIsReady, turnOfAuth,imageUploaded ,imageUploadedOf} = userSlice.actions;

export default userSlice.reducer;