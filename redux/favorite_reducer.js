import { createSlice } from "@reduxjs/toolkit";
import { uploadFavouriteFirebase } from "../components/functions/firebase";

const favoriteReducer = createSlice({
    name: "favorite",
    initialState: {
        favoriteDrivers: [],
        favoriteItem: [],
    },
    reducers: {
        addFavoriteRest(state, action) {
            const s = state.favoriteDrivers
            s.push(action.payload.resId)
            s.reverse()
            state.favoriteDrivers = s
            uploadFavouriteFirebase(state.favoriteDrivers, 'res')

        },
        removeFavoriteRest(state, action) {
            state.favoriteDrivers = state.favoriteDrivers.filter(resId => action.payload.resId != resId)
            uploadFavouriteFirebase(state.favoriteDrivers, 'res')

        },
        setFavoriteDrivers(state, action) {
            state.favoriteDrivers = action.payload
        },


        addFavoriteItem(state, action) {
            const s = state.favoriteItem
            s.push(action.payload)
            s.reverse()
            state.favoriteItem = s
            uploadFavouriteFirebase(state.favoriteItem, 'item')

        },
        removeFavoriteItem(state, action) {
            state.favoriteItem = state.favoriteItem.filter(data => action.payload.itemId != data.itemId)
            uploadFavouriteFirebase(state.favoriteItem, 'item')
        },
        setFavoriteItem(state, action) {
            state.favoriteItem = action.payload

        }

    },
});

export const { addFavoriteRest, removeFavoriteRest, setFavoriteDrivers,
    addFavoriteItem, removeFavoriteItem, setFavoriteItem } = favoriteReducer.actions;
export default favoriteReducer.reducer;
