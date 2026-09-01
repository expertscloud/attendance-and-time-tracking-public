import { Box, Grid, Stack, Typography } from '@mui/material';
import PaperBox from '@/components/PaperBox';
import { config } from '@/config/config';
import ViewMember from './ViewMember';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import WbSunnyRoundedIcon from '@mui/icons-material/WbSunnyRounded';

const InfoCard = ({ icon, title, description }) => (
  <PaperBox sx={{ p: '14px 16px', borderRadius: '10px', boxShadow: 1, border: '1px solid rgba(0,0,0,0.04)' }}>
    <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: '10px',
          bgcolor: 'rgba(0,0,0,0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          {title}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
          {description}
        </Typography>
      </Box>
    </Stack>
  </PaperBox>
);

const QuickAttendanceInfo = () => {
  const idleMinutes = Math.max(0, Math.round(config.idleThresholdSeconds / 60));

  const cards = [
    { title: 'Check In/Out', description: 'Track your daily attendance', icon: <LoginRoundedIcon fontSize="small" /> },
    { title: 'Auto Tracking', description: 'Time tracked automatically', icon: <ScheduleRoundedIcon fontSize="small" /> },
    { title: 'Pause/Resume', description: 'Take breaks when needed', icon: <PauseRoundedIcon fontSize="small" /> },
    {
      title: 'Idle Detection',
      description: `${idleMinutes} min of inactivity will pause timer`,
      icon: <WbSunnyRoundedIcon fontSize="small" />,
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Quick Info
        </Typography>
        <ViewMember />
      </Box>

      <Grid container spacing={2}>
        {cards.map(card => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.title}>
            <InfoCard icon={card.icon} title={card.title} description={card.description} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickAttendanceInfo;
