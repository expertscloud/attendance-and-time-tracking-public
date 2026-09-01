import { useMemo } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import PaperBox from '@/components/PaperBox';
import dayjs from 'dayjs';
import LeaveCalendarView from './LeaveCalendarView';

const getMonthsInRange = (startDate, endDate) => {
  let curr = dayjs(startDate).startOf('month');
  const last = dayjs(endDate).startOf('month');
  const months = [];
  while (!curr.isAfter(last)) {
    months.push({ year: curr.year(), month: curr.month() + 1, label: curr.format('MMMM YYYY') });
    curr = curr.add(1, 'month');
  }
  return months;
};

const LeaveCalendarSection = ({ isLoading, range = {}, leaves = [] }) => {
  const months = useMemo(() => getMonthsInRange(range.startDate, range.endDate), [range.startDate, range.endDate]);

  return (
    <PaperBox sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 0, overflow: 'hidden' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
          <CircularProgress />
        </Box>
      ) : months.length === 1 ? (
        <LeaveCalendarView year={months[0].year} month={months[0].month} leaves={leaves} />
      ) : (
        <Box sx={{ p: 3, overflowY: 'auto' }}>
          <Grid container spacing={3}>
            {months.map(({ year, month, label }) => (
              <Grid key={`${year}-${month}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                  <Box sx={{ px: 2, py: 1, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {label}
                    </Typography>
                  </Box>
                  <LeaveCalendarView year={year} month={month} compact leaves={leaves} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </PaperBox>
  );
};

export default LeaveCalendarSection;
