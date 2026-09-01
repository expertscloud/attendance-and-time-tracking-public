import { useMemo } from 'react';
import { Box, Chip, IconButton, Stack, Tooltip as MuiTooltip, Typography, useTheme, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, BarStack, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import dayjs from 'dayjs';
import { getActivityStatsByDate } from './DashboardApiCalls';
import { formatDuration, getFormattedDate } from '@/utils/helpers';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';

const HOUR = 3600;
const DAY = 86400;
const PAD = 1800;

const secondsOfDay = iso => {
  const d = dayjs(iso);
  return d.hour() * HOUR + d.minute() * 60 + d.second();
};

const hourTick = sec => dayjs().startOf('day').add(sec, 'second').format('h A');

const rangeOf = entry => {
  const start = secondsOfDay(entry.startTime);
  if (entry.endTime) return [start, secondsOfDay(entry.endTime)];
  const elapsed = Math.max(0, dayjs().diff(dayjs(entry.startTime), 'second'));
  return [start, start + Math.max(elapsed, 1)];
};

const buildChart = entries => {
  if (!entries?.length) return null;
  const sorted = entries; //[...entries].sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)));
  const ranges = sorted.map(rangeOf);
  const minStart = Math.min(...ranges.map(r => r[0]));
  const maxEnd = Math.max(...ranges.map(r => r[1]));
  const domain = [Math.max(0, Math.floor((minStart - PAD) / HOUR) * HOUR), Math.min(DAY, Math.ceil((maxEnd + PAD) / HOUR) * HOUR)];
  const ticks = [];
  for (let s = domain[0]; s <= domain[1]; s += HOUR) ticks.push(s);

  const row = { _row: 'today', ...Object.fromEntries(ranges.map((r, i) => [`r${i}`, r])) };
  return { entries: sorted, row, domain, ticks };
};

const ActivityTooltip = ({ active, payload, entries }) => {
  if (!active || !payload?.length) return null;
  const key = payload[0]?.dataKey;
  if (typeof key !== 'string' || !key.startsWith('r')) return null;
  const entry = entries?.[Number(key.slice(1))];
  if (!entry) return null;

  const isWork = entry.type === 'work';
  const isAway = entry.type === 'away';

  return (
    <Box sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1, boxShadow: 3, px: 1.5, py: 1 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {getFormattedDate(entry.startTime, false, true)} – {entry.endTime ? getFormattedDate(entry.endTime, false, true) : 'In progress'}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: isWork ? 'success.main' : isAway ? 'grey.600' : 'warning.main' }}>
        {isWork ? 'Working' : isAway ? 'Away/Offline' : 'Paused'}
        {entry.projectName && isWork ? ` • ${entry.projectName}` : ''}
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        Duration: {entry.endTime ? formatDuration(entry.durationSeconds) : 'In progress'}
      </Typography>
      {isWork && entry.notes ? (
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, maxWidth: 240, whiteSpace: 'normal' }}>
          Notes: {entry.notes}
        </Typography>
      ) : null}
      {isWork ? (
        <Typography variant="caption" sx={{ color: entry.isBillable ? 'primary.main' : 'text.secondary' }}>
          {entry.isBillable ? 'Billable' : 'Non-billable'}
        </Typography>
      ) : null}
    </Box>
  );
};

const LegendDot = ({ label, color }) => (
  <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
    <Box sx={{ width: 12, height: 12, bgcolor: color, borderRadius: 0.5 }} />
    <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>
      {label}
    </Typography>
  </Stack>
);

const Activities = ({ date = dayjs().format('YYYY-MM-DD') }) => {
  const theme = useTheme();
  const workColor = theme.palette.primary.main;
  const pauseColor = theme.palette.primaryLight.main;
  const awayColor = theme.palette.grey[600];

  const colorForType = type => (type === 'work' ? workColor : type === 'away' ? awayColor : pauseColor);

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['activity-stats-by-date', date],
    queryFn: () => getActivityStatsByDate(date),
    refetchInterval: 15 * 60 * 1000,
    // Return a fresh reference on every refetch so the chart useMemo recomputes
    // even when the payload is structurally identical (in-progress entries depend on `dayjs()`).
    structuralSharing: false,
  });

  const chart = useMemo(() => buildChart(data?.[0]?.timeEntries), [data]);
  const isFetching = isLoading || isRefetching;

  const totalBillableSeconds = data?.[0]?.totalBillableSeconds || 0;

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" sx={{ mb: 1.5, alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Today&apos;s Activities
        </Typography>
        <MuiTooltip title={isFetching ? 'Getting Activities...' : 'Refresh Activities'} arrow>
          <IconButton color="primary" onClick={() => !isFetching && refetch()}>
            <SyncRoundedIcon />
          </IconButton>
        </MuiTooltip>
        <Box sx={{ flexGrow: 1 }} />
        <Chip
          label={`Billable: ${formatDuration(totalBillableSeconds)}`}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </Stack>

      {isLoading || !chart ? (
        <Box sx={{ minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {isLoading ? 'Loading…' : 'No activity found'}
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ width: '100%', minWidth: 0, height: 90, mb: 1 }}>
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={[chart.row]} layout="vertical" margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
                <XAxis
                  type="number"
                  domain={chart.domain}
                  ticks={chart.ticks}
                  tickFormatter={hourTick}
                  tick={{ fontSize: 11, fill: theme.palette.text.secondary }}
                  stroke={theme.palette.divider}
                  allowDataOverflow
                />
                <YAxis type="category" dataKey="_row" hide />
                <Tooltip shared={false} cursor={{ fill: 'transparent' }} content={<ActivityTooltip entries={chart.entries} />} />
                <BarStack stackId="t" radius={5}>
                  {chart.entries.map((entry, i) => (
                    <Bar key={i} dataKey={`r${i}`} fill={colorForType(entry.type)} isAnimationActive={false} minPointSize={6} />
                  ))}
                </BarStack>
              </BarChart>
            </ResponsiveContainer>
          </Box>
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center' }}>
            <LegendDot label="Work" color={workColor} />
            <LegendDot label="Pause" color={pauseColor} />
            <LegendDot label="Away/Offline" color={awayColor} />
          </Stack>
        </>
      )}
    </Paper>
  );
};

export default Activities;
