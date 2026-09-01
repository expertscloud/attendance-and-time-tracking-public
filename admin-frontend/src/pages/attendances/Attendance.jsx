import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PaperBox from '@/components/PaperBox';
import { getPresetRange, isWeekendDate } from '@/utils/helpers';
import AttendanceHeader from './AttendanceHeader';
import AttendanceTable from './AttendanceTable';
import AttendanceLegend from './AttendanceLegend';
import { fetchAttendances } from './AttendanceApiCalls';
import { buildAttendanceColumnDefs, getDateKeys } from './attendanceGridUtils';

export const filterHolidayColumns = (columnDefs = []) => {
  return columnDefs.filter(col => col.colId === 'fullName' || !isWeekendDate(col.colId));
};

const Attendance = () => {
  const [range, setRange] = useState(() => getPresetRange('1M'));
  const [searchedText, setSearchedText] = useState('');
  const [hideHolidaysColumns, setHideHolidaysColumns] = useState(true);

  const dateKeys = useMemo(() => getDateKeys(range), [range]);
  const columnDefs = useMemo(() => buildAttendanceColumnDefs(dateKeys), [dateKeys]);
  const visibleColumnDefs = useMemo(
    () => (hideHolidaysColumns ? filterHolidayColumns(columnDefs) : columnDefs),
    [columnDefs, hideHolidaysColumns]
  );

  const {
    data: users = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ['attendances-page', range.startDate, range.endDate],
    queryFn: () => fetchAttendances(range, dateKeys),
    enabled: Boolean(range.startDate) && Boolean(range.endDate),
    staleTime: 0,
  });

  return (
    <PaperBox sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AttendanceHeader
        refetch={refetch}
        isFetching={isRefetching || isLoading}
        range={range}
        onChange={setRange}
        searchedText={searchedText}
        setSearchedText={setSearchedText}
        users={users}
        dateKeys={dateKeys}
        hideHolidaysColumns={hideHolidaysColumns}
        setHideHolidaysColumns={setHideHolidaysColumns}
      />
      <AttendanceTable
        isLoading={isRefetching || isLoading}
        users={users}
        columnDefs={visibleColumnDefs}
        searchedText={searchedText}
        refetch={refetch}
      />
      <AttendanceLegend />
    </PaperBox>
  );
};

export default Attendance;
