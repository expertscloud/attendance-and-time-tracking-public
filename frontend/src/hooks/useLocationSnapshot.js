import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { config } from '@/config/config';
import { postLocationSnapshot } from '@/pages/dashboard/AttendanceApiCalls';
import { attendanceStatus } from '../utils/constants';

// Precise fix from the OS location service (Wi-Fi positioning — the only
// "exact" location a desktop can produce). Resolves null instead of rejecting
// so callers can branch without try/catch.
const getBrowserCoords = (timeout = 20000) =>
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout, maximumAge: 0 });
  })
    .then(({ coords }) => ({ latitude: coords.latitude, longitude: coords.longitude }))
    .catch(() => null);

// Exact location is a product requirement: MainTheme polls this and blocks the
// dashboard behind LocationPermissionDialog until a precise fix is obtainable.
export const checkGeolocationAccess = async () => (await getBrowserCoords()) !== null;

// If access drops mid-session (e.g. toggled off after check-in), skip the
// snapshot silently — within 15s the MainTheme poll fails too and the dialog
// blocks the app until the user re-enables location.
const sendLocationSnapshot = async attendanceId => {
  const coords = await getBrowserCoords();
  return coords ? postLocationSnapshot({ attendanceId, ...coords }) : null;
};

const useLocationSnapshot = () => {
  const currentAttendance = useSelector(state => state.Attendance.currentAttendance);
  const isActive = currentAttendance?.status === attendanceStatus.ACTIVE;
  const attendanceId = currentAttendance?.id;

  return useQuery({
    queryKey: ['location-snapshot', attendanceId],
    queryFn: () => sendLocationSnapshot(attendanceId),
    enabled: Boolean(isActive && attendanceId),
    refetchInterval: isActive ? config.monitoringSnapshotIntervalMs : false,
  });
};

export default useLocationSnapshot;
