import { Box, Button, Typography } from '@mui/material';
import CustomLink from '@/components/CustomLink';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { handleSignIn } from '../auth/AuthApiCalls';
import PasswordInputField from '@/shared/PasswordInputField';
import InputField from '@/shared/InputField';

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
});

const SignInForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: validationSchema,
    onSubmit: async values => {
      const isSuccess = await handleSignIn(values);
      if (isSuccess) navigate('/attendance', { replace: true });
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
        <PasswordInputField formik={formik} name="password" label="Password" size="small" autoComplete />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <CustomLink to="/forgot-password" sx={{ fontSize: '13px', fontWeight: 500 }}>
            Forgot Password?
          </CustomLink>
        </Box>
        <Button size="large" type="submit" fullWidth variant="contained" sx={{ my: 2 }} loading={formik.isSubmitting}>
          Sign In
        </Button>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}>
          New on our platform? <CustomLink to="/sign-up">Create a New Account</CustomLink>
        </Typography>
      </form>
    </Box>
  );
};

export default SignInForm;
