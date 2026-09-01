import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MobileSidebar from './MobileSidebar';
import DesktopSidebar from './DesktopSidebar';

const Sidebar = () => {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  return isMdDown ? <MobileSidebar /> : <DesktopSidebar />;
};

export default Sidebar;
