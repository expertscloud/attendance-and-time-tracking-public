import { useState } from 'react';
import { Box, useTheme } from '@mui/material';
import MultiLevelMenu from './MultiLevelMenu';
import { COLLAPSED_SIDEBAR_WIDTH, SIDEBAR_WIDTH } from '@/utils/constants';
import { useSelector } from 'react-redux';

const DesktopSidebar = () => {
  const theme = useTheme();
  const [onHover, setOnHover] = useState(false);
  const sidebarCompact = useSelector(state => state.ThemeOptions.sidebarCompact);

  return (
    <Box
      sx={{
        height: '100%',
        width: sidebarCompact ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH,
        zIndex: theme.zIndex.drawer,
        backgroundColor: theme.palette.background.paper,
        position: 'fixed',
        transition: 'all .2s ease',
        '&:hover': sidebarCompact && { width: SIDEBAR_WIDTH },
      }}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      <MultiLevelMenu sidebarCompact={sidebarCompact && !onHover} />
    </Box>
  );
};

export default DesktopSidebar;
