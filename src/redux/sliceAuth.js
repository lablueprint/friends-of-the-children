/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('user'));
// const user = document.cookie;
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
      // document.cookie = (`user = ${JSON.stringify(action.payload)}`);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      localStorage.removeItem('user');
      // document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    },
  },
});

export const { login, logout } = sliceAuth.actions;

export default sliceAuth.reducer;
