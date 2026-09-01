import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Checkbox, FormControlLabel } from '@mui/material';
import AppDialog from '@/components/AppDialog';
import InputField from '@/shared/InputField';
import InputDropdownField from '@/shared/InputDropdownField';
import dayjs from 'dayjs';
import { isHolidayType } from '@/utils/helpers';
import { createOrUpdateBulkLeave, createOrUpdateLeave } from '../leaves/LeaveApiCalls';

const LeaveDialog = ({ onClose, cellData, refetch }) => {
  const [loading, setLoading] = useState(false);
  const leaveTypes = useSelector(state => state.MasterData.leaveTypes);

  const validationSchema = Yup.object({
    leaveType: Yup.number().required('Leave type is required'),
    reason: Yup.string().when('leaveType', {
      is: val => isHolidayType(val),
      then: schema => schema.trim().required('Reason is required for holiday'),
      otherwise: schema => schema.optional(),
    }),
  });

  const formik = useFormik({
    initialValues: {
      leaveType: cellData.value?.leave?.leaveType || leaveTypes[0]?.id,
      reason: cellData.value?.leave?.reason || '',
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true);
      const isBulk = isHolidayType(values.leaveType) && values.isBulkHoliday;
      const success = isBulk
        ? await createOrUpdateBulkLeave(cellData, values.reason)
        : await createOrUpdateLeave(cellData, values.leaveType, values.reason);

      if (success) {
        refetch();
        onClose();
      }
      setLoading(false);
    },
  });

  const isHoliday = isHolidayType(formik.values.leaveType);

  return (
    <AppDialog onClose={onClose} maxWidth="sm">
      <DialogTitle>Manage User Leave</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Target: <strong>{cellData?.data?.fullName || 'Selected User'}</strong>
              <br />
              Date: <strong>{dayjs(cellData.colDef.field).format('DD MMM YYYY')}</strong>
            </Typography>

            <InputDropdownField
              name="leaveType"
              label="Leave Type"
              formik={formik}
              items={leaveTypes.map(type => ({ label: type.label, value: type.id }))}
              disableClearable
            />

            <InputField
              formik={formik}
              name="reason"
              label={isHoliday ? 'Reason *' : 'Reason (Optional)'}
              placeholder={isHoliday ? 'Enter reason for holiday' : 'Reason (Optional)'}
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: isHoliday ? 'space-between' : 'flex-end', px: 3, pb: 1, mt: 1 }}>
          {isHoliday ? (
            <FormControlLabel
              control={
                <Checkbox
                  checked={Boolean(formik.values.isBulkHoliday)}
                  onChange={e => formik.setFieldValue('isBulkHoliday', e.target.checked)}
                />
              }
              label="Mark holiday for all users"
            />
          ) : null}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              Save Leave
            </Button>
          </Box>
        </DialogActions>
      </form>
    </AppDialog>
  );
};

export default LeaveDialog;
