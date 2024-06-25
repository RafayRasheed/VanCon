import {createSlice} from '@reduxjs/toolkit';
import {
  deleteLogin,
  getLogin,
  setLogin,
} from '../components/functions/storageMMKV';

const profileReducer = createSlice({
  name: 'profile',
  initialState: {
    profile: getLogin(),
  },
  reducers: {
    deleteProfile(state, action) {
      deleteLogin();
      state.profile = {};
    },

    setProfile(state, action) {
      state.profile = action.payload;
      setLogin(action.payload);
    },
  },
});

export const {deleteProfile, setProfile} = profileReducer.actions;
export default profileReducer.reducer;
