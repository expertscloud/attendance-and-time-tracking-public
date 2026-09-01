import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedProjectId: null,
  selectedProjectNotes: '',
  isBillable: true,
  // True when the form has edits that aren't logged yet — i.e. the project or notes changed
  isDirty: false,
};

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setSelectedProjectId: (state, action) => {
      state.selectedProjectId = action.payload;
      state.selectedProjectNotes = '';
      state.isDirty = true;
    },
    setSelectedProjectNotes: (state, action) => {
      state.selectedProjectNotes = action.payload;
      state.isDirty = true;
    },
    setIsBillable: (state, action) => {
      state.isBillable = action.payload;
      state.isDirty = true;
    },
    setSelectedProject: (state, action) => {
      state.selectedProjectId = action.payload.projectId;
      state.selectedProjectNotes = action.payload.notes;
      state.isDirty = false;
    },
    setIsDirty: (state, action) => {
      state.isDirty = action.payload;
    },
  },
});

export const { setSelectedProjectId, setSelectedProjectNotes, setIsBillable, setSelectedProject, setIsDirty } = projectsSlice.actions;

export default projectsSlice.reducer;
