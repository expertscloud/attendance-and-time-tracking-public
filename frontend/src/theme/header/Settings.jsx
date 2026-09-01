import { useState } from 'react';
import { IconButton, Stack, Tooltip } from '@mui/material';
import { handleLogout } from '@/utils/helpers';
import { KeyRounded, LogoutRounded } from '@mui/icons-material';
import ChangePasswordDialog from '@/pages/changePassword/ChangePasswordDialog';

const Settings = () => {
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Tooltip title="Change Password">
          <IconButton onClick={() => setIsChangePasswordOpen(true)}>
            <KeyRounded sx={{ color: 'primaryLight.main' }} />
          </IconButton>
        </Tooltip>

        <Tooltip title="Sign Out">
          <IconButton onClick={handleLogout}>
            <LogoutRounded color="primary" />
          </IconButton>
        </Tooltip>
      </Stack>

      {isChangePasswordOpen ? <ChangePasswordDialog onClose={() => setIsChangePasswordOpen(false)} /> : null}
    </>
  );
};

export default Settings;
