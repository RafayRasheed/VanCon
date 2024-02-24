const { configureStore } = require("@reduxjs/toolkit");
import cartReducer from './cart_reducer'
import data_reducer from './data_reducer';
import favoriteReducer from './favorite_reducer';
import order_reducer from './order_reducer';
import profile_reducer from './profile_reducer';
import location_reducer from './location_reducer';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import error_reducer from './error_reducer';
import areas_reducer from './areas_reducer';
import chat_reducer from './chat_reducer';

const storeRedux = configureStore({
    reducer: {

        cart: cartReducer,
        favorite: favoriteReducer,
        profile: profile_reducer,
        data: data_reducer,
        orders: order_reducer,

        location: location_reducer,
        error: error_reducer,
        areas: areas_reducer,
        chats: chat_reducer,


    }
})

export default storeRedux