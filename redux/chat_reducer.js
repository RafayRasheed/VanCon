import { createSlice } from "@reduxjs/toolkit";

const ChatReducer = createSlice({
    name: "chats",
    initialState: {
        chats: [],
        totalUnread: 0
    },
    reducers: {

        setChats(state, action) {
            state.chats = action.payload

        },
        setTotalUnread(state, action) {
            state.totalUnread = action.payload

        },


    },
});

export const { setChats, setTotalUnread } = ChatReducer.actions;
export default ChatReducer.reducer;
