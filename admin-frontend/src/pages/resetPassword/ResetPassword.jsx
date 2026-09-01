import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Grid } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthCard from '@/shared/AuthCard';
import { resetPassword } from '../auth/AuthApiCalls';
import Description from '../signIn/Description';
import ResetPasswordForm from './ResetPasswordForm';

const validationSchemaPassword = Yup.object().shape({
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords not matched')
    .required('Confirm Password is required'),
});

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema: validationSchemaPassword,
    enableReinitialize: true,
    onSubmit: async values => {
      const email = searchParams.get('email') || '';
      const isSuccess = await resetPassword(email, token, values.password);
      if (isSuccess) navigate('/sign-in', { replace: true });
    },
  });

  return (
    <Grid container sx={{ minHeight: '100vh', px: 1 }}>
      <Grid size={{ xs: 12, md: 6 }} sx={{ my: 1 }}>
        <AuthCard>
          <Description />
        </AuthCard>
      </Grid>
      <Grid
        component="form"
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
        noValidate
        autoComplete="off"
        size={{ xs: 12, md: 6 }}
        container
        sx={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <ResetPasswordForm formik={formik} />
      </Grid>
    </Grid>
  );
};

export default ResetPassword;
