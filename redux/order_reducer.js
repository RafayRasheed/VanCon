import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getLogin, setLogin } from "../components/functions/storageMMKV";

const orderReducer = createSlice({
    name: "data",
    initialState: {
        pending: [],
        progress: [],
        history: [],
        allRequest: []

    },
    reducers: {

        setPendingOrderse(state, action) {
            state.pending = action.payload
        },

        setProgressOrderse(state, action) {
            state.progress = action.payload
        },
        setHistoryOrderse(state, action) {
            state.history = action.payload
        },
        setAllRequest(state, action) {
            state.allRequest = action.payload
        }

    },
});

export const { setPendingOrderse, setProgressOrderse, setHistoryOrderse, setAllRequest } = orderReducer.actions;
export default orderReducer.reducer;
