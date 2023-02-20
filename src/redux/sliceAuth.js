/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user'));
console.log(user);

const initialState = user ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

export const sliceAuth = createSlice({
  name: 'sliceAuth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('user');
    },
  },
});

export const { login, logout } = sliceAuth.actions;

export default sliceAuth.reducer;
