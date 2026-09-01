import { getLocalStorageItem } from '@/utils/helpers';
import { Outlet, Navigate } from 'react-router-dom';

const PublicLayout = () => {
  const authToken = getLocalStorageItem('authentication_token');

  return authToken ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicLayout;
