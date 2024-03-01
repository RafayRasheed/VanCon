import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getCommonStorage, getLogin, setCommonStorage, setLogin } from "../components/functions/storageMMKV";

const dataReducer = createSlice({
    name: "data",
    initialState: {
        nearby: getCommonStorage('nearby', []),
        recommend: getCommonStorage('recommend', []),
        AllDrivers: getCommonStorage('AllDrivers', []),
        recommendedDrivers: getCommonStorage('recommendedDrivers', []),
        eventDrivers: getCommonStorage('eventDrivers', []),
        insideUniDrivers: getCommonStorage('insideUniDrivers', []),
        onlineDrivers: [],
        onlineDriversAll: [],
        AllItems: [],


    },
    reducers: {

        setNearby(state, action) {
            state.nearby = action.payload
            setCommonStorage('nearby', action.payload)
        },
        setRecommend(state, action) {
            state.recommend = action.payload
            setCommonStorage('recommend', action.payload)

        },

        setAllDriver(state, action) {
            state.AllDrivers = action.payload
            setCommonStorage('AllDrivers', action.payload)

        },

        setRecommendedDrivers(state, action) {
            state.recommendedDrivers = action.payload
            setCommonStorage('recommendedDrivers', action.payload)

        },
        setEventDrivers(state, action) {
            state.eventDrivers = action.payload
            setCommonStorage('eventDrivers', action.payload)

        },
        setInsideUniDrivers(state, action) {
            state.insideUniDrivers = action.payload
            setCommonStorage('insideUniDrivers', action.payload)

        },
        setOnlineDriver(state, action) {
            state.onlineDrivers = action.payload
        },
        setOnlineDriverAll(state, action) {
            state.onlineDriversAll = action.payload
        },

        setAllItems(state, action) {
            state.AllItems = action.payload
        },
    },
});

export const { setNearby, setRecommend, setAllItems, setAllDriver, setInsideUniDrivers, setOnlineDriver, setOnlineDriverAll, setRecommendedDrivers, setEventDrivers } = dataReducer.actions;
export default dataReducer.reducer;
