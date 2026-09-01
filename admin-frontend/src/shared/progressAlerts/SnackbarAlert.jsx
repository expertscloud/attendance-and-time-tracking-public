import { useCallback } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { setSnackbarObj } from '@/store/reducers/alertsSlice';

const SnackbarAlert = () => {
  const dispatch = useDispatch();
  const snackbarObj = useSelector(state => state.Alerts.snackbarObj);

  let autoHideDuration, anchorOrigin, severity, message;
  if (snackbarObj) {
    autoHideDuration = snackbarObj.autoHideDuration ?? 5000;
    anchorOrigin = snackbarObj.anchorOrigin ?? { vertical: 'bottom', horizontal: 'left' };
    severity = snackbarObj.severity ?? 'error';
    message = snackbarObj.message ?? 'Oops! Something unexpected happened.';
  }

  const handleClose = useCallback(
    (e, reason) => {
      if (reason !== 'clickaway') {
        dispatch(setSnackbarObj(null));
      }
    },
    [dispatch]
  );

  return snackbarObj ? (
    <Snackbar open={true} autoHideDuration={autoHideDuration} onClose={handleClose} anchorOrigin={anchorOrigin}>
      <Alert onClose={handleClose} variant="filled" severity={severity} elevation={6} style={{ whiteSpace: 'pre-line' }}>
        {message}
      </Alert>
    </Snackbar>
  ) : null;
};

export default SnackbarAlert;
