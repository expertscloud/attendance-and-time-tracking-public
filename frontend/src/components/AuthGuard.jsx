import { Navigate } from 'react-router-dom';
import { getLocalStorageItem } from '@/utils/helpers';
import { useEffect, useState } from 'react';
import { fetchUserByAuthToken } from '@/pages/auth/AuthApiCalls';
import { ClimbingLoader } from '@/theme/Loader/Loader';
import MainTheme from '@/theme/mainTheme/MainTheme';

const AuthGuard = () => {
  const authToken = getLocalStorageItem('authentication_token');
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    (async () => {
      if (authToken) {
        const isValidUser = await fetchUserByAuthToken();
        if (isValidUser) {
          setIsVerifying(false);
        }
      }
    })();
  }, [authToken]);

  if (!authToken) {
    return <Navigate to="/sign-in" replace />;
  }

  return isVerifying ? <ClimbingLoader /> : <MainTheme />;
};

export default AuthGuard;
