import { Box } from '@mui/material';
import Logo from '@/assets/logo.png';
const AuthCard = ({ children }) => {
  return (
    <Box
      sx={{
        p: 5,
        height: '100%',
        backgroundColor: '#eeeeeefa',
        borderRadius: '56px',
      }}
    >
      <Box component="img" src={Logo} alt="Tickly logo" sx={{ width: 220, height: 'auto', display: 'block' }} />

      <Box
        sx={{
          flexDirection: 'column',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100% - 112px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AuthCard;
