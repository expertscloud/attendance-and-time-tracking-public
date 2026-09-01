import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, DialogContent, DialogActions, Typography, Divider } from '@mui/material';
import UpdateIcon from '@mui/icons-material/Update';
import AppDialog from '@/components/AppDialog';
import InputDropdownField from '@/shared/InputDropdownField';
import { userTypeEnum, userRoleOptions } from '@/utils/constants';
import { updateUserRole } from './UsersApiCalls';

const validationSchema = Yup.object().shape({
  role: Yup.number().nullable().required('Role is required'),
});

const UserRoleDialog = ({ closeDialog, data }) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { role: data.type || userTypeEnum.User },
    validationSchema,
    onSubmit: async values => {
      setLoading(true);
      await updateUserRole(data.id, values.role);
      closeDialog();
      setLoading(false);
    },
  });

  return (
    <AppDialog onClose={closeDialog}>
      <DialogContent sx={{ p: '20px 10px', textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <UpdateIcon color="primary" sx={{ fontSize: 48 }} />
        </Box>
        <Typography variant="h6" gutterBottom>
          Change User Role
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Update the role for <strong>{data.fullName}</strong>.
        </Typography>
        <Box sx={{ textAlign: 'left' }}>
          <InputDropdownField formik={formik} name="role" label="Role" items={userRoleOptions} disableClearable={true} />
        </Box>
      </DialogContent>
      <Divider sx={{ mb: 2 }} />
      <DialogActions>
        <Button fullWidth variant="outlined" onClick={closeDialog}>
          Cancel
        </Button>
        <Button loading={loading} fullWidth variant="contained" onClick={formik.handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </AppDialog>
  );
};

export default UserRoleDialog;
