import { config } from '@/config/config';
import dayjs from 'dayjs';
import axios from 'axios';
import { setSnackbarObj } from '@/store/reducers/alertsSlice';
import { dispatch } from '@/store/store';

export const getFormattedDate = (isoDate, isTime = false, isOnlyTime = false) => {
  const dateObj = dayjs(isoDate);

  if (!dateObj.isValid()) return '';
  if (isOnlyTime) return dateObj.format(config.timeFormat);
  return dateObj.format(`${config.dateFormat}${isTime ? ` ${config.timeFormat}` : ''}`);
};

export const isTodayDate = date => dayjs(date).isSame(dayjs(), 'day');

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

export const setItemInLocalStorage = (key, value, isStringify = true) => {
  localStorage.setItem(key, isStringify ? JSON.stringify(value) : value);
};

export const getLocalStorageItem = (key, defaultValue = null, isParse = true) => {
  try {
    const value = localStorage.getItem(key);
    return (isParse ? JSON.parse(value) : value) ?? defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const handleLogout = () => {
  const lastSignInEmail = localStorage.getItem('last_sign_in_email');
  localStorage.clear();
  if (lastSignInEmail) {
    localStorage.setItem('last_sign_in_email', lastSignInEmail);
  }
  window.location.reload();
};

export const handleErrorMessages = errors => {
  const message = errors?.map?.(e => e.message + '\n').join('') || 'Oops! Something went wrong.';
  dispatch(setSnackbarObj({ message, severity: 'error' }));
  console.log(errors);
};

export const handleCatchError = error => {
  if (axios.isCancel?.(error)) return;
  const message = error?.response?.data?.message || error?.message || 'Oops! Something went wrong.';
  console.log(error);
  dispatch(setSnackbarObj({ message, severity: 'error' }));
};

export const getInitials = name => {
  if (!name) return '-';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase() || '').join('');
};

/** Pause/idle time = (check-out seconds − check-in seconds) − working seconds. */
export const calcTotalPauseSeconds = ({ startTime, endTime, checkInTime, checkOutTime, totalWorkingSeconds }) => {
  const workSeconds = totalWorkingSeconds || 0;
  const checkInSeconds = dayjs(checkInTime || startTime).unix();
  const checkOutSeconds = (checkOutTime || endTime ? dayjs(checkOutTime || endTime) : dayjs()).unix();

  const sessionSeconds = checkOutSeconds - checkInSeconds;
  return sessionSeconds - workSeconds;
};
