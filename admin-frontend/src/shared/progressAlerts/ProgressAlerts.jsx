import SnackbarAlert from './SnackbarAlert';
import LoadingBackdrop from './LoadingBackdrop';
import TimTimLoader from './TimTimLoader';

const ProgressAlerts = () => {
  return (
    <>
      <SnackbarAlert />
      <LoadingBackdrop />
      <TimTimLoader />
    </>
  );
};

export default ProgressAlerts;
