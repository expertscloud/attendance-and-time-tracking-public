import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import DateRangeFilter from '@/shared/DateRangeFilter';
import InputField from '@/shared/InputField';
import { getPresetRange } from '@/utils/helpers';

const LeavesHeader = ({ refetch, isFetching, range, onChange, searchedText, setSearchedText }) => {
  const handleRefresh = () => {
    if (!isFetching) refetch();
  };

  const handleReset = () => {
    setSearchedText('');
    onChange(getPresetRange('YTD'));
  };

  return (
    <Box sx={{ my: 1.5 }}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Leave Records
          </Typography>
          <Tooltip title={isFetching ? 'Refreshing...' : 'Refresh'} arrow>
            <IconButton color="primary" onClick={handleRefresh} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
              <SyncRoundedIcon />
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
            <Button variant="contained" size="small" onClick={handleReset} sx={{ whiteSpace: 'nowrap', px: 2 }}>
              Reset
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default LeavesHeader;
