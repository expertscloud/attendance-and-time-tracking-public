import { Box, Grid } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import Timer from './Timer';
import Activities from './Activities';
import AttendanceLogs from './AttendanceLogs';
import QuickAttendanceInfo from './QuickAttendanceInfo';
import { getCurrentAttendance } from './AttendanceApiCalls';
import { useElectronIPC } from '@/hooks/useElectronIPC';
import usePausedReminder from '@/hooks/usePausedReminder';
import { config } from '@/config/config';
import UserDetailsInfo from './UserDetailsInfo';
import { ClimbingLoader } from '@/theme/Loader/Loader';
import useLocationSnapshot from '@/hooks/useLocationSnapshot';
import useNotificationPermission from '@/hooks/useNotificationPermission';

const Dashboard = () => {
  useElectronIPC();
  usePausedReminder();
  useLocationSnapshot();
  useNotificationPermission();

  const { isLoading } = useQuery({
    queryKey: ['current-attendance'],
    queryFn: getCurrentAttendance,
    refetchOnMount: 'always',
    refetchInterval: config.currentAttendanceIntervalInMS,
    staleTime: 0,
  });

  if (isLoading) return <ClimbingLoader />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <UserDetailsInfo />
      <QuickAttendanceInfo />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Timer />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Activities />
          <AttendanceLogs />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
