import axios from 'axios';
import dayjs from 'dayjs';
import { handleCatchError, handleErrorMessages } from '@/utils/helpers';

const getFormattedAttendanceData = (data, dateKeys) => {
  const row = { fullName: data.fullName, email: data.email, userId: data.id };

  const attendancesByDate = {};
  (data.attendances || []).forEach(a => {
    if (a?.checkInTime) attendancesByDate[dayjs(a.checkInTime).format('YYYY-MM-DD')] = a;
  });

  const leavesByDate = {};
  (data.leaves || []).forEach(l => {
    if (l?.date) leavesByDate[dayjs(l.date).format('YYYY-MM-DD')] = l;
  });

  dateKeys.forEach(k => {
    const a = attendancesByDate[k];
    const l = leavesByDate[k];
    row[k] = {
      checkIn: a?.checkInTime,
      checkOut: a?.checkOutTime,
      totalWorkingSeconds: a?.totalWorkingSeconds,
      updatedAt: a?.updatedAt,
      status: a?.status,
      leave: l,
    };
  });

  return row;
};

export const fetchAttendances = async (range, dateKeys) => {
  try {
    const response = await axios.post('api/users/attendances', { startDate: range.startDate, endDate: range.endDate });

    if (response.status && response.data) {
      return response.data.map(data => getFormattedAttendanceData(data, dateKeys));
    }

    handleErrorMessages(response?.errors);
    return null;
  } catch (error) {
    handleCatchError(error);
    return null;
  }
};

const getFormattedLocationData = location => ({
  latitude: location.latitude,
  longitude: location.longitude,
  createdAt: location.createdAt,
  fullName: location.user?.fullName ?? '',
});

export const fetchUsersLocations = async date => {
  try {
    const response = await axios.get('api/users/locations', { params: { date } });
    if (response.status && response.data) {
      return response.data.map(getFormattedLocationData);
    }
    handleErrorMessages(response?.errors);
    return null;
  } catch (error) {
    handleCatchError(error);
    return null;
  }
};
