import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentAttendance: null,
  isLoading: false,
  elapsedSeconds: 0,
};

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    setCurrentAttendance: (state, action) => {
      state.currentAttendance = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setElapsedSeconds: (state, action) => {
      state.elapsedSeconds = action.payload;
    },
    incrementElapsedSeconds: state => {
      state.elapsedSeconds += 1;
    },
    updateAttendanceStatusAction: (state, action) => {
      state.currentAttendance.status = action.payload;
    },
  },
});

export const { setCurrentAttendance, setIsLoading, setElapsedSeconds, incrementElapsedSeconds, updateAttendanceStatusAction } =
  attendanceSlice.actions;

export default attendanceSlice.reducer;
