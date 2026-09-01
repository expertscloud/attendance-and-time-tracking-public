import { Button, DialogActions, DialogContent, Divider, Typography } from '@mui/material';
import AppDialog from '@/components/AppDialog';
import { checkOut } from './AttendanceApiCalls';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { WarningAmberOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const CheckOutConfirmDialog = ({ onClose }) => {
  const isLoading = useSelector(state => state.Attendance.isLoading);
  const onConfirm = async () => {
    await checkOut();
    onClose();
  };

  return (
    <AppDialog onClose={onClose}>
      <DialogContent sx={{ p: '30px 10px', textAlign: 'center' }}>
        <WarningAmberOutlined sx={{ fontSize: 52, color: 'error.main' }} />
        <Typography variant="h6" gutterBottom>
          Check Out
        </Typography>
        <Typography variant="body2">Are you sure you want to check out? This will end your work session for today.</Typography>
      </DialogContent>
      <Divider sx={{ mb: 2 }} />
      <DialogActions>
        <Button fullWidth variant="contained" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button loading={isLoading} fullWidth variant="outlined" onClick={onConfirm} startIcon={<LogoutOutlinedIcon />}>
          Check Out
        </Button>
      </DialogActions>
    </AppDialog>
  );
};

export default CheckOutConfirmDialog;
