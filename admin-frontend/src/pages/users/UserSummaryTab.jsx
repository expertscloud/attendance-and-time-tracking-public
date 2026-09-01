import Activities from './Activities';
import { fetchUserStats } from './UsersApiCalls';
import UserStatCards from './UserStatCards';
import UserWorkChart from './UserWorkChart';
import { useQuery } from '@tanstack/react-query';

const UserSummaryTab = ({ parsedUserId, range }) => {
  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['user-stats-chart', parsedUserId, range.startDate, range.endDate],
    queryFn: () => fetchUserStats(parsedUserId, range),
    enabled: Boolean(range.startDate) && Boolean(range.endDate),
  });

  return (
    <>
      <UserStatCards stats={stats} isLoading={isStatsLoading} />
      <UserWorkChart stats={stats} isLoading={isStatsLoading} startDate={range.startDate} endDate={range.endDate} />
      <Activities userId={parsedUserId} />
    </>
  );
};

export default UserSummaryTab;
