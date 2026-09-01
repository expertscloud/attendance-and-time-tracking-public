import axios from 'axios';
import { dispatch } from '@/store/store';
import { setSelectedProject } from '@/store/reducers/projectsSlice';
import { calcTotalPauseSeconds, handleCatchError, handleErrorMessages } from '@/utils/helpers';
import queryClient from '@/lib/queryClient';
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
const formatProject = data => ({
  id: data.id,
  name: data.name,
});

export const getAllProjects = async () => {
  try {
    const response = await axios.get('/api/attendance/projects/all');

    if (response.status) {
      return (response.data ?? []).map(formatProject);
    }
    handleErrorMessages(response.errors);
    return [];
  } catch (error) {
    handleCatchError(error);
    return [];
  }
};

export const getUserProjects = async () => {
  try {
    const response = await axios.get('/api/attendance/projects/assigned');

    if (response.status) {
      return (response.data ?? []).map(formatProject);
    }
    handleErrorMessages(response.errors);
    return [];
  } catch (error) {
    handleCatchError(error);
    return [];
  }
};

export const getUserSelectedProject = async () => {
  try {
    const response = await axios.get('/api/attendance/last-work-activity');

    if (response.status && response.data) {
      dispatch(setSelectedProject({ projectId: response.data.projectId || null, notes: response.data.notes || '' }));
      return true;
    }
    return null;
  } catch (error) {
    handleCatchError(error);
    return null;
  }
};

export const createProject = async (name, description) => {
  try {
    const response = await axios.post('/api/projects', { name: name.trim(), description: description?.trim() });

    if (response.status && response.data) {
      queryClient.invalidateQueries({ queryKey: ['all-projects'] });
      return true;
    }
    handleErrorMessages(response.errors);
    return false;
  } catch (error) {
    handleCatchError(error);
    return false;
  }
};

export const getAttendanceLogs = async (limit = 7) => {
  try {
    const response = await axios.get(`/api/attendance/recent/${limit}`);

    if (response.status) {
      return (response.data ?? []).map(attendance => ({
        id: attendance.id,
        checkInTime: attendance.checkInTime,
        checkOutTime: attendance.checkOutTime,
        totalWorkingSeconds: attendance.totalWorkingSeconds ?? 0,
        totalPauseSeconds: calcTotalPauseSeconds(attendance),
      }));
    }
    handleErrorMessages(response.errors);
    return [];
  } catch (error) {
    handleCatchError(error);
    return [];
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

export const getActivityStatsByDate = async date => {
  try {
    const response = await axios.post('/api/attendance/activities', { date });

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

const formattedTeamStatus = member => {
  const attendance = member.attendances && member.attendances.length > 0 ? member.attendances[0] : null;

  return {
    id: member.id,
    userName: member.fullName,
    email: member.email,
    designation: member.designation?.label,
    profileUrl: member.profileSignedUrl,
    status: attendance?.status,
    checkInTime: attendance?.checkInTime,
    checkOutTime: attendance?.checkOutTime,
  };
};

export const getTodayTeamStatus = async () => {
  try {
    const response = await axios.get('/api/users/attendance/today');

    if (response.status) {
      return (response.data || []).map(formattedTeamStatus);
    }
    handleErrorMessages(response.errors);
    return [];
  } catch (error) {
    handleCatchError(error);
    return [];
  }
};
