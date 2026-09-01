import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Stack } from '@mui/material';
import AppDialog from '@/components/AppDialog';
import InputField from '@/shared/InputField';
import { createLeaveTypeApi, updateLeaveTypeApi } from './LeaveTypeApiCalls';

const validationSchema = Yup.object({
  label: Yup.string().trim().required('Leave type name is required'),
  allowance: Yup.number().typeError('Allowance must be a number').min(0, 'Allowance cannot be negative').required('Allowance is required'),
  color: Yup.string().trim().required('Color is required'),
});

const LeaveTypeFormModal = ({ onClose, selectedType = null }) => {
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(selectedType?.id);
  const isDefault = Boolean(selectedType?.isDefault);

  const formik = useFormik({
    initialValues: { label: selectedType?.label, allowance: selectedType?.allowance, color: selectedType?.color },
    validationSchema,
    onSubmit: async values => {
      setLoading(true);
      const payload = { label: values.label, allowance: values.allowance, color: values.color };
      const success = isEdit ? await updateLeaveTypeApi(selectedType.id, payload) : await createLeaveTypeApi(payload);

      if (success) {
        onClose();
      }
      setLoading(false);
    },
  });

  return (
    <AppDialog onClose={onClose} maxWidth="xs">
      <DialogTitle component="div">
        <Typography component="div" variant="h6" sx={{ fontWeight: 600 }}>
          {isEdit ? 'Edit Leave Type' : 'Add New Leave Type'}
        </Typography>
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <InputField
              formik={formik}
              name="label"
              label="Leave Type Name *"
              placeholder="e.g., Casual, Sick, Maternity"
              disabled={isDefault}
            />
            <InputField formik={formik} name="allowance" label="Annual Allowed Days *" type="number" placeholder="e.g., 7 or 10" />

            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 500, mb: 1 }}>Leave Color *</Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
                <input
                  type="color"
                  name="color"
                  value={formik.values.color}
                  onChange={formik.handleChange}
                  style={{ width: 38, height: 38, padding: 0, border: 'none', cursor: 'pointer' }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                  {formik.values.color}
                </Typography>
              </Stack>
              {formik.touched.color && formik.errors.color ? (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                  {formik.errors.color}
                </Typography>
              ) : null}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </AppDialog>
  );
};

export default LeaveTypeFormModal;
