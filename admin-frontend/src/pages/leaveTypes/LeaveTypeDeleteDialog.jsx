import { useState } from 'react';
import { Button, DialogContent, DialogActions, Typography, Divider } from '@mui/material';
import AppDialog from '@/components/AppDialog';
import { deleteLeaveTypeApi } from './LeaveTypeApiCalls';

const LeaveTypeDeleteDialog = ({ closeDialog, targetType }) => {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);
    const success = await deleteLeaveTypeApi(targetType?.id);
    if (success) {
      closeDialog();
    }
    setLoading(false);
  };

  return (
    <AppDialog onClose={closeDialog}>
      <DialogContent sx={{ p: '30px 10px', textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Confirmation
        </Typography>
        <Typography variant="body2">
          Are you sure you want to delete leave type <strong>{targetType?.label}</strong>?
        </Typography>
      </DialogContent>
      <Divider sx={{ mb: 2 }} />
      <DialogActions>
        <Button fullWidth variant="outlined" onClick={closeDialog}>
          No
        </Button>
        <Button loading={loading} fullWidth variant="contained" onClick={onDelete}>
          Yes
        </Button>
      </DialogActions>
    </AppDialog>
  );
};

export default LeaveTypeDeleteDialog;
