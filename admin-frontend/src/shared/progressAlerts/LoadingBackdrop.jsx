import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import { useSelector } from 'react-redux';

const LoadingBackdrop = () => {
  const loadingBackdrop = useSelector(state => state.Alerts.loadingBackdrop);

  return loadingBackdrop ? (
    <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.tooltip + 2 }} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : null;
};

export default LoadingBackdrop;
