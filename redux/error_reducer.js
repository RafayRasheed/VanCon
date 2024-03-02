import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getLogin, setLogin } from "../components/functions/storageMMKV";
import { dataFullData } from "../components/functions/functions";

const errorReducer = createSlice({
    name: "error",
    initialState: {
        error: null,
        // error: { Title: 'Han', Body: 'jeee', Status: 0 },
        errors: []

    },
    reducers: {

        setErrorAlert(state, action) {

            const error = { ...action.payload }
            const id = dataFullData().smallCode
            error.id = id
            const updatedErrors = [...state.errors, error]
            state.errors = updatedErrors
            if (state.errors.length == 1) {

                state.error = error
            }
            console.log('add', state.error, state.errors.length, id)

        },
        setErrorDirect(state, action) {
            if (state.errors.length) {
                state.error = state.errors[0]

            }
        },
        removeErrorAlert(state, action) {

            const errorId = action.payload
            const updatedErrors = state.errors.filter(it => it.id != errorId)
            const isAlready = updatedErrors.length == state.errors.length
            if (!isAlready) {

                state.error = null
                state.errors = updatedErrors

                console.log('remove', state.error, state.errors.length)
            }


        },




    },
});

export const { setErrorAlert, removeErrorAlert, setErrorDirect } = errorReducer.actions;

export const removeErrorAlertWithDelay = (errorId) => (dispatch) => {
    dispatch(removeErrorAlert(errorId)); // Dispatch immediately
    setTimeout(() => {
        dispatch(setErrorDirect())

    }, 500);
};
export default errorReducer.reducer;
