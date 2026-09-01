import MultiLevelMenu from './MultiLevelMenu';
import { useDispatch, useSelector } from 'react-redux';
import { SIDEBAR_WIDTH } from '@/utils/constants';
import { setSidebarCompact } from '@/store/reducers/themeOptionsSlice';
import { Box, Drawer, useTheme } from '@mui/material';
import HeaderLogo from '@/theme/header/HeaderLogo';

const MobileSidebar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const sidebarCompact = useSelector(state => state.ThemeOptions.sidebarCompact);

  const closeSidebar = () => {
    dispatch(setSidebarCompact());
  };

  return (
    <Drawer anchor="left" open={!sidebarCompact} onClose={closeSidebar} slotProps={{ paper: { sx: { width: SIDEBAR_WIDTH } } }}>
      <Box sx={{ height: '100%', width: 'inherit', position: 'fixed', overflow: 'hidden', zIndex: theme.zIndex.drawer + 3 }}>
        <HeaderLogo />
        <MultiLevelMenu />
      </Box>
    </Drawer>
  );
};

export default MobileSidebar;
