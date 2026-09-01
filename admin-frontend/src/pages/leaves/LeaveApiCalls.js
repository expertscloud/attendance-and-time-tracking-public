import axios from 'axios';
import { handleCatchError, handleErrorMessages, isHolidayType } from '@/utils/helpers';
import store, { dispatch } from '@/store/store';
import { setSnackbarObj } from '@/store/reducers/alertsSlice';

export const getLeavesSummary = (leaves = []) => {
  const leaveTypes = store.getState()?.MasterData.leaveTypes;
  const counts = leaves.reduce((acc, leave) => {
    acc[leave.leaveType] = (acc[leave.leaveType] || 0) + 1;
    return acc;
  }, {});

  const total = leaves.filter(leave => !isHolidayType(leave.leaveType)).length;

  const wfhType = leaveTypes.find(t => t.label?.toLowerCase() === 'wfh');
  const wfhCount = wfhType ? counts[wfhType.id] || 0 : 0;
  const totalWithoutWFH = Math.max(0, total - wfhCount);

  return {
    ...counts,
    totalWithoutWFH,
    total,
  };
};

const getFormattedUserLeave = leave => ({
  date: leave.date,
  leaveType: leave.leaveType,
  reason: leave.reason || '',
});

const getFormattedLeavesSummary = user => ({
  id: user.id,
  fullName: user.fullName || '',
  ...getLeavesSummary(user.leaves),
});

export const fetchLeavesSummary = async ({ queryKey }) => {
  try {
    const [, startDate, endDate] = queryKey;
    const response = await axios.post('api/leaves/summary', { startDate, endDate });
    if (response.status && response.data) {
      return response.data.map(getFormattedLeavesSummary);
    }
    handleErrorMessages(response?.errors);
    return [];
  } catch (error) {
    handleCatchError(error);
    return [];
  }
};

export const fetchUserLeaves = async ({ queryKey }) => {
  try {
    const [, userId, startDate, endDate] = queryKey;
    const response = await axios.get(`api/leaves/user/${userId}`, { params: { startDate, endDate } });
    if (response.status && response.data) {
      const leaves = response.data.map(getFormattedUserLeave);
      return { leaves, summary: getLeavesSummary(leaves) };
    }
    handleErrorMessages(response?.errors);
    return { leaves: [], summary: getLeavesSummary([]) };
  } catch (error) {
    handleCatchError(error);
    return { leaves: [], summary: getLeavesSummary([]) };
  }
};

export const createOrUpdateLeave = async (cellData, leaveType, reason) => {
  try {
    const payload = { userId: cellData.data.userId, date: cellData.colDef.field, leaveType, reason };
    const response = await axios.post('api/leaves', payload);
    if (response.status) {
      dispatch(setSnackbarObj({ message: response.data?.message || 'Leave saved successfully', severity: 'success' }));
      return true;
    }
    handleErrorMessages(response?.errors);
    return false;
  } catch (error) {
    handleCatchError(error);
    return false;
  }
};

export const createOrUpdateBulkLeave = async (cellData, reason) => {
  try {
    const payload = { date: cellData.colDef.field, reason };
    const response = await axios.post('api/leaves/bulk', payload);
    if (response.status) {
      dispatch(setSnackbarObj({ message: response.data?.message || 'Holiday saved successfully for all users', severity: 'success' }));
      return true;
    }
    handleErrorMessages(response?.errors);
    return false;
  } catch (error) {
    handleCatchError(error);
    return false;
  }
};
