import { Box, Button, Typography, Link as MuiLink } from '@mui/material';
import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { handleSignIn } from '../auth/AuthApiCalls';
import PasswordInputField from '@/shared/PasswordInputField';
import InputField from '@/shared/InputField';
import { getLocalStorageItem } from '@/utils/helpers';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
});

const SignInForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: getLocalStorageItem('last_sign_in_email', '') || '', password: '' },
    validationSchema: validationSchema,
    onSubmit: async values => {
      const isSuccess = await handleSignIn(values);
      if (isSuccess) navigate('/dashboard', { replace: true });
    },
  });

  return (
    <Box sx={{ p: { xs: 5, lg: 12 }, width: '100%', maxWidth: '800px' }}>
      <Typography sx={{ fontWeight: '500', fontSize: '28px' }} gutterBottom>
        Welcome back
      </Typography>
      <Typography sx={{ fontWeight: '400', fontSize: '16px', color: 'text.secondary', mb: 3 }}>
        Please sign-in to your account and start the adventure.
      </Typography>

      <form onSubmit={formik.handleSubmit} noValidate autoComplete="off" style={{ marginTop: '20px' }}>
        <InputField formik={formik} name="email" label="Email Address" />
        <PasswordInputField formik={formik} name="password" label="Password" size="small" />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <MuiLink component={Link} to="/forgot-password" variant="body2" sx={{ textDecoration: 'none' }}>
            Forgot Password?
          </MuiLink>
        </Box>
        <Button size="large" type="submit" fullWidth variant="contained" sx={{ my: 2 }} loading={formik.isSubmitting}>
          Sign In
        </Button>
      </form>
    </Box>
  );
};

export default SignInForm;
