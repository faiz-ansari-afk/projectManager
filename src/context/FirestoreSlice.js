import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    document: null,
    isPending: false,
    error: null,
    success: null
}

const firestoreSlice = createSlice({
    name: "firestoreDB",
    initialState,
    reducers: {
        IS_DOC_UPLOAD_PENDING: (state, { payload }) => {
            state.isPending = true;
            state.success = false;
            state.error = null;
            state.document = null;
        },
        ADD_DOC_REF_TO_STATE: (state, { payload }) => {
            state.document = payload;
            state.isPending = false;
            state.error = null;
            state.success = true
        },
        ERR0R_IN_ADDING_DOC: (state, { payload }) => {
            state.error = payload;
            state.document = null;
            state.isPending = false;
            state.success = false
        },
        DELETED_DOC: (state, { payload }) => {
            state.error = null;
            state.document = null;
            state.isPending = false;
            state.success = true;
        },
        ERR0R_IN_DELETING_DOC: (state, { payload }) => {
            state.error = payload;
            state.document = null;
            state.isPending = false;
            state.success = false;
        },
        ADD_UPDATED_DOC_REF_TO_STATE: (state, { payload }) => {
            state.error = null;
            state.document = payload;
            state.isPending = false;
            state.success = true;
        }
    }
})

export const {
    IS_DOC_UPLOAD_PENDING,
    ADD_DOC_REF_TO_STATE,
    ERR0R_IN_ADDING_DOC,
    DELETED_DOC,
    ERR0R_IN_DELETING_DOC,
    ADD_UPDATED_DOC_REF_TO_STATE
} = firestoreSlice.actions;
const firestoreState = firestoreSlice.reducer
export default firestoreState;