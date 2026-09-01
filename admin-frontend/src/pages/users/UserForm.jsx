import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Avatar, Badge, Box, Button, IconButton, Stack, Typography } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import AppDialog from '@/components/AppDialog';
import InputField from '@/shared/InputField';
import InputDropdownField from '@/shared/InputDropdownField';
import { designationOptions, employmentTypeOptions, genderOptions, workModeOptions } from '@/utils/constants';
import { createUser, updateUser } from './UsersApiCalls';
import PasswordInputField from '@/shared/PasswordInputField';
import { getInitials } from '@/utils/helpers';

const validationSchema = Yup.object().shape({
  fullName: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().when('isEdit', {
    is: false,
    then: schema => schema.required('Password is required'),
    otherwise: schema => schema.notRequired(),
  }),
  designation: Yup.number().nullable().required('Designation is required'),
  employmentType: Yup.number().nullable().required('Employment type is required'),
  workMode: Yup.number().nullable().required('Work mode is required'),
});

const activeOptions = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

const toDropdownItems = options => options.map(o => ({ value: o.id, label: o.label }));

const designationItems = toDropdownItems(designationOptions);
const employmentTypeItems = toDropdownItems(employmentTypeOptions);
const workModeItems = toDropdownItems(workModeOptions);
const genderItems = toDropdownItems(genderOptions);

const UserForm = ({ onClose, userData = null, refetch }) => {
  const [imagePreview, setImagePreview] = useState(userData?.profileSignedUrl || null);

  const formik = useFormik({
    initialValues: {
      fullName: userData?.fullName || '',
      email: userData?.email || '',
      password: '',
      isActive: userData?.isActive ?? true,
      designation: userData?.designation?.id ?? null,
      employmentType: userData?.employmentType?.id ?? null,
      workMode: userData?.workMode?.id ?? 1,
      employeeId: userData?.employeeId ?? '',
      phoneNumber: userData?.phoneNumber || '',
      emergencyContactNumber: userData?.emergencyContactNumber || '',
      dob: userData?.dob,
      joiningDate: userData?.joiningDate,
      gender: userData?.gender?.id ?? 1,
      address: userData?.address || '',
      image: null,
    },
    validationSchema,
    onSubmit: async values => {
      let isSuccess = false;

      if (userData) {
        isSuccess = await updateUser(userData.id, values);
      } else {
        isSuccess = await createUser(values);
      }
      if (isSuccess) {
        onClose();
        refetch();
      }
    },
  });

  const handleImageChange = event => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    formik.setFieldValue('image', file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <AppDialog onClose={onClose} maxWidth="sm">
      <Box>
        <Typography gutterBottom sx={{ fontWeight: 500, fontSize: 24 }}>
          {userData ? 'Update User' : 'Create New User'}
        </Typography>

        <form onSubmit={formik.handleSubmit} noValidate autoComplete="off" style={{ marginTop: '5px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                <IconButton
                  component="label"
                  size="small"
                  color="primary"
                  sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', '&:hover': { bgcolor: 'background.paper' } }}
                >
                  <PhotoCameraIcon fontSize="small" />
                  <input hidden accept="image/*" type="file" onChange={handleImageChange} />
                </IconButton>
              }
            >
              <Avatar src={imagePreview} sx={{ width: 100, height: 100, fontSize: 28, fontWeight: 600 }}>
                {!imagePreview ? getInitials(formik.values.fullName) : null}
              </Avatar>
            </Badge>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <InputField formik={formik} name="fullName" label="Name" />
            <InputField formik={formik} name="employeeId" label="Employee ID" type="number" />
          </Stack>

          <InputField formik={formik} name="email" label="Email" type="email" />
          {!userData ? <PasswordInputField formik={formik} name="password" label="Password" /> : null}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <InputField formik={formik} name="phoneNumber" label="Phone Number" />
            <InputField formik={formik} name="emergencyContactNumber" label="Emergency Contact Number" />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <InputField formik={formik} name="dob" label="Date of Birth" type="date" />
            <InputField formik={formik} name="joiningDate" label="Joining Date" type="date" />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <InputDropdownField formik={formik} items={designationItems} name="designation" label="Designation" />
            <InputDropdownField formik={formik} items={employmentTypeItems} name="employmentType" label="Employment Type" />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <InputDropdownField formik={formik} items={workModeItems} name="workMode" label="Work Mode" />
            <InputDropdownField formik={formik} items={activeOptions} name="isActive" label="Status" />
          </Stack>
          <InputDropdownField formik={formik} items={genderItems} name="gender" label="Gender" />
          <InputField formik={formik} name="address" label="Address" rows={3} />
          <Button size="small" type="submit" fullWidth variant="contained" sx={{ my: 1 }} loading={formik.isSubmitting}>
            {userData ? 'Update User' : 'Create User'}
          </Button>
        </form>
      </Box>
    </AppDialog>
  );
};

export default UserForm;
