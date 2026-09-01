import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';
import { ClimbingLoader } from '@/theme/Loader/Loader';
import AuthGuard from '@/components/AuthGuard';
import PublicLayout from '@/components/PublicLayout';

const Users = lazy(() => import('@/pages/users/Users'));
const UserDetails = lazy(() => import('@/pages/users/UserDetails'));
const Projects = lazy(() => import('@/pages/projects/Projects'));
const Clients = lazy(() => import('@/pages/clients/Clients'));
const Attendance = lazy(() => import('@/pages/attendances/Attendance'));
const Leaves = lazy(() => import('@/pages/leaves/Leaves'));
const LeaveTypes = lazy(() => import('@/pages/leaveTypes/LeaveTypes'));
const ChangePassword = lazy(() => import('@/pages/changePassword/ChangePassword'));
const SignIn = lazy(() => import('@/pages/signIn/SignIn'));
const SignUp = lazy(() => import('@/pages/signUp/SignUp'));
const ForgotPassword = lazy(() => import('@/pages/forgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/resetPassword/ResetPassword'));

const Routes = () => {
  const routes = useRoutes([
    {
      element: <AuthGuard />,
      children: [
        { element: <Navigate to="/attendance" />, index: true },
        { path: '/attendance', element: <Attendance /> },
        { path: '/leaves', element: <Leaves /> },
        { path: '/leave-types', element: <LeaveTypes /> },
        { path: '/users', element: <Users /> },
        { path: '/users/details/:userId', element: <UserDetails /> },
        { path: '/projects', element: <Projects /> },
        { path: '/clients', element: <Clients /> },
        { path: '/change-password', element: <ChangePassword /> },
      ],
    },
    {
      element: <PublicLayout />,
      children: [
        { path: '/sign-in', element: <SignIn /> },
        { path: '/sign-up', element: <SignUp /> },
        { path: '/forgot-password', element: <ForgotPassword /> },
        { path: '/reset-password', element: <ResetPassword /> },
      ],
    },
    { path: '*', element: <Navigate to="/" /> },
  ]);

  return <Suspense fallback={<ClimbingLoader />}>{routes}</Suspense>;
};

export default Routes;
