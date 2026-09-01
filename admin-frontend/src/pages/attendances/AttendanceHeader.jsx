import { Box, Button, Checkbox, FormControlLabel, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import DateRangeFilter from '@/shared/DateRangeFilter';
import InputField from '@/shared/InputField';
import ExportExcel from '@/shared/ExportExcel';
import { getPresetRange } from '@/utils/helpers';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useState } from 'react';
import AttendanceLocationsDialog from './AttendanceLocationsDialog';

const AttendanceHeader = ({
  refetch,
  isFetching,
  range,
  onChange,
  searchedText,
  setSearchedText,
  users,
  dateKeys,
  hideHolidaysColumns,
  setHideHolidaysColumns,
}) => {
  const [locationsDialogOpen, setLocationsDialogOpen] = useState(false);
  const handleRefresh = () => {
    if (!isFetching) refetch();
  };
  const handleReset = () => {
    setSearchedText('');
    onChange(getPresetRange('1M'));
  };
  return (
    <Box sx={{ my: 1.5 }}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Attendance
          </Typography>
          <Tooltip title={isFetching ? 'Refreshing...' : 'Refresh'} arrow>
            <IconButton color="primary" onClick={handleRefresh} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
              <SyncRoundedIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="View users locations" arrow>
            <IconButton
              color="primary"
              onClick={() => setLocationsDialogOpen(true)}
              sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}
            >
              <LocationOnIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1}>
          <DateRangeFilter startDate={range.startDate} endDate={range.endDate} onChange={onChange} />
          <Box sx={{ display: 'flex', alignItems: 'center', width: 'fit-content', gap: 1 }}>
            <InputField
              placeholder="Search here..."
              value={searchedText}
              onChange={e => setSearchedText(e.target.value)}
              fullWidth={false}
            />
            <Button variant="contained" size="small" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Stack>

        {locationsDialogOpen ? (
          <AttendanceLocationsDialog defaultDate={range.endDate} onClose={() => setLocationsDialogOpen(false)} />
        ) : null}
      </Stack>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1} sx={{ alignItems: 'center', justifyContent: 'end', mt: 1 }}>
        <FormControlLabel
          control={<Checkbox checked={hideHolidaysColumns} onChange={e => setHideHolidaysColumns(e.target.checked)} size="small" />}
          label="Hide Weekends"
        />
        <ExportExcel users={users} dateKeys={dateKeys} />
      </Stack>
    </Box>
  );
};

export default AttendanceHeader;
