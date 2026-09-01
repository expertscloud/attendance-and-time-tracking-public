import { config } from '@/config/config';
import dayjs from 'dayjs';
import { setSnackbarObj } from '@/store/reducers/alertsSlice';
import { dispatch } from '@/store/store';

export const getFormattedDate = (isoDate, isTime = false, isOnlyTime = false) => {
  const dateObj = dayjs(isoDate);

  if (!dateObj.isValid()) return '';
  if (isOnlyTime) return dateObj.format(config.timeFormat);
  return dateObj.format(`${config.dateFormat}${isTime ? ` ${config.timeFormat}` : ''}`);
};

const getDefaultDateRange = (days = 7) => ({
  startDate: dayjs()
    .subtract(days - 1, 'day')
    .format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
});

export const getPresetRange = key => {
  const endDate = dayjs().format('YYYY-MM-DD');
  if (key === 'YTD') {
    return { startDate: dayjs().startOf('year').format('YYYY-MM-DD'), endDate };
  }
  return getDefaultDateRange(31);
};

export const formatTime = seconds => {
  const total = Number(seconds);
  if (!Number.isFinite(total) || total < 0) {
    return '';
  }
  const whole = Math.floor(total);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = whole % 60;

  const pad = num => String(num).padStart(2, '0');

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
};

export const formatDuration = seconds => {
  const total = Number(seconds);
  if (!Number.isFinite(total) || total < 0) return '';
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const calcTotalPauseSeconds = ({ startTime, endTime, checkInTime, checkOutTime, totalWorkingSeconds }) => {
  const workSeconds = totalWorkingSeconds || 0;
  const checkInSeconds = dayjs(checkInTime || startTime).unix();
  const checkOutSeconds = (checkOutTime || endTime ? dayjs(checkOutTime || endTime) : dayjs()).unix();

  const sessionSeconds = checkOutSeconds - checkInSeconds;
  return sessionSeconds - workSeconds;
};

export const setItemInLocalStorage = (key, value, isStringify = true) => {
  localStorage.setItem(key, isStringify ? JSON.stringify(value) : value);
};

export const getLocalStorageItem = (key, defaultValue = null, isParse = true) => {
  try {
    const value = localStorage.getItem(key);
    return (isParse ? JSON.parse(value) : value) ?? defaultValue;
  } catch (error) {
    handleCatchError(error);
    return defaultValue;
  }
};

export const handleLogout = () => {
  localStorage.clear();
  window.location.href = '/sign-in';
};

export const handleErrorMessages = errors => {
  const message = errors?.map?.(e => e.message + '\n').join('') || 'Oops! Something went wrong.';

  dispatch(setSnackbarObj({ message, severity: 'error' }));
};

export const handleCatchError = error => {
  console.log('error', error);
  dispatch(setSnackbarObj({ message: error.message, severity: 'error' }));
};

export const getInitials = name => {
  if (!name) return '-';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() || '').join('');
};

export const isWeekendDate = date => {
  const day = dayjs(date).day();
  return day === 0 || day === 6;
};

export const getWeekendLabel = date => {
  if (!date || !isWeekendDate(date)) return null;
  return dayjs(date).day() === 6 ? 'Sat' : 'Sun';
};

export const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const isHolidayType = leaveType => leaveType === 5;
export const isWfhType = leaveType => leaveType === 4;
