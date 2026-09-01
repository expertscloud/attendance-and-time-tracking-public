import { memo } from 'react';
import { Stack } from '@mui/material';
import UserMenu from './UserMenu';
import HeaderLogo from './HeaderLogo';

const HeaderContent = () => {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
      <HeaderLogo />
      <UserMenu />
    </Stack>
  );
};

export default memo(HeaderContent);
