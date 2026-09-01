import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import OTPInput from 'react-otp-input';

const OtpVerification = ({ formik }) => {
  const theme = useTheme();
  const [otp, setOtp] = useState('');

  const handleChange = otpValue => {
    setOtp(otpValue);
    formik.setFieldValue('otpCode', otpValue);
  };

  return (
    <Box sx={{ p: { xs: 5, lg: 12 }, width: '100%', maxWidth: '800px' }}>
      <Typography gutterBottom sx={{ fontSize: 28, fontWeight: 500 }}>
        Enter Verification Code
      </Typography>
      <Typography sx={{ fontSize: 16, fontWeight: 400, color: 'text.secondary', mb: 4 }}>
        Weve sent a verification code to your registered email address. Please enter the code to continue.
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, mb: 4 }}>
        <OTPInput
          value={otp}
          onChange={handleChange}
          numInputs={4}
          renderSeparator={
            <Box component="span" sx={{ mx: 1 }}>
              -
            </Box>
          }
          inputType="tel"
          renderInput={props => (
            <input
              {...props}
              style={{
                height: '48px',
                width: '48px',
                textAlign: 'center',
                padding: '10px',
                fontSize: '20px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                outline: 'none',
              }}
              onFocus={e => (e.target.style.borderColor = theme.palette.primary.main)}
            />
          )}
          shouldAutoFocus
        />
      </Box>
      {formik.touched.otpCode && formik.errors.otpCode && (
        <Typography variant="body2" sx={{ color: 'error.main', mb: 2 }}>
          {formik.errors.otpCode}
        </Typography>
      )}

      <Button size="large" type="submit" fullWidth variant="contained" loading={formik.isSubmitting}>
        Continue
      </Button>
    </Box>
  );
};

export default OtpVerification;
