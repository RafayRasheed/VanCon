import { createSlice } from "@reduxjs/toolkit";
import { deleteLogin, getCommonStorage, getLogin, setCommonStorage, setLogin } from "../components/functions/storageMMKV";
import { dataFullData, getCurrentLocations, getDistanceFromRes } from "../components/functions/functions";
import { FirebaseLocation } from "../components/functions/firebase";

const AreasReducer = createSlice({
    name: "areas",
    initialState: {
        areas: getCommonStorage('areas', []),
    },
    reducers: {

        setAreasLocation(state, action) {
            state.areas = action.payload
            setCommonStorage('areas', action.payload)

        },



    },
});

export const { setAreasLocation, } = AreasReducer.actions;
export default AreasReducer.reducer;
