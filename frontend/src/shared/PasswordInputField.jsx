import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useState } from 'react';

const PasswordInputField = ({ formik, label, name, onChange, size = 'small', sx = {} }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { touched, error, value } = formik.getFieldMeta(name);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{label}</Typography>
      <TextField
        fullWidth
        name={name}
        placeholder={label}
        value={value}
        size={size}
        onChange={onChange ? onChange : formik.handleChange}
        error={Boolean(touched && error)}
        helperText={touched && error}
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOffOutlined fontSize="small" /> : <VisibilityOutlined fontSize="small" />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 1, '& .MuiOutlinedInput-root': { borderRadius: 1 }, ...sx }}
      />
    </Box>
  );
};

export default PasswordInputField;
