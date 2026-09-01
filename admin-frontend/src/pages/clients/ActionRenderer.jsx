import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClientDeleteDialog from './ClientDeleteDialog';
import ClientForm from './ClientForm';
import { deleteClient } from './ClientsApiCalls';

const ActionRenderer = ({ data }) => {
  const [dialog, setDialog] = useState(null);

  const handleDelete = async () => {
    await deleteClient(data.id);
  };

  return (
    <>
      <Tooltip title="Edit" placement="top">
        <IconButton color="primary" onClick={() => setDialog('edit')}>
          <EditIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete" placement="right">
        <IconButton color="error" onClick={() => setDialog('delete')}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
      {dialog === 'edit' ? <ClientForm onClose={() => setDialog(null)} clientData={data} /> : null}
      {dialog === 'delete' ? <ClientDeleteDialog closeDialog={() => setDialog(null)} handleDelete={handleDelete} /> : null}
    </>
  );
};

export default ActionRenderer;
