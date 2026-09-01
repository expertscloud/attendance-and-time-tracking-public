import axios from 'axios';
import { dispatch, getState } from '@/store/store';
import { setCurrentAttendance, setElapsedSeconds, setIsLoading, updateAttendanceStatusAction } from '@/store/reducers/attendanceSlice';
import { setIsDirty } from '@/store/reducers/projectsSlice';
import { handleCatchError, handleErrorMessages } from '@/utils/helpers';
import { attendanceStatus } from '@/utils/constants';
import queryClient from '@/lib/queryClient';

const refreshActivityStatsByDate = () => queryClient.invalidateQueries({ queryKey: ['activity-stats-by-date'] });

const refreshLogsByDays = () => queryClient.invalidateQueries({ queryKey: ['attendance-logs-by-days'] });

const workPayload = (isElapsedSeconds = true) => ({
  notes: getState().Projects.selectedProjectNotes,
  projectId: getState().Projects.selectedProjectId,
  isBillable: getState().Projects.isBillable ?? false,
  workedSeconds: isElapsedSeconds ? getState().Attendance.elapsedSeconds : undefined,
});

const formattedAttendance = (data, updateStatus = true) => ({
  id: data.id,
  status: updateStatus ? data.status : getState().Attendance.currentAttendance?.status || data.status,
  checkInTime: data.checkInTime,
  checkOutTime: data.checkOutTime,
  totalWorkingSeconds: data.totalWorkingSeconds,
});

export const postLocationSnapshot = async payload => {
  try {
    const response = await axios.post('/api/attendance/location-snapshots', payload);
    if (response.status) {
      return response.data;
    }
    handleErrorMessages(response.errors);
    return null;
  } catch (error) {
    handleCatchError(error);
    return null;
  }
};

export const checkIn = async () => {
  try {
    dispatch(setElapsedSeconds(0));
    dispatch(setIsLoading(true));
    const response = await axios.post('/api/attendance/check-in', workPayload(false));

    if (response.status) {
      refreshActivityStatsByDate();
      dispatch(setCurrentAttendance(response.data ? formattedAttendance(response.data) : null));
      dispatch(setIsDirty(false));
      return response.data;
    }
    handleErrorMessages(response.errors);
    return null;
  } catch (error) {
    handleCatchError(error);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const checkOut = async () => {
  try {
    dispatch(setIsLoading(true));
    const response = await axios.post('/api/attendance/check-out', workPayload());

    if (response.status) {
      dispatch(setCurrentAttendance(response.data ? formattedAttendance(response.data) : null));
      refreshActivityStatsByDate();
      refreshLogsByDays();
      return response.data;
    }
    handleErrorMessages(response.errors);
    return null;
  } catch (error) {
    handleCatchError(error);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const pauseTimer = async (payload = {}) => {
  dispatch(updateAttendanceStatusAction(attendanceStatus.PAUSED));

  try {
    dispatch(setIsLoading(true));
    const response = await axios.post('/api/attendance/pause', { ...workPayload(), ...payload });

    if (response.status) {
      dispatch(setCurrentAttendance(response.data ? formattedAttendance(response.data) : null));
      refreshActivityStatsByDate();
      dispatch(setElapsedSeconds(response.data?.totalWorkingSeconds ?? 0));
      return response.data;
    }
    handleErrorMessages(response.errors);
    return null;
  } catch (error) {
    handleCatchError(error);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const resumeTimer = async () => {
  dispatch(updateAttendanceStatusAction(attendanceStatus.ACTIVE));

  try {
    dispatch(setIsLoading(true));
    const response = await axios.post('/api/attendance/resume', workPayload(false));

    if (response.status) {
      dispatch(setCurrentAttendance(response.data ? formattedAttendance(response.data) : null));
      dispatch(setIsDirty(false));
      refreshActivityStatsByDate();
      return response.data;
    }
    handleErrorMessages(response.errors);
    return null;
  } catch (error) {
    handleCatchError(error);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const startNewTask = async () => {
  try {
    dispatch(setIsLoading(true));
    const response = await axios.post('/api/attendance/start-new-task', workPayload(false));

    if (response.status) {
      dispatch(setIsDirty(false));
      refreshActivityStatsByDate();
      return;
    }
    handleErrorMessages(response.errors);
  } catch (error) {
    handleCatchError(error);
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const getCurrentAttendance = async () => {
  try {
    const response = await axios.get('/api/attendance/current');
    if (response.status) {
      const data = response.data;
      dispatch(setCurrentAttendance(data ? formattedAttendance(data, false) : null));
      if (data?.status !== attendanceStatus.ACTIVE || !getState().Attendance.elapsedSeconds) {
        dispatch(setElapsedSeconds(Math.max(getState().Attendance.elapsedSeconds, data?.totalWorkingSeconds ?? 0)));
      }
      return response.data;
    }
    handleErrorMessages(response.errors);
    return null;
  } catch (error) {
    handleCatchError(error);
    return false;
  }
};

export const syncWorkedTime = async elapsedSeconds => {
  try {
    const response = await axios.post('/api/attendance/sync', { workedSeconds: elapsedSeconds });
    if (response.status) {
      dispatch(setCurrentAttendance(response.data ? formattedAttendance(response.data) : null));
      return response.data;
    }
    handleErrorMessages(response.errors);
    dispatch(setCurrentAttendance(null));
    return null;
  } catch (error) {
    handleCatchError(error);
    return false;
  }
};
