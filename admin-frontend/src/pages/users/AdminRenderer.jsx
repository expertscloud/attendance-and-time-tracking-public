import { useState } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useSelector } from 'react-redux';
import { userTypeEnum } from '@/utils/constants';
import UserRoleDialog from './UserRoleDialog';

const AdminRenderer = ({ data }) => {
  const [open, setOpen] = useState(false);

  const userDetail = useSelector(state => state.User?.userDetail);
  const isSuperAdmin = userDetail?.type === userTypeEnum.SuperAdmin;

  const isAdmin = data.type === userTypeEnum.Admin || data.type === userTypeEnum.SuperAdmin;

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      {isSuperAdmin ? (
        <>
          <Tooltip title="Edit Role" placement="top">
            <IconButton
              size="small"
              color="primary"
              onClick={e => {
                e.stopPropagation();
                setOpen(true);
              }}
              sx={{ ml: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {open && <UserRoleDialog closeDialog={() => setOpen(false)} data={data} />}
        </>
      ) : null}
      {isAdmin ? <CheckCircleIcon color="success" /> : null}
    </div>
  );
};

export default AdminRenderer;
