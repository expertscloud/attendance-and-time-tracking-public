import { Box, Divider } from '@mui/material';
import { iconStyle, StyledText } from './MultiLevelMenu';
import LogoutIcon from '@mui/icons-material/Logout';
import { handleLogout } from '@/utils/helpers';
import { NavItemButton } from './SidebarComponents';

const LogoutBox = ({ isCompact }) => {
  return (
    <Box sx={{ p: '0 7px' }}>
      <Divider sx={{ borderWidth: '1px', marginBottom: '4px' }} />
      <NavItemButton onClick={handleLogout}>
        <LogoutIcon sx={iconStyle()} />
        <StyledText compact={isCompact}>Log Out</StyledText>
      </NavItemButton>
    </Box>
  );
};

export default LogoutBox;
