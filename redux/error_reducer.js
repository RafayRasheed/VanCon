import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getLogin, setLogin } from "../components/functions/storageMMKV";

const errorReducer = createSlice({
    name: "error",
    initialState: {
        error: null,
        // error: { Title: 'Han', Body: 'jeee', Status: 0 }

    },
    reducers: {

        setErrorAlert(state, action) {
            state.error = action.payload
        },



    },
});

export const { setErrorAlert } = errorReducer.actions;
export default errorReducer.reducer;
