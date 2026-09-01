import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  countries: [],
  leaveTypes: [],
  leaveTypeEnum: {},
};

export const masterDataSlice = createSlice({
  name: 'masterData',
  initialState,
  reducers: {
    setCountries: (state, action) => {
      state.countries = action.payload;
    },
    setLeaveTypes: (state, action) => {
      state.leaveTypes = action.payload.leaveTypes;
      state.leaveTypeEnum = action.payload.leaveTypeEnum;
    },
  },
});

export const { setCountries, setLeaveTypes } = masterDataSlice.actions;

export default masterDataSlice.reducer;
