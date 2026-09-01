import { Box, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import BeatLoader from 'react-spinners/BeatLoader';
import { HEADER_HEIGHT } from '@/utils/constants';

const TimTimLoader = () => {
  const theme = useTheme();
  const beatLoader = useSelector(state => state.Alerts.beatLoader);

  return beatLoader ? (
    <Box textAlign="center">
      <BeatLoader size={11} color={theme.palette.primary.main} style={{ position: 'absolute', top: HEADER_HEIGHT + 10 }} />
    </Box>
  ) : null;
};

export default TimTimLoader;
