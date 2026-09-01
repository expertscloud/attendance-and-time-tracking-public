import { useQuery } from '@tanstack/react-query';
import { Box } from '@mui/material';
import LeaveDetailCards from '@/pages/leaves/components/LeaveDetailCards';
import LeaveCalendarSection from '@/pages/leaves/components/LeaveCalendarSection';
import { fetchUserLeaves } from '@/pages/leaves/LeaveApiCalls';

const UserLeavesTab = ({ userId, range }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['user-leaves', userId, range.startDate, range.endDate],
    queryFn: fetchUserLeaves,
    enabled: Boolean(range.startDate) && Boolean(range.endDate),
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 4 }}>
      <LeaveDetailCards summary={data?.summary} />
      <LeaveCalendarSection isLoading={isLoading} range={range} leaves={data?.leaves || []} />
    </Box>
  );
};

export default UserLeavesTab;
