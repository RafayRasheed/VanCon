import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getLogin, setLogin } from "../components/functions/storageMMKV";

const dataReducer = createSlice({
    name: "data",
    initialState: {
        nearby: [],
        recommend: [],
        AllItems: [],
        AllDrivers: [],
        onlineDrivers: [],
        onlineDriversAll: [],
        recommendedDrivers: [],
        eventDrivers: [],
        insideUniDrivers: [],

    },
    reducers: {

        setNearby(state, action) {
            state.nearby = action.payload
        },
        setRecommend(state, action) {
            state.recommend = action.payload
        },
        setAllItems(state, action) {
            state.AllItems = action.payload
        },
        setAllDriver(state, action) {
            state.AllDrivers = action.payload
        },
        setOnlineDriver(state, action) {
            state.onlineDrivers = action.payload
        },
        setOnlineDriverAll(state, action) {
            state.onlineDriversAll = action.payload
        },

        setRecommendedDrivers(state, action) {
            state.recommendedDrivers = action.payload
        },
        setEventDrivers(state, action) {
            state.eventDrivers = action.payload
        },
        setInsideUniDrivers(state, action) {
            state.insideUniDrivers = action.payload
        },

    },
});

export const { setNearby, setRecommend, setAllItems, setAllDriver, setInsideUniDrivers, setOnlineDriver, setOnlineDriverAll, setRecommendedDrivers, setEventDrivers } = dataReducer.actions;
export default dataReducer.reducer;
