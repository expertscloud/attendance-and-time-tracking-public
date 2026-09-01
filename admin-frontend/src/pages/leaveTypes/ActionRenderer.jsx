import { useState } from 'react';
import { IconButton, Stack, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LeaveTypeFormModal from './LeaveTypeFormModal';
import LeaveTypeDeleteDialog from './LeaveTypeDeleteDialog';

const ActionRenderer = ({ data }) => {
  const [dialog, setDialog] = useState(null);
  const isDefault = Boolean(data?.isDefault);

  return (
    <>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', height: '100%' }}>
        <Tooltip title="Edit Leave Type" arrow>
          <IconButton size="small" color="primary" onClick={() => setDialog('edit')}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {!isDefault ? (
          <Tooltip title="Delete Leave Type" arrow>
            <IconButton size="small" color="error" onClick={() => setDialog('delete')}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null}
      </Stack>
      {dialog === 'edit' ? <LeaveTypeFormModal onClose={() => setDialog(null)} selectedType={data} /> : null}
      {dialog === 'delete' ? <LeaveTypeDeleteDialog closeDialog={() => setDialog(null)} targetType={data} /> : null}
    </>
  );
};

export default ActionRenderer;
