import axios from 'axios';
import queryClient from '@/lib/queryClient';
import { setSnackbarObj } from '@/store/reducers/alertsSlice';
import { dispatch } from '@/store/store';
import { getFormattedDate, handleCatchError, handleErrorMessages } from '@/utils/helpers';

const refreshProjects = () => queryClient.invalidateQueries({ queryKey: ['projects'] });

const getFormattedProject = project => ({
  id: project.id,
  name: project.name || '',
  shortCode: project.shortCode || '',
  description: project.description || '',
  clientId: project.clientId ?? null,
  client: project.client || null,
  teamLeadId: project.teamLeadId ?? null,
  teamLead: project.teamLead || null,
  status: project.status || null,
  isBillable: Boolean(project.isBillable),
  awsAccountId: project.awsAccountId || '',
  startDate: getFormattedDate(project.startDate),
  plannedEndDate: getFormattedDate(project.plannedEndDate),
  actualEndDate: getFormattedDate(project.actualEndDate),
  members: (project.projectMembers || []).map(pm => pm.user).filter(Boolean),
  memberIds: (project.projectMembers || []).map(pm => pm.userId).filter(Boolean),
  createdAt: getFormattedDate(project.createdAt, true),
});

export const fetchProjects = async ({ searchedText, pageSize, page } = {}) => {
  try {
    const payload = { page, pageSize };

    if (searchedText) {
      payload.filters = [
        { columnName: 'name', type: 'like', value: searchedText },
        { columnName: 'short_code', type: 'like', value: searchedText },
      ];
    }

    const response = await axios.post('api/projects/listing', payload);

    if (response.status && response.data.data) {
      return { projects: response.data.data.map(getFormattedProject), totalPages: response.data.total_page_count };
    }

    handleErrorMessages(response?.errors);
    return { projects: [], totalPages: 0 };
  } catch (error) {
    handleCatchError(error);
    throw error;
  }
};

export const createProject = async projectData => {
  try {
    const response = await axios.post('api/projects', projectData);

    if (response.status) {
      dispatch(setSnackbarObj({ message: 'Project created successfully.', severity: 'success' }));
      refreshProjects();
      return true;
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const updateProject = async (projectId, payload) => {
  try {
    const response = await axios.patch(`api/projects/${projectId}`, payload);

    if (response.status) {
      dispatch(setSnackbarObj({ message: 'Project updated successfully.', severity: 'success' }));
      refreshProjects();
      return true;
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const deleteProject = async projectId => {
  try {
    const response = await axios.delete(`api/projects/${projectId}`);

    if (response.status) {
      dispatch(setSnackbarObj({ message: 'Project deleted successfully.', severity: 'success' }));
      refreshProjects();
      return true;
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const fetchProjectDetail = async projectId => {
  try {
    const response = await axios.get(`api/projects/${projectId}`);
    if (response.status && response.data) {
      return getFormattedProject(response.data);
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const fetchClientOptions = async () => {
  try {
    const response = await axios.post('api/clients/listing', { page: 1, pageSize: 500 });
    if (response.status && response.data?.data) {
      return response.data.data.map(c => ({ value: c.id, label: c.name }));
    }
    return [];
  } catch (error) {
    handleCatchError(error);
    return [];
  }
};

export const fetchUserOptions = async () => {
  try {
    const response = await axios.post('api/users/listing', { page: 1, pageSize: 500 });
    if (response.status && response.data?.data) {
      return response.data.data.map(u => ({ value: u.id, label: u.fullName || u.email }));
    }
    return [];
  } catch (error) {
    handleCatchError(error);
    return [];
  }
};
