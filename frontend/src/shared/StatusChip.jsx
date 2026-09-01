import { Chip } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const StatusChip = ({ color = 'default', label, pulse = false, sx = {}, iconSx = {}, ...props }) => {
  return (
    <Chip
      size="small"
      color={color}
      variant="outlined"
      icon={
        <FiberManualRecordIcon
          sx={{
            animation: pulse ? 'tt-pulse 1.4s ease-in-out infinite' : 'none',
            '@keyframes tt-pulse': { '0%, 100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.4, transform: 'scale(0.85)' } },
            ...iconSx,
          }}
        />
      }
      label={label}
      sx={{ fontWeight: 600, ...sx }}
      {...props}
    />
  );
};

export default StatusChip;
