import { config } from '@/config/config';
import { PAGE_SIZE_OPTIONS } from '@/utils/constants';
import { getLocalStorageItem, setItemInLocalStorage } from '@/utils/helpers';
import { createSlice } from '@reduxjs/toolkit';

const getInitialState = () => ({
  page: 1,
  pageSize: PAGE_SIZE_OPTIONS.includes(Number(getLocalStorageItem('pageSize')))
    ? Number(getLocalStorageItem('pageSize'))
    : config.defaultPageSize,
  searchedText: '',
});

const usersSlice = createSlice({
  name: 'users',
  initialState: { ...getInitialState() },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setPageSize(state, action) {
      state.page = 1;
      state.pageSize = action.payload;
      setItemInLocalStorage('pageSize', action.payload);
    },
    setSearchedText(state, action) {
      state.page = 1;
      state.searchedText = action.payload;
    },
    resetFiltersAction: () => {
      localStorage.removeItem('pageSize');
      return getInitialState();
    },
  },
});

export const { setPage, setPageSize, setSearchedText, resetFiltersAction } = usersSlice.actions;
export default usersSlice.reducer;
