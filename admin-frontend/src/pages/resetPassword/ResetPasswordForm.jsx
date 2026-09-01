import { Box, Button, Stack, Typography } from '@mui/material';
import CustomLink from '@/components/CustomLink';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import PasswordInputField from '@/shared/PasswordInputField';

const ResetPasswordForm = ({ formik }) => {
  return (
    <Box sx={{ p: { xs: 5, lg: 12 }, width: '100%', maxWidth: '800px' }}>
      <Typography gutterBottom sx={{ fontSize: 28, fontWeight: 500 }}>
        Reset Password
      </Typography>
      <Typography sx={{ fontSize: 16, fontWeight: 400, color: 'text.secondary', mb: 4 }}>
        Please input your new desired password in the fields below to create a new password and regain access to your account.
      </Typography>

      <PasswordInputField formik={formik} name="password" label="New Password" size="small" />
      <PasswordInputField formik={formik} name="confirmPassword" label="Confirm Password" size="small" />
      <Button size="large" type="submit" fullWidth variant="contained" color="primary" loading={formik.isSubmitting} sx={{ mt: 5 }}>
        Reset Password
      </Button>
      <Stack sx={{ alignItems: 'center', mt: 1 }}>
        <CustomLink to="/sign-in" sx={{ display: 'flex', alignItems: 'center' }}>
          <ArrowBackIosNewRoundedIcon fontSize="small" />
          Back to Sign In
        </CustomLink>
      </Stack>
    </Box>
  );
};

export default ResetPasswordForm;
