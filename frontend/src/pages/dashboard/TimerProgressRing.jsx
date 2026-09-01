import { Box, CircularProgress, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

const WORKDAY_SECONDS = 8 * 3600; // 8 hours
const RING_SIZE = 270;
const RING_THICKNESS = 1;

const getThumbPosition = progress => {
  const radius = ((44 - RING_THICKNESS) / 2) * (RING_SIZE / 44);
  const angle = (progress / 100) * 2 * Math.PI;
  return {
    left: RING_SIZE / 2 + radius * Math.sin(angle),
    top: RING_SIZE / 2 - radius * Math.cos(angle),
  };
};

const TimerProgressRing = ({ isPaused, heading, children }) => {
  const elapsedSeconds = useSelector(state => state.Attendance.elapsedSeconds);
  const progress = Math.min(100, ((elapsedSeconds ?? 0) / WORKDAY_SECONDS) * 100);
  const thumbColor = isPaused ? 'primaryLight.main' : 'primary.main';
  const thumbPosition = getThumbPosition(progress);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 1, md: 1.5 } }}>
      <Box sx={{ position: 'relative', display: 'inline-flex', width: RING_SIZE, height: RING_SIZE }}>
        <CircularProgress
          variant="determinate"
          value={progress}
          size={RING_SIZE}
          thickness={RING_THICKNESS}
          sx={{ color: thumbColor, opacity: 0.9, zIndex: 1 }}
        />
        <CircularProgress
          variant="determinate"
          value={100}
          size={RING_SIZE}
          thickness={RING_THICKNESS}
          sx={{ color: 'grey.200', position: 'absolute', left: 0, top: 0 }}
        />
        {progress > 0 ? (
          <Box
            sx={{
              position: 'absolute',
              left: thumbPosition.left,
              top: thumbPosition.top,
              width: 14,
              height: 14,
              borderRadius: '50%',
              bgcolor: thumbColor,
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
              boxShadow: theme => `0 0 0 3px ${theme.palette.background.paper}`,
            }}
          />
        ) : null}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 1, letterSpacing: 0.3, textAlign: 'center' }}>
            {heading}
          </Typography>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
export default TimerProgressRing;
