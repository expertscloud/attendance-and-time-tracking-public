import { memo } from 'react';
import WarningIcon from '@mui/icons-material/Warning';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { handleLogout } from '@/utils/helpers';

const ErrorBoundaryDialog = () => {
  return (
    <Dialog open={true}>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <WarningIcon sx={{ mb: 2, fontSize: 100 }} color="error" />
          <Typography>An error has occurred while rendering. Please Reload the page.</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button fullWidth variant="contained" color={'error'} onClick={() => handleLogout()}>
          Reload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(ErrorBoundaryDialog);
