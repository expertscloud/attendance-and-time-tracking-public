import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { resumeTimer, pauseTimer } from '@/pages/dashboard/AttendanceApiCalls';
// import { getState } from '@/store/store';
import { attendanceStatus } from '@/utils/constants';
import { formatDuration } from '@/utils/helpers';
import { showNotification } from './useNotificationPermission';

const shortDur = secs => (secs < 60 ? `${secs}s` : formatDuration(secs));

export const useElectronIPC = () => {
  const currentAttendance = useSelector(state => state.Attendance.currentAttendance);
  const status = currentAttendance?.status;

  useEffect(() => {
    if (!window.ipcRenderer) return;

    if (status === attendanceStatus.ACTIVE) {
      window.ipcRenderer.send('timer-started');
    } else if (status === attendanceStatus.PAUSED) {
      window.ipcRenderer.send('timer-paused');
    } else {
      window.ipcRenderer.send('timer-stopped');
    }
  }, [status]);

  useEffect(() => {
    if (!window.ipcRenderer) return;

    const handleUserIdle = async (_, data) => {
      // if (getState().Attendance.currentAttendance?.status !== attendanceStatus.ACTIVE) return;
      await pauseTimer({ idleSeconds: data.idleSeconds });
    };

    const handleUserActive = async (_, data) => {
      // if (getState().Attendance.currentAttendance?.status !== attendanceStatus.PAUSED) return;
      await resumeTimer();
      showNotification('Welcome back! The timer has resumed.', `You were away for ${shortDur(data?.idleSeconds ?? 0)}.`);
    };

    window.ipcRenderer.on('user-idle', handleUserIdle);
    window.ipcRenderer.on('user-active', handleUserActive);

    return () => {
      window.ipcRenderer.off('user-idle', handleUserIdle);
      window.ipcRenderer.off('user-active', handleUserActive);
    };
  }, []);

  return {
    isElectron: !!window.ipcRenderer,
  };
};
