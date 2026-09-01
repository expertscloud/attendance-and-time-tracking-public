import { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { attendanceStatus } from '@/utils/constants';
import { formatTime } from '@/utils/helpers';
import { useSelector, useDispatch } from 'react-redux';
import { syncWorkedTime } from './AttendanceApiCalls';
import { config } from '@/config/config';
import { incrementElapsedSeconds } from '@/store/reducers/attendanceSlice';

const ElapsedCounter = ({ status }) => {
  const dispatch = useDispatch();
  const elapsedSeconds = useSelector(state => state.Attendance.elapsedSeconds);

  useQuery({
    queryKey: ['sync-worked-time'],
    queryFn: () => syncWorkedTime(elapsedSeconds),
    enabled: status === attendanceStatus.ACTIVE && elapsedSeconds > 30, // > 30s to avoid unnecessary call right after check-in
    refetchInterval: status === attendanceStatus.ACTIVE ? config.syncWorkedTimeIntervalInMs : false,
    refetchIntervalInBackground: true,
  });

  useEffect(() => {
    if (status !== attendanceStatus.ACTIVE) return;
    const interval = setInterval(() => dispatch(incrementElapsedSeconds()), 1000);
    return () => clearInterval(interval);
  }, [status, dispatch]);

  return <TimeDisplay seconds={elapsedSeconds} />;
};

export default ElapsedCounter;

const TimeDisplay = ({ seconds }) => {
  const [hh = '00', mm = '00', ss = '00'] = (formatTime(seconds) || '00:00:00').split(':');
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <TimeSegment value={hh} label="Hours" />
      <Separator />
      <TimeSegment value={mm} label="Minutes" />
      <Separator />
      <TimeSegment value={ss} label="Seconds" />
    </Box>
  );
};

const TimeSegment = ({ value, label }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 65 }}>
    <Typography sx={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1 }}>{value}</Typography>
    <Typography variant="caption" sx={{ fontSize: '0.65rem', letterSpacing: 1.2, fontWeight: 600, textTransform: 'uppercase', mt: 0.75 }}>
      {label}
    </Typography>
  </Box>
);

const Separator = () => <Typography sx={{ fontSize: '2.5rem', fontWeight: 700, color: 'text.disabled', lineHeight: 1.1 }}>:</Typography>;
