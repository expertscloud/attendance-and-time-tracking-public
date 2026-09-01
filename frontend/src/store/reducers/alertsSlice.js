import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  snackbarObj: null,
  loadingBackdrop: 0,
  beatLoader: 0,
};

const alertsSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setSnackbarObj(state, actions) {
      state.snackbarObj = actions.payload;
    },
    showLoadingBackdrop(state) {
      state.loadingBackdrop += 1;
    },
    hideLoadingBackdrop(state) {
      state.loadingBackdrop -= 1;
    },
    setShowBeatLoader(state) {
      state.beatLoader += 1;
    },
    setHideBeatLoader(state) {
      state.beatLoader -= 1;
    },
  },
});

export default alertsSlice.reducer;

export const { setSnackbarObj, showLoadingBackdrop, hideLoadingBackdrop, setShowBeatLoader, setHideBeatLoader } = alertsSlice.actions;
