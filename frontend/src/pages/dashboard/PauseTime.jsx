import { useEffect, useState } from 'react';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import { attendanceStatus } from '@/utils/constants';
import { calcTotalPauseSeconds, formatTime } from '@/utils/helpers';
import StatBox from './StatBox';
import { useSelector } from 'react-redux';

const PauseTime = ({ currentAttendance }) => {
  const isPaused = currentAttendance?.status === attendanceStatus.PAUSED;
  const [pauseSeconds, setPauseSeconds] = useState(calcTotalPauseSeconds(currentAttendance));
  const isLoading = useSelector(state => state.Attendance.isLoading);

  useEffect(() => {
    if (!isPaused) return;
    const interval = setInterval(() => setPauseSeconds(calcTotalPauseSeconds(currentAttendance)), 1000);
    return () => clearInterval(interval);
  }, [isPaused, isLoading, currentAttendance]);

  return <StatBox icon={PauseCircleOutlineIcon} label="Pause Time" value={formatTime(pauseSeconds)} color="primaryLight.main" />;
};

export default PauseTime;
