import { memo } from 'react';
import { Stack } from '@mui/material';
import Settings from './Settings';
import HeaderLogo from './HeaderLogo';

const HeaderContent = () => {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', px: '15px' }}>
      <HeaderLogo />
      <Settings />
    </Stack>
  );
};

export default memo(HeaderContent);
