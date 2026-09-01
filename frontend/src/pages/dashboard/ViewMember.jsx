import { useState } from 'react';
import { Button } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import ViewMemberDialog from './ViewMemberDialog';

const ViewMember = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setIsDialogOpen(true)} startIcon={<GroupsIcon />} sx={{ boxShadow: 0 }}>
        View Members
      </Button>

      {isDialogOpen ? <ViewMemberDialog onClose={() => setIsDialogOpen(false)} /> : null}
    </>
  );
};

export default ViewMember;
