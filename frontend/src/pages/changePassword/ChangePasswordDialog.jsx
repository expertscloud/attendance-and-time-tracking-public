import { alpha, Box, Button, DialogActions, DialogContent, Divider, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { handleChangePassword } from '../auth/AuthApiCalls';
import PasswordInputField from '@/shared/PasswordInputField';
import AppDialog from '@/components/AppDialog';
import { KeyRounded } from '@mui/icons-material';

const validationSchema = Yup.object().shape({
  previousPassword: Yup.string().required('Current Password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .notOneOf([Yup.ref('previousPassword')], 'New password must be different from current password')
    .required('New Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

const ChangePasswordDialog = ({ onClose }) => {
  const formik = useFormik({
    initialValues: { previousPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async values => {
      const isSuccess = await handleChangePassword(values.previousPassword, values.newPassword);
      if (isSuccess) {
        formik.resetForm();
        onClose();
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <AppDialog onClose={formik.isSubmitting ? undefined : handleClose} maxWidth="sm">
      <Box sx={{ mx: -2, mt: -2, mb: 2, px: 2, py: 2, bgcolor: theme => alpha(theme.palette.primary.main, 0.08) }}>
        <Stack direction="row" spacing={1.5} sx={{ pr: 4 }}>
          <KeyRounded sx={{ fontSize: 26, color: 'primary.main' }} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.25, letterSpacing: -0.2 }}>
              Change Password
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, lineHeight: 1.5 }}>
              Enter your current password and a new password to secure your account.
            </Typography>
          </Box>
        </Stack>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ p: 0, pb: 2.5 }}>
          <Stack spacing={2}>
            <PasswordInputField formik={formik} name="previousPassword" label="Current Password" />

            <PasswordInputField formik={formik} name="newPassword" label="New Password" />

            <PasswordInputField formik={formik} name="confirmPassword" label="Confirm New Password" />
          </Stack>
        </DialogContent>
        <Divider sx={{ mb: 3, borderColor: 'divider' }} />
        <DialogActions sx={{ p: 0, gap: 1.25 }}>
          <Button fullWidth type="button" variant="outlined" onClick={handleClose} disabled={formik.isSubmitting}>
            Cancel
          </Button>
          <Button fullWidth type="submit" variant="contained" loading={formik.isSubmitting} onClick={formik.submitForm}>
            Change Password
          </Button>
        </DialogActions>
      </form>
    </AppDialog>
  );
};

export default ChangePasswordDialog;
