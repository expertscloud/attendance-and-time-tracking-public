import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Box, Divider, IconButton, Stack, Tooltip as MuiTooltip, Typography, Paper } from '@mui/material';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import { useQuery } from '@tanstack/react-query';
import { getAttendanceLogs } from './DashboardApiCalls';
import { formatDuration, getFormattedDate } from '@/utils/helpers';

const getSessionSeconds = day => {
  if (day.checkInTime && day.checkOutTime) {
    return dayjs(day.checkOutTime).unix() - dayjs(day.checkInTime).unix();
  }
  return 0;
};

const DayActivityBar = ({ day, maxSessionSeconds }) => {
  const workSeconds = day.totalWorkingSeconds ?? 0;
  const pauseSeconds = day.totalPauseSeconds ?? 0;
  const sessionSeconds = getSessionSeconds(day);
  const remainingSeconds = Math.max(maxSessionSeconds - sessionSeconds, 0);

  return (
    <Stack direction="row" sx={{ width: '100%', height: 8, borderRadius: 4, overflow: 'hidden' }}>
      {workSeconds > 0 && <Box sx={{ flex: workSeconds, bgcolor: 'primary.main', minWidth: 0 }} />}
      {pauseSeconds > 0 && <Box sx={{ flex: pauseSeconds, bgcolor: 'primaryLight.main', minWidth: 0 }} />}
      {remainingSeconds > 0 && <Box sx={{ flex: remainingSeconds, bgcolor: 'grey.200', minWidth: 0 }} />}
    </Stack>
  );
};

const DayRow = ({ day, maxSessionSeconds }) => (
  <Stack spacing={1} sx={{ py: 1.25 }}>
    <Stack direction="row" sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
        {getFormattedDate(day.checkInTime, false, false)}
      </Typography>
      <Typography variant="caption">
        {getFormattedDate(day.checkInTime, false, true)} – {getFormattedDate(day.checkOutTime, false, true)}
      </Typography>
    </Stack>

    <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
      <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600 }}>
        Work {formatDuration(day.totalWorkingSeconds)}
      </Typography>
      <Typography variant="caption" sx={{ color: 'primaryLight.main', fontWeight: 600 }}>
        Pause {formatDuration(day.totalPauseSeconds)}
      </Typography>
    </Stack>

    <DayActivityBar day={day} maxSessionSeconds={maxSessionSeconds} />
  </Stack>
);

const AttendanceLogs = () => {
  const {
    data = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({ queryKey: ['attendance-logs-by-days'], queryFn: () => getAttendanceLogs() });

  const isFetching = isLoading || isRefetching;

  const maxSessionSeconds = useMemo(() => {
    if (!data.length) return 1;
    return Math.max(...data.map(getSessionSeconds), 1);
  }, [data]);

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" sx={{ mb: 1.5, alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Attendance Logs
        </Typography>

        <MuiTooltip title={isFetching ? 'Getting Logs...' : 'Refresh Logs'} arrow>
          <IconButton color="primary" onClick={() => !isFetching && refetch()}>
            <SyncRoundedIcon />
          </IconButton>
        </MuiTooltip>
      </Stack>

      {isLoading ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          Loading…
        </Typography>
      ) : data.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          No attendance logs in last 7 days
        </Typography>
      ) : (
        <>
          {data.map((day, index) => (
            <Box key={day.id}>
              <DayRow day={day} maxSessionSeconds={maxSessionSeconds} />
              {index < data.length - 1 && <Divider />}
            </Box>
          ))}
        </>
      )}
    </Paper>
  );
};

export default AttendanceLogs;
