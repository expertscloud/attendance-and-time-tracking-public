import { useState } from 'react';
import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import InputField from '@/shared/InputField';
import LeaveTypeFormModal from './LeaveTypeFormModal';
import { fetchLeaveTypes } from './LeaveTypeApiCalls';

const LeaveTypesHeader = ({ searchedText, setSearchedText }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const handleRefresh = async () => {
    if (!isFetching) {
      setIsFetching(true);
      await fetchLeaveTypes();
      setIsFetching(false);
    }
  };

  const handleReset = () => {
    setSearchedText('');
  };

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', my: 1.5, gap: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Leave Types
          </Typography>
          <Tooltip title={isFetching ? 'Getting Fresh Leave Types...' : 'Refresh Leave Types'} arrow>
            <IconButton color="primary" onClick={handleRefresh} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
              <SyncRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Leave Type" arrow>
            <IconButton color="primary" onClick={() => setIsAddOpen(true)} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
              <AddCircleOutlineOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InputField placeholder="Search here..." value={searchedText} onChange={e => setSearchedText(e.target.value)} fullWidth={false} />
          <Button variant="contained" size="small" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </Stack>

      {isAddOpen ? <LeaveTypeFormModal onClose={() => setIsAddOpen(false)} /> : null}
    </>
  );
};

export default LeaveTypesHeader;
