import { useMemo } from 'react';
import { Box, CircularProgress, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const ONE_HOUR = 3600;

const formatHours = seconds => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0h 0m';
  const hours = Math.floor(seconds / ONE_HOUR);
  const minutes = Math.floor((seconds % ONE_HOUR) / 60);
  return `${hours}h ${minutes}m`;
};

const buildSeries = (stats, startDate, endDate) => {
  if (!startDate || !endDate) return [];
  const map = new Map();
  stats?.attendances?.forEach(a => {
    if (!a.checkInTime) return;
    const key = dayjs(a.checkInTime).format('YYYY-MM-DD');
    map.set(key, (map.get(key) || 0) + (a.totalWorkingSeconds || 0));
  });

  const start = dayjs(startDate);
  const end = dayjs(endDate);
  if (!start.isValid() || !end.isValid() || end.isBefore(start)) return [];

  const totalDays = end.diff(start, 'day');
  const series = [];
  for (let i = 0; i <= totalDays; i++) {
    const day = start.add(i, 'day');
    const key = day.format('YYYY-MM-DD');
    const seconds = map.get(key) || 0;
    series.push({
      date: key,
      label: day.format('MMM D'),
      hours: Number((seconds / ONE_HOUR).toFixed(2)),
      seconds,
    });
  }
  return series;
};

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 3,
        px: 1.5,
        py: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {dayjs(point.date).format('ddd, MMM D, YYYY')}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
        {formatHours(point.seconds)}
      </Typography>
    </Box>
  );
};

const UserWorkChart = ({ stats, isLoading, startDate, endDate }) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const series = useMemo(() => buildSeries(stats, startDate, endDate), [stats, startDate, endDate]);

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Daily Working Time
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Hours worked per day over the selected range
        </Typography>
      </Box>

      <Box sx={{ width: '100%', height: 360, position: 'relative' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : series.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No data for the selected range.
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="workGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primary} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} minTickGap={24} />
              <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} tickFormatter={v => `${v}h`} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="hours" stroke={primary} strokeWidth={2} fill="url(#workGradient)" activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Box>
  );
};

export default UserWorkChart;
