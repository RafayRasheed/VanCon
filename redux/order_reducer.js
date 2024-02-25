import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getLogin, setLogin } from "../components/functions/storageMMKV";

const orderReducer = createSlice({
    name: "data",
    initialState: {
        pending: [],
        progress: [],
        history: [],
        allRequest: [],
        unread: [],
        onlineReq: null

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
        },
        setAllUnread(state, action) {
            state.unread = action.payload
        },
        setOnlineReq(state, action) {
            state.onlineReq = action.payload
        }

    },
});

export const { setPendingOrderse, setOnlineReq, setProgressOrderse, setHistoryOrderse, setAllRequest, setAllUnread } = orderReducer.actions;
export default orderReducer.reducer;
