import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box } from '@mui/material';
import ChangePasswordForm from './ChangePasswordForm';
import { changePassword } from '../auth/AuthApiCalls';
import { useNavigate } from 'react-router-dom';

const validationSchemaPassword = Yup.object().shape({
  oldPassword: Yup.string().required('Old Password is required'),
  newPassword: Yup.string().min(8, 'New Password must be at least 8 characters long').required('New Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords not matched')
    .required('Confirm New Password is required'),
});

const ChangePassword = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: validationSchemaPassword,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const isSuccess = await changePassword(values.oldPassword, values.newPassword);
      if (isSuccess) {
        resetForm();
        navigate('/', { replace: true });
      }
      setSubmitting(false);
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      onReset={formik.handleReset}
      noValidate
      autoComplete="off"
      sx={{ px: 2, pb: 5 }}
    >
      <ChangePasswordForm formik={formik} />
    </Box>
  );
};

export default ChangePassword;
