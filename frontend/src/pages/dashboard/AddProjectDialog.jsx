import { useFormik } from 'formik';
import * as Yup from 'yup';
import { alpha, Box, Button, DialogActions, DialogContent, Divider, Stack, Typography } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutlineOutlined';
import InputField from '@/shared/InputField';
import AppDialog from '@/components/AppDialog';
import { createProject } from './DashboardApiCalls';

const validationSchema = Yup.object({
  name: Yup.string().required('Project name is required'),
});

const AddProjectDialog = ({ onClose }) => {
  const formik = useFormik({
    initialValues: { name: '', description: '' },
    validationSchema,
    validateOnBlur: true,
    onSubmit: async values => {
      const ok = await createProject(values.name, values.description);
      if (ok) onClose();
    },
  });

  return (
    <AppDialog onClose={onClose} maxWidth="sm">
      <Box sx={{ mx: -2, mt: -2, mb: 2, px: 2, py: 2, bgcolor: theme => alpha(theme.palette.primary.main, 0.08) }}>
        <Stack direction="row" spacing={1.5} sx={{ pr: 4 }}>
          <WorkOutlineIcon sx={{ fontSize: 26, color: 'primary.main' }} />

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.25, letterSpacing: -0.2 }}>
              New project
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, lineHeight: 1.5 }}>
              Add a project to track your working time.
            </Typography>
          </Box>
        </Stack>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ p: 0, pb: 2.5 }}>
          <Stack spacing={2.25}>
            <InputField formik={formik} name="name" label="Project name" placeholder="e.g. Website redesign" />
            <InputField
              formik={formik}
              name="description"
              label="Description (optional)"
              placeholder="Short description of the project"
              rows={3}
            />
          </Stack>
        </DialogContent>
        <Divider sx={{ mb: 3, borderColor: 'divider' }} />
        <DialogActions sx={{ p: 0, gap: 1.25 }}>
          <Button fullWidth type="button" variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button fullWidth type="submit" variant="contained" loading={formik.isSubmitting}>
            Create
          </Button>
        </DialogActions>
      </form>
    </AppDialog>
  );
};

export default AddProjectDialog;
