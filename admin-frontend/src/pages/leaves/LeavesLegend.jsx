import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';

const LeavesLegend = () => {
  const leaveTypes = useSelector(state => state.MasterData.leaveTypes);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', justifyContent: 'center', px: 1, pt: '15px' }}>
      {leaveTypes
        .filter(type => type.allowance > 0)
        .map(({ color, label, allowance }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, borderRadius: 0.5, backgroundColor: color, border: '1px solid', borderColor: 'divider' }} />
            <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500 }}>
              Allowed {label} Leaves
            </Typography>
            <Typography sx={{ color, fontWeight: 'bold', fontSize: 'small' }}>{allowance}</Typography>
          </Box>
        ))}
    </Box>
  );
};

export default LeavesLegend;
