import { Box, Typography, Paper } from '@mui/material';

const LeaveCard = ({ label, count, color }) => (
  <Paper elevation={0} sx={{ height: '100%', p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
    <Typography sx={{ fontWeight: 600, color }}>{label}</Typography>
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1.5 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
        {count || 0}
      </Typography>
    </Box>
  </Paper>
);

export default LeaveCard;
