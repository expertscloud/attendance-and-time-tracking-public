import axios from 'axios';
import queryClient from '@/lib/queryClient';
import { setSnackbarObj } from '@/store/reducers/alertsSlice';
import { dispatch } from '@/store/store';
import { calcTotalPauseSeconds, handleCatchError, handleErrorMessages } from '@/utils/helpers';
import { genderOptions } from '@/utils/constants';
import dayjs from 'dayjs';

const calcTotalBillableSeconds = (entries) => {
  return entries.reduce((total, entry) => {
    if (entry.isBillable && entry.type === 'work') {
      const start = dayjs(entry.startTime);
      if (entry.endTime) {
        return total + Math.max(0, dayjs(entry.endTime).diff(start, 'second'));
      }
      const elapsed = Math.max(0, dayjs().diff(start, 'second'));
      return total + Math.max(elapsed, 1);
    }
    return total;
  }, 0);
};

const refreshUsers = () => queryClient.invalidateQueries({ queryKey: ['users-listing-page'] });

const appendFormField = (formData, key, value) => {
  if (!value) return;
  formData.append(key, value);
};

const buildUserFormData = values => {
  const formData = new FormData();

  formData.append('fullName', values.fullName);
  formData.append('email', values.email);
  if (values.password) {
    formData.append('password', values.password);
  }
  formData.append('isActive', values.isActive);
  formData.append('designation', values.designation);
  formData.append('employmentType', values.employmentType);
  formData.append('workMode', values.workMode);

  appendFormField(formData, 'employeeId', values.employeeId);
  appendFormField(formData, 'phoneNumber', values.phoneNumber);
  appendFormField(formData, 'emergencyContactNumber', values.emergencyContactNumber);
  appendFormField(formData, 'dob', values.dob);
  appendFormField(formData, 'joiningDate', values.joiningDate);
  appendFormField(formData, 'gender', values.gender);
  appendFormField(formData, 'address', values.address);

  if (values.image instanceof File) {
    formData.append('image', values.image);
  }

  return formData;
};

const getFormattedUser = user => {
  return {
    id: user.id,
    type: user.type,
    fullName: user.fullName || '',
    email: user.email || '',
    isActive: Boolean(user.isActive),
    designation: user.designation || null,
    employmentType: user.employmentType || null,
    workMode: user.workMode || null,
    employeeId: user.userDetail?.employeeId ?? null,
    phoneNumber: user.userDetail?.phoneNumber ?? '',
    emergencyContactNumber: user.userDetail?.emergencyContactNumber ?? '',
    dob: user.userDetail?.dob ?? null,
    joiningDate: user.userDetail?.joiningDate ?? null,
    gender: genderOptions.find(g => g.id === user.userDetail?.gender) ?? null,
    address: user.userDetail?.address ?? '',
    profileSignedUrl: user.profileSignedUrl ?? null,
  };
};

export const fetchUsers = async ({ searchedText, pageSize, page } = {}) => {
  try {
    const payload = { page, pageSize };

    if (searchedText) {
      payload.filters = [
        { columnName: 'email', type: 'like', value: searchedText },
        { columnName: 'full_name', type: 'like', value: searchedText },
      ];
    }

    const response = await axios.post('api/users/listing', payload);

    if (response.status && response.data.data) {
      return { users: response.data.data.map(getFormattedUser), totalPages: response.data.total_page_count };
    }

    handleErrorMessages(response?.errors);
    return { logs: [], totalPages: 0 };
  } catch (error) {
    handleCatchError(error);
    throw error;
  }
};

export const createUser = async userData => {
  try {
    const formData = buildUserFormData(userData);
    const response = await axios.post('api/users', formData, { rawHeader: true });

    if (response.status) {
      dispatch(setSnackbarObj({ message: 'User created successfully.', severity: 'success' }));
      refreshUsers();
      return true;
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const updateUser = async (userId, payload) => {
  try {
    const formData = buildUserFormData(payload);
    const response = await axios.patch(`api/users/${userId}`, formData, { rawHeader: true });

    if (response.status) {
      dispatch(setSnackbarObj({ message: 'User updated successfully.', severity: 'success' }));
      refreshUsers();
      return true;
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const deleteUser = async userId => {
  try {
    const response = await axios.delete(`api/users/${userId}`);

    if (response.status) {
      dispatch(setSnackbarObj({ message: 'User deleted successfully.', severity: 'success' }));
      refreshUsers();
      return true;
    }

    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const updateUserRole = async (userId, type) => {
  try {
    const response = await axios.patch(`api/users/${userId}/role`, { type });
    if (response.status) {
      dispatch(setSnackbarObj({ message: 'User role updated successfully.', severity: 'success' }));
      refreshUsers();
      return true;
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const fetchUserDetail = async userId => {
  try {
    const response = await axios.get(`api/users/${userId}`);
    if (response.status && response.data) {
      return getFormattedUser(response.data);
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

const formattedTimeEntry = data => ({
  startTime: data.startTime,
  endTime: data.endTime,
  durationSeconds: calcTotalPauseSeconds(data),
  type: data.type,
  projectName: data.project?.name,
  notes: data.notes,
  isBillable: data.isBillable,
});

export const getActivityStatsByDate = async (userId, date) => {
  try {
    const response = await axios.get(`api/users/${userId}/activities`, { params: { date } });

    if (response.status) {
      return (response.data ?? []).map(attendance => {
        const timeEntries = (attendance.timeEntries ?? []).map(formattedTimeEntry);
        return {
          checkInTime: attendance.checkInTime,
          timeEntries,
          totalBillableSeconds: calcTotalBillableSeconds(timeEntries),
        };
      });
    }
    handleErrorMessages(response.errors);
    return [];
  } catch (error) {
    handleCatchError(error);
    // Re-throw so React Query treats this as a failed fetch and retains the
    // last successful result, instead of clearing the chart on a transient
    // network issue.
    throw error;
  }
};

export const fetchUserStats = async (userId, { startDate, endDate } = {}) => {
  try {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await axios.get(`api/users/${userId}/stats`, { params });
    if (response.status && response.data) {
      return response.data;
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};
