import { styled, useTheme } from '@mui/material/styles';
import { ClimbingBoxLoader } from 'react-spinners';

const LoaderWrapper = styled('div')(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 2001,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
}));

export const ClimbingLoader = () => {
  const theme = useTheme();
  return (
    <LoaderWrapper>
      <ClimbingBoxLoader color={theme.palette.primary.main} />
    </LoaderWrapper>
  );
};
