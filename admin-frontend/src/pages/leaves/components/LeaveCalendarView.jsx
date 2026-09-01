import { useMemo } from 'react';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { isWeekendDate } from '@/utils/helpers';
import CalendarCell from './CalendarCell';
import WeekdayHeader from './WeekdayHeader';

const LeaveCalendarView = ({ year, month, leaves = [], compact = false }) => {
  const monthDate = dayjs(`${year}-${String(month).padStart(2, '0')}-01`);
  const totalDays = monthDate.daysInMonth();
  const prefixCount = monthDate.day();
  const gap = compact ? 0.5 : 1;

  const leavesMap = useMemo(() => new Map(leaves.map(leave => [dayjs(leave.date).format('YYYY-MM-DD'), leave])), [leaves]);

  return (
    <Box sx={{ p: compact ? 2 : 3, display: 'flex', flexDirection: 'column', gap }}>
      <WeekdayHeader compact={compact} gap={gap} />

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap }}>
        {Array.from({ length: prefixCount }).map((_, index) => (
          <Box key={`prefix-${index}`} sx={compact ? { aspectRatio: '1 / 1', width: '100%' } : { minHeight: 120 }} />
        ))}

        {Array.from({ length: totalDays }, (_, index) => {
          const day = index + 1;
          const formattedDate = monthDate.date(day).format('YYYY-MM-DD');
          const leave = leavesMap.get(formattedDate);

          return <CalendarCell key={day} day={day} leave={leave} isWeekend={isWeekendDate(formattedDate)} compact={compact} />;
        })}
      </Box>
    </Box>
  );
};

export default LeaveCalendarView;
