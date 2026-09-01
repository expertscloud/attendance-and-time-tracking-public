import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { handleSignUp } from '@/pages/auth/AuthApiCalls';
import { Box, Button, Typography } from '@mui/material';
import CustomLink from '@/components/CustomLink';
import InputField from '@/shared/InputField';
import PasswordInputField from '@/shared/PasswordInputField';

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
});

const SignUpForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      const isSuccess = await handleSignUp(values);
      if (isSuccess) {
        navigate('/users', { replace: true });
      }
    },
  });

  return (
    <Box sx={{ p: { xs: 5, lg: 12 }, width: '100%', maxWidth: '800px' }}>
      <Typography gutterBottom sx={{ fontWeight: 500, fontSize: 28 }}>
        Create your account
      </Typography>

      <form onSubmit={formik.handleSubmit} noValidate autoComplete="off" style={{ marginTop: '20px' }}>
        <InputField formik={formik} name="fullName" label="Full Name" />

        <InputField formik={formik} name="email" label="Email Address" />

        <PasswordInputField formik={formik} name="password" label="Password" size="small" />

        <PasswordInputField formik={formik} name="confirmPassword" label="Confirm Password" size="small" />

        <Button size="large" type="submit" fullWidth variant="contained" sx={{ my: 3 }} loading={formik.isSubmitting}>
          Sign Up
        </Button>

        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', mt: 2 }}>
          Already have an account? <CustomLink to="/sign-in">Sign In</CustomLink>
        </Typography>
      </form>
    </Box>
  );
};

export default SignUpForm;
