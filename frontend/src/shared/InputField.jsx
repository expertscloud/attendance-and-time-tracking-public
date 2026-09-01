import { Box, TextField, Typography } from '@mui/material';

const InputField = ({ formik, fullWidth = true, name, label, placeholder, value, onChange, type = 'text', rows = 1, ...rest }) => {
  const fieldValue = formik ? (formik.values[name] ?? '') : value;

  const fieldOnChange = e => {
    e.target.value = e.target.value.trimStart();
    (onChange ?? formik?.handleChange)?.(e);
  };

  return (
    <Box sx={{ width: '100%' }}>
      {label ? <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{label}</Typography> : null}
      <TextField
        fullWidth={fullWidth}
        name={name}
        type={type}
        placeholder={placeholder || label}
        size="small"
        multiline={rows > 1}
        rows={rows}
        sx={{ mb: label ? 1 : 0 }}
        value={fieldValue}
        onChange={fieldOnChange}
        error={formik && formik.touched[name] && Boolean(formik.errors[name])}
        helperText={formik && formik.touched[name] && formik.errors[name]}
        {...rest}
      />
    </Box>
  );
};

export default InputField;
