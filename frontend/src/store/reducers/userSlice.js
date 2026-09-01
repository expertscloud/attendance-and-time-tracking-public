import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userDetail: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetail(state, actions) {
      state.userDetail = actions.payload;
    },
  },
});

export default userSlice.reducer;

export const { setUserDetail } = userSlice.actions;
