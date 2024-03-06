import { createSlice } from "@reduxjs/toolkit";
import { getCommonStorage, setCommonStorage } from "../components/functions/storageMMKV";


const ChatReducer = createSlice({
    name: "chats",
    initialState: {
        chats: getCommonStorage('chats', []),
        totalUnread: getCommonStorage('totalUnread', 0, 'int'),
        pendings: {}
    },
    reducers: {

        setChats(state, action) {
            state.chats = action.payload
            setCommonStorage('chats', action.payload)


        },
        setPendingChats(state, action) {
            state.pendings = action.payload
        },
        setTotalUnread(state, action) {
            state.totalUnread = action.payload
            setCommonStorage('totalUnread', action.payload, 'int')


        },


    },
});

export const { setChats, setTotalUnread, setPendingChats } = ChatReducer.actions;
export default ChatReducer.reducer;
