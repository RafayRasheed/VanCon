import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getLogin, setLogin } from "../components/functions/storageMMKV";

const errorReducer = createSlice({
    name: "error",
    initialState: {
        error: null,

    },
    reducers: {

        setErrorAlert(state, action) {
            state.error = action.payload
        },



    },
});

export const { setErrorAlert } = errorReducer.actions;
export default errorReducer.reducer;
