import axios from 'axios';
import { handleCatchError, handleErrorMessages } from '@/utils/helpers';
import { dispatch } from '@/store/store';
import { setSnackbarObj } from '@/store/reducers/alertsSlice';
import { setLeaveTypes } from '@/store/reducers/masterDataSlice';

const getFormattedLeaveType = item => ({
  id: item.id,
  label: item.label,
  allowance: item.allowance,
  color: item.color,
  isDefault: item.isDefault,
});

export const setLeaveTypesAndEnum = rawLeaveTypes => {
  if (!rawLeaveTypes) return;

  const leaveTypes = rawLeaveTypes.map(getFormattedLeaveType);
  const leaveTypeEnum = {};
  leaveTypes.forEach(item => {
    leaveTypeEnum[item.id] = item;
  });
  dispatch(setLeaveTypes({ leaveTypes, leaveTypeEnum }));
};

export const fetchLeaveTypes = async () => {
  try {
    const response = await axios.get('/api/leave-types');
    if (response.status) {
      setLeaveTypesAndEnum(response.data);
      return true;
    }
    handleErrorMessages(response?.errors);
  } catch (error) {
    handleCatchError(error);
  }
};

export const createLeaveTypeApi = async payload => {
  try {
    const response = await axios.post('/api/leave-types', payload);
    if (response.status) {
      dispatch(setSnackbarObj({ message: response.data?.message || 'Leave type created successfully', severity: 'success' }));
      await fetchLeaveTypes();
      return true;
    }
    handleErrorMessages(response?.errors);
    return false;
  } catch (error) {
    handleCatchError(error);
    return false;
  }
};

export const updateLeaveTypeApi = async (id, payload) => {
  try {
    const response = await axios.put(`/api/leave-types/${id}`, payload);
    if (response.status) {
      dispatch(setSnackbarObj({ message: response.data?.message || 'Leave type updated successfully', severity: 'success' }));
      await fetchLeaveTypes();
      return true;
    }
    handleErrorMessages(response?.errors);
    return false;
  } catch (error) {
    handleCatchError(error);
    return false;
  }
};

export const deleteLeaveTypeApi = async id => {
  try {
    const response = await axios.delete(`/api/leave-types/${id}`);
    if (response.status) {
      dispatch(setSnackbarObj({ message: response.data?.message || 'Leave type deleted successfully', severity: 'success' }));
      await fetchLeaveTypes();
      return true;
    }
    handleErrorMessages(response?.errors);
    return false;
  } catch (error) {
    handleCatchError(error);
    return false;
  }
};
