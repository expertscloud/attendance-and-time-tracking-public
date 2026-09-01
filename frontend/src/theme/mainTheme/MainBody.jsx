import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { HEADER_HEIGHT } from '@/utils/constants';
import { ClimbingLoader } from '@/theme/Loader/Loader';

const MainBody = () => {
  return (
    <Box
      sx={{
        mt: `${HEADER_HEIGHT}px`,
        p: { xs: '10px', md: '10px 20px' },
        minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
        maxWidth: '1200px',
        mx: 'auto',
      }}
    >
      <Suspense fallback={<ClimbingLoader />}>
        <Outlet />
      </Suspense>
    </Box>
  );
};

export default MainBody;
