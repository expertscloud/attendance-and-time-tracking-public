import { Outlet } from 'react-router-dom';
import { Box, useTheme } from '@mui/material';
import { COLLAPSED_SIDEBAR_WIDTH, HEADER_HEIGHT, SIDEBAR_WIDTH } from '@/utils/constants';
import { useSelector } from 'react-redux';

const MainBody = () => {
  const theme = useTheme();
  const sidebarCompact = useSelector(state => state.ThemeOptions.sidebarCompact);

  return (
    <Box
      sx={{
        ml: { xs: 0, md: (sidebarCompact ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH) + 'px' },
        mt: HEADER_HEIGHT + 'px',
        p: { xs: '10px', md: '10px 20px' },
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      <Outlet />
    </Box>
  );
};

export default MainBody;
