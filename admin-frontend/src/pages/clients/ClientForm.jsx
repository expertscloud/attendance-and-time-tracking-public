import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Typography } from '@mui/material';
import AppDialog from '@/components/AppDialog';
import InputField from '@/shared/InputField';
import { createClient, updateClient } from './ClientsApiCalls';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Client name is required'),
  email: Yup.string().email('Invalid email address').nullable(),
});

const ClientForm = ({ onClose, clientData = null, refetch }) => {
  const formik = useFormik({
    initialValues: {
      name: clientData?.name || '',
      email: clientData?.email || '',
      phone: clientData?.phone || '',
      website: clientData?.website || '',
      addressLine1: clientData?.addressLine1 || '',
      addressLine2: clientData?.addressLine2 || '',
      city: clientData?.city || '',
      state: clientData?.state || '',
      country: clientData?.country || '',
      postalCode: clientData?.postalCode || '',
      fullAddress: clientData?.fullAddress || '',
      awsAccountId: clientData?.awsAccountId || '',
    },
    validationSchema,
    onSubmit: async values => {
      const payload = Object.fromEntries(
        Object.entries(values).filter(([key, v]) => key === 'name' || (v !== '' && v != null))
      );

      const isSuccess = clientData ? await updateClient(clientData.id, payload) : await createClient(payload);

      if (isSuccess) {
        onClose();
        refetch?.();
      }
    },
  });

  return (
    <AppDialog onClose={onClose} maxWidth="sm">
      <Box>
        <Typography gutterBottom sx={{ fontWeight: 500, fontSize: 24 }}>
          {clientData ? 'Update Client' : 'Create New Client'}
        </Typography>

        <form onSubmit={formik.handleSubmit} noValidate autoComplete="off" style={{ marginTop: '5px' }}>
          <InputField formik={formik} name="name" label="Name" />
          <InputField formik={formik} name="email" label="Email" type="email" />
          <InputField formik={formik} name="phone" label="Phone" />
          <InputField formik={formik} name="website" label="Website" />
          <InputField formik={formik} name="addressLine1" label="Address Line 1" />
          <InputField formik={formik} name="addressLine2" label="Address Line 2" />
          <InputField formik={formik} name="city" label="City" />
          <InputField formik={formik} name="state" label="State" />
          <InputField formik={formik} name="country" label="Country" />
          <InputField formik={formik} name="postalCode" label="Postal Code" />
          <InputField formik={formik} name="fullAddress" label="Full Address" />
          <InputField formik={formik} name="awsAccountId" label="AWS Account Id" />
          <Button size="small" type="submit" fullWidth variant="contained" sx={{ my: 1 }} loading={formik.isSubmitting}>
            {clientData ? 'Update Client' : 'Create Client'}
          </Button>
        </form>
      </Box>
    </AppDialog>
  );
};

export default ClientForm;
