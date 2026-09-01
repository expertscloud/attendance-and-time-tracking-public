import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import UserDeleteDialog from './UserDeleteDialog';
import UserForm from './UserForm';
import { deleteUser } from './UsersApiCalls';

const ActionRenderer = ({ data }) => {
  const navigate = useNavigate();
  const [dialog, setDialog] = useState(null);

  const handleDelete = async () => {
    await deleteUser(data.id);
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
      <Tooltip title="Show Details" placement="left">
        <IconButton color="primary" onClick={() => navigate(`/users/details/${data.id}`)}>
          <OpenInNewIcon />
        </IconButton>
      </Tooltip>
      {dialog === 'edit' ? <UserForm onClose={() => setDialog(null)} userData={data} /> : null}
      {dialog === 'delete' ? <UserDeleteDialog closeDialog={() => setDialog(null)} handleDelete={handleDelete} /> : null}
    </>
  );
};

export default ActionRenderer;
