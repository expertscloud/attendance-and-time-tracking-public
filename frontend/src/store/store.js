import { configureStore } from '@reduxjs/toolkit';
import User from './reducers/userSlice';
import Alerts from './reducers/alertsSlice';
import Attendance from './reducers/attendanceSlice';
import Projects from './reducers/projectsSlice';

const store = configureStore({
  reducer: { User, Alerts, Attendance, Projects },
});

export const { dispatch, getState } = store;
export default store;
