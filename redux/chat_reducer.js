import { createSlice } from "@reduxjs/toolkit";
import { getCommonStorage, setCommonStorage } from "../components/functions/storageMMKV";


const ChatReducer = createSlice({
    name: "chats",
    initialState: {
        chats: getCommonStorage('chats', []),
        totalUnread: getCommonStorage('totalUnread', 0, 'int')
    },
    reducers: {

        setChats(state, action) {
            state.chats = action.payload
            setCommonStorage('chats', action.payload)


        },
        setTotalUnread(state, action) {
            state.totalUnread = action.payload
            setCommonStorage('totalUnread', action.payload, 'int')


        },


    },
});

export const { setChats, setTotalUnread } = ChatReducer.actions;
export default ChatReducer.reducer;
