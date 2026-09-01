import { Box, Typography } from '@mui/material';

const LeaveTypeNameRenderer = params => {
  const color = params.data?.color;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
      <Box sx={{ width: 14, height: 14, borderRadius: '3px', backgroundColor: color }} />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {params.value}
      </Typography>
    </Box>
  );
};

export default LeaveTypeNameRenderer;
