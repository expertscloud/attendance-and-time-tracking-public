import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { ClimbingLoader } from '@/theme/Loader/Loader';
import AuthGuard from '@/components/AuthGuard';
import PublicLayout from '@/components/PublicLayout';

const SignIn = lazy(() => import('@/pages/signIn/SignIn'));
const ForgotPassword = lazy(() => import('@/pages/forgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/resetPassword/ResetPassword'));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard'));

const Routes = () => {
  const routes = useRoutes([
    {
      element: <AuthGuard />,
      children: [
        { element: <Navigate to="/dashboard" replace />, index: true },
        { path: '/dashboard', element: <Dashboard /> },
      ],
    },
    {
      element: <PublicLayout />,
      children: [
        { path: '/sign-in', element: <SignIn /> },
        { path: '/forgot-password', element: <ForgotPassword /> },
        { path: '/reset-password', element: <ResetPassword /> },
      ],
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ]);

  return <Suspense fallback={<ClimbingLoader />}>{routes}</Suspense>;
};

export default Routes;
