import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';

const ONE_HOUR = 3600;

const formatHours = seconds => {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0h 0m';
  const hours = Math.floor(seconds / ONE_HOUR);
  const minutes = Math.floor((seconds % ONE_HOUR) / 60);
  return `${hours}h ${minutes}m`;
};

const StatCard = ({ icon, label, value, helper, accent, isLoading }) => (
  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
    <Box
      sx={{
        p: 2.5,
        height: '100%',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
        borderLeft: `4px solid ${accent}`,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 },
      }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        {isLoading ? (
          <Skeleton variant="circular" width={44} height={44} />
        ) : (
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: `${accent}22`,
              color: accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        )}
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {isLoading ? <Skeleton width={120} /> : label}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
            {isLoading ? <Skeleton height={28} width={80} /> : value}
          </Typography>
          {isLoading ? (
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              <Skeleton width={90} />
            </Typography>
          ) : helper ? (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {helper}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </Box>
  </Grid>
);

const computeAverage = (stats, days) => {
  if (!stats?.attendances?.length) return { avgSeconds: 0, workedDays: 0 };

  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - (days - 1));

  const inRange = stats.attendances.filter(a => {
    if (!a.checkInTime) return false;
    const d = new Date(a.checkInTime);
    return d >= cutoff;
  });

  if (!inRange.length) return { avgSeconds: 0, workedDays: 0 };

  const totalSeconds = inRange.reduce((sum, a) => sum + (a.totalWorkingSeconds || 0), 0);
  return { avgSeconds: totalSeconds / inRange.length, workedDays: inRange.length };
};

const UserStatCards = ({ stats, isLoading }) => {
  const weekly = computeAverage(stats, 7);
  const monthly = computeAverage(stats, 30);
  const totalDays = stats?.totalDays || 0;

  return (
    <Grid container spacing={2}>
      <StatCard
        icon={<AccessTimeRoundedIcon />}
        label="Avg Daily (Last 7 days)"
        value={formatHours(weekly.avgSeconds)}
        helper={`${weekly.workedDays} day${weekly.workedDays === 1 ? '' : 's'} worked`}
        accent="#063465"
        isLoading={isLoading}
      />
      <StatCard
        icon={<CalendarTodayRoundedIcon />}
        label="Avg Daily (Last 30 days)"
        value={formatHours(monthly.avgSeconds)}
        helper={`${monthly.workedDays} day${monthly.workedDays === 1 ? '' : 's'} worked`}
        accent="#1E4E8A"
        isLoading={isLoading}
      />
      <StatCard
        icon={<DateRangeRoundedIcon />}
        label="Total Days Worked"
        value={totalDays.toString()}
        helper="In selected range"
        accent="#1976d2"
        isLoading={isLoading}
      />
    </Grid>
  );
};

export default UserStatCards;
