import { useState } from 'react';
import Header from '@/theme/header/Header';
import MainBody from './MainBody';
import UpdateAppDialog from '@/shared/progressAlerts/UpdateAppDialog';
import LocationPermissionDialog from '@/shared/progressAlerts/LocationPermissionDialog';
import { useQuery } from '@tanstack/react-query';
import { checkIsUpdateAvailable } from '@/pages/auth/AuthApiCalls';
import { checkGeolocationAccess } from '@/hooks/useLocationSnapshot';

const MainTheme = () => {
  const [isLocationDialogDismissed, setIsLocationDialogDismissed] = useState(false);

  const { data: isUpdateAvailable, isLoading } = useQuery({
    queryKey: ['get-app-version'],
    queryFn: checkIsUpdateAvailable,
    refetchInterval: 30 * 60 * 1000,
  });

  // Checked once on load only. No polling / focus refetch — the user enables
  // location in OS settings and then closes this dialog themselves.
  const { data: hasLocationAccess } = useQuery({
    queryKey: ['location-access'],
    queryFn: checkGeolocationAccess,
  });

  return (
    <>
      <Header />
      {!isLoading && isUpdateAvailable ? <UpdateAppDialog /> : <MainBody />}
      {hasLocationAccess === false && !isLocationDialogDismissed ? (
        <LocationPermissionDialog onClose={() => setIsLocationDialogDismissed(true)} />
      ) : null}
    </>
  );
};

export default MainTheme;
