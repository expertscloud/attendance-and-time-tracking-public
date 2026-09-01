import { Box, Typography } from '@mui/material';

const StatBox = ({ icon: Icon, label, value, color }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 1,
        bgcolor: 'action.hover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Icon sx={{ fontSize: 24, color }} />
    </Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}>
        {label}
      </Typography>
      <Typography sx={{ fontWeight: 600, color: 'primary.main', fontSize: 14, lineHeight: 1.4 }}>{value}</Typography>
    </Box>
  </Box>
);

export default StatBox;
