const { configureStore } = require("@reduxjs/toolkit");
import cartReducer from './cart_reducer'
import data_reducer from './data_reducer';
import favoriteReducer from './favorite_reducer';
import profile_reducer from './profile_reducer';

const storeRedux = configureStore({
    reducer: {
        cart: cartReducer,
        favorite: favoriteReducer,
        profile: profile_reducer,
        data: data_reducer,
    }
})

export default storeRedux