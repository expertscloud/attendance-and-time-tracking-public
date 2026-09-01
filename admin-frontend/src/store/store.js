import { configureStore } from '@reduxjs/toolkit';
import User from './reducers/userSlice';
import Alerts from './reducers/alertsSlice';
import ThemeOptions from './reducers/themeOptionsSlice';
import MasterData from './reducers/masterDataSlice';
import Users from './reducers/usersSlice';
import Projects from './reducers/projectsSlice';
import Clients from './reducers/clientsSlice';

const store = configureStore({
  reducer: { User, Alerts, ThemeOptions, MasterData, Users, Projects, Clients },
});

export const { dispatch, getState } = store;
export default store;
