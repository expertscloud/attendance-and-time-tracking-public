import { Box, Typography } from '@mui/material';
import { WEEKDAYS_FULL, WEEKDAYS_SHORT } from '@/utils/constants';

const WeekdayHeader = ({ compact = false, gap = 1 }) => {
  const weekdays = compact ? WEEKDAYS_SHORT : WEEKDAYS_FULL;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap, mb: gap }}>
      {weekdays.map((label, i) => (
        <Typography key={i} variant={compact ? 'caption' : 'body2'} color="text.secondary" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {label}
        </Typography>
      ))}
    </Box>
  );
};

export default WeekdayHeader;
