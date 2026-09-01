import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PaperBox from '@/components/PaperBox';
import { getPresetRange } from '@/utils/helpers';
import LeavesHeader from './LeavesHeader';
import LeavesTable from './LeavesTable';
import { fetchLeavesSummary } from './LeaveApiCalls';
import LeavesLegend from './LeavesLegend';

const Leaves = () => {
  const [range, setRange] = useState(() => getPresetRange('YTD'));
  const [searchedText, setSearchedText] = useState('');

  const {
    data: users = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['leaves-summary', range.startDate, range.endDate],
    queryFn: fetchLeavesSummary,
    enabled: Boolean(range.startDate) && Boolean(range.endDate),
    staleTime: 0,
  });

  return (
    <PaperBox sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <LeavesHeader
        refetch={refetch}
        isFetching={isRefetching || isLoading}
        range={range}
        onChange={setRange}
        searchedText={searchedText}
        setSearchedText={setSearchedText}
      />
      <LeavesTable isLoading={isRefetching || isLoading} users={users} searchedText={searchedText} />
      <LeavesLegend />
    </PaperBox>
  );
};

export default Leaves;
