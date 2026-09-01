import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthCard from '@/shared/AuthCard';
import ForgotPasswordForm from './ForgotPasswordForm';
import OtpVerification from './OtpVerification';
import ResetPasswordForm from '../resetPassword/ResetPasswordForm';
import { forgotPassword, resetPassword, verifyForgotPassword } from '../auth/AuthApiCalls';
import Description from '../signIn/Description';

const validationSchemaEmail = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const validationSchemaOtp = Yup.object().shape({
  otpCode: Yup.string().length(4, 'OTP must be exactly 4 digits').required('OTP is required'),
});

const validationSchemaPassword = Yup.object().shape({
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords not matched')
    .required('Confirm Password is required'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const getValidationSchema = () => {
    switch (step) {
      case 1:
        return validationSchemaEmail;
      case 2:
        return validationSchemaOtp;
      case 3:
        return validationSchemaPassword;
      default:
        return validationSchemaEmail;
    }
  };

  const formik = useFormik({
    initialValues: { email: '', otpCode: '', password: '', confirmPassword: '' },
    validationSchema: getValidationSchema(),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      if (step === 1) {
        const isSuccess = await forgotPassword(values.email);
        if (isSuccess) {
          setStep(2);
        }
      } else if (step === 2) {
        const isSuccess = await verifyForgotPassword(values.email, values.otpCode);
        if (isSuccess) {
          setStep(3);
        }
      } else if (step === 3) {
        const isSuccess = await resetPassword(values.email, values.otpCode, values.password);
        if (isSuccess) {
          navigate('/sign-in', { replace: true });
        }
      }
      setSubmitting(false);
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
        {step === 1 && <ForgotPasswordForm formik={formik} />}
        {step === 2 && <OtpVerification formik={formik} />}
        {step === 3 && <ResetPasswordForm formik={formik} />}
      </Grid>
    </Grid>
  );
};

export default ForgotPassword;
