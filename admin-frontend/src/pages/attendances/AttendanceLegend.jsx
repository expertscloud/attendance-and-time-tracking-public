import { Box, Typography } from '@mui/material';
import { ATTENDANCE_LEGEND_ITEMS } from '@/utils/constants';

const AttendanceLegend = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', justifyContent: 'center', px: 1, pt: '15px' }}>
      {ATTENDANCE_LEGEND_ITEMS.map(({ color, label }) => (
        <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, borderRadius: 0.5, backgroundColor: color, border: '1px solid', borderColor: 'divider' }} />
          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
            {label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AttendanceLegend;
