import { Stack, Typography } from '@mui/material';
import Logo from '@/assets/logo.png';
import { config } from '@/config/config';

const HeaderLogo = () => {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', position: 'relative' }}>
      <img src={Logo} alt="Tickly logo" width={130} style={{ display: 'block', height: 'auto' }} />
      <Typography sx={{ fontSize: 10, color: 'black', position: 'absolute', bottom: -6, right: 35 }}>{config.appVersion}</Typography>
    </Stack>
  );
};

export default HeaderLogo;
