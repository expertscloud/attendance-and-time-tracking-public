import { Box, Button, Typography, Paper } from '@mui/material';
import PasswordInputField from '@/shared/PasswordInputField';

const ChangePasswordForm = ({ formik }) => {
  return (
    <Box sx={{ width: '100%', maxWidth: '600px', margin: '0 auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
          Change Password
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Please enter your old password and choose a new password.
        </Typography>

        <PasswordInputField formik={formik} name="oldPassword" label="Old Password" size="small" />
        <PasswordInputField formik={formik} name="newPassword" label="New Password" size="small" />
        <PasswordInputField formik={formik} name="confirmPassword" label="Confirm New Password" size="small" />

        <Button size="large" type="submit" fullWidth variant="contained" color="primary" loading={formik.isSubmitting} sx={{ mt: 3 }}>
          Update Password
        </Button>
      </Paper>
    </Box>
  );
};

export default ChangePasswordForm;
