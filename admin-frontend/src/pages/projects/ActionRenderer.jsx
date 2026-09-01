import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ProjectDeleteDialog from './ProjectDeleteDialog';
import ProjectForm from './ProjectForm';
import { deleteProject } from './ProjectsApiCalls';

const ActionRenderer = ({ data }) => {
  const [dialog, setDialog] = useState(null);

  const handleDelete = async () => {
    await deleteProject(data.id);
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
      {dialog === 'edit' ? <ProjectForm onClose={() => setDialog(null)} projectData={data} /> : null}
      {dialog === 'delete' ? <ProjectDeleteDialog closeDialog={() => setDialog(null)} handleDelete={handleDelete} /> : null}
    </>
  );
};

export default ActionRenderer;
