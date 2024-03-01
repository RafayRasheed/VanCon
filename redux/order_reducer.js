import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getCommonStorage, getLogin, setCommonStorage, setLogin } from "../components/functions/storageMMKV";

const orderReducer = createSlice({
    name: "data",
    initialState: {
        pending: getCommonStorage('pending', []),
        progress: getCommonStorage('progress', []),
        history: getCommonStorage('history', []),
        allRequest: getCommonStorage('allRequest', []),
        unread: getCommonStorage('unread', []),
        onlineReq: getCommonStorage('onlineReq', null),

    },
    reducers: {

        setPendingOrderse(state, action) {
            state.pending = action.payload
            setCommonStorage('pending', action.payload)

        },

        setProgressOrderse(state, action) {
            state.progress = action.payload
            setCommonStorage('progress', action.payload)

        },
        setHistoryOrderse(state, action) {
            state.history = action.payload
            setCommonStorage('history', action.payload)

        },
        setAllRequest(state, action) {
            state.allRequest = action.payload
            setCommonStorage('allRequest', action.payload)

        },
        setAllUnread(state, action) {
            state.unread = action.payload
            setCommonStorage('unread', action.payload)

        },
        setOnlineReq(state, action) {
            state.onlineReq = action.payload
            setCommonStorage('onlineReq', action.payload)

        }

    },
});

export const { setPendingOrderse, setOnlineReq, setProgressOrderse, setHistoryOrderse, setAllRequest, setAllUnread } = orderReducer.actions;
export default orderReducer.reducer;
