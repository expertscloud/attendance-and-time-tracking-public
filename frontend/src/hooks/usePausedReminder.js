import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { attendanceStatus } from '@/utils/constants';
import { config } from '@/config/config';
import { showNotification } from './useNotificationPermission';

const isUserPresent = async () => {
  if (!window.ipcRenderer?.invoke) return true;
  try {
    const [idleSeconds, isScreenLocked] = await Promise.all([
      window.ipcRenderer.invoke('get-system-idle-seconds'),
      window.ipcRenderer.invoke('is-screen-locked'),
    ]);
    // Don't remind while the screen is locked — the user isn't there to see it.
    return !isScreenLocked && idleSeconds < config.idleThresholdSeconds;
  } catch {
    return true;
  }
};

const usePausedReminder = () => {
  const dispatch = useDispatch();
  const isPaused = useSelector(state => state.Attendance.currentAttendance?.status === attendanceStatus.PAUSED);

  useEffect(() => {
    if (!isPaused) return;

    const title = 'Are you working?';
    const body = 'Your timer is paused. Resume to continue tracking.';

    const remindIfPresent = async () => {
      if (await isUserPresent()) showNotification(title, body);
    };

    const intervalId = setInterval(remindIfPresent, config.pauseReminderIntervalInMs);
    return () => clearInterval(intervalId);
  }, [dispatch, isPaused]);
};

export default usePausedReminder;
