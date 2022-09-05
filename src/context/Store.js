import {  configureStore } from "@reduxjs/toolkit";
import { combineReducers } from 'redux'
import userReducer from './userSlice'
import firestoreReducer from './FirestoreSlice'


const rootReducer = combineReducers({
    user:userReducer,
    firestoreReducer:firestoreReducer
    
})
export const store = configureStore({
    reducer:rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})