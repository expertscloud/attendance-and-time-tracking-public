import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from '@tanstack/react-query';
import { Box, Button, Typography } from '@mui/material';
import AppDialog from '@/components/AppDialog';
import InputField from '@/shared/InputField';
import InputDropdownField from '@/shared/InputDropdownField';
import { projectStatusOptions } from '@/utils/constants';
import { createProject, fetchClientOptions, fetchUserOptions, updateProject } from './ProjectsApiCalls';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Project name is required'),
});

const billableOptions = [
  { value: true, label: 'Billable' },
  { value: false, label: 'Non-Billable' },
];

const statusItems = projectStatusOptions.map(o => ({ value: o.id, label: o.label }));

const isoOrEmpty = dateStr => {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
};

const ProjectForm = ({ onClose, projectData = null, refetch }) => {
  const { data: clientOptions = [] } = useQuery({ queryKey: ['client-options'], queryFn: fetchClientOptions });
  const { data: userOptions = [] } = useQuery({ queryKey: ['user-options'], queryFn: fetchUserOptions });

  const formik = useFormik({
    initialValues: {
      name: projectData?.name || '',
      shortCode: projectData?.shortCode || '',
      description: projectData?.description || '',
      clientId: projectData?.clientId ?? null,
      teamLeadId: projectData?.teamLeadId ?? null,
      status: projectData?.status?.id ?? null,
      isBillable: projectData?.isBillable ?? false,
      awsAccountId: projectData?.awsAccountId || '',
      startDate: projectData?.startDate ? new Date(projectData.startDate).toISOString().slice(0, 10) : '',
      plannedEndDate: projectData?.plannedEndDate ? new Date(projectData.plannedEndDate).toISOString().slice(0, 10) : '',
      actualEndDate: projectData?.actualEndDate ? new Date(projectData.actualEndDate).toISOString().slice(0, 10) : '',
      memberIds: projectData?.memberIds || [],
    },
    validationSchema,
    onSubmit: async values => {
      const payload = {
        name: values.name,
        shortCode: values.shortCode || undefined,
        description: values.description || undefined,
        clientId: values.clientId ?? undefined,
        teamLeadId: values.teamLeadId ?? undefined,
        status: values.status ?? undefined,
        isBillable: values.isBillable,
        awsAccountId: values.awsAccountId || undefined,
        startDate: isoOrEmpty(values.startDate),
        plannedEndDate: isoOrEmpty(values.plannedEndDate),
        actualEndDate: isoOrEmpty(values.actualEndDate),
        memberIds: values.memberIds?.length ? values.memberIds : undefined,
      };

      const isSuccess = projectData ? await updateProject(projectData.id, payload) : await createProject(payload);

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
          {projectData ? 'Update Project' : 'Create New Project'}
        </Typography>

        <form onSubmit={formik.handleSubmit} noValidate autoComplete="off" style={{ marginTop: '5px' }}>
          <InputField formik={formik} name="name" label="Name" />
          <InputField formik={formik} name="shortCode" label="Short Code" />
          <InputField formik={formik} name="description" label="Description" />
          <InputDropdownField formik={formik} items={clientOptions} name="clientId" label="Client" />
          <InputDropdownField formik={formik} items={userOptions} name="teamLeadId" label="Team Lead" />
          <InputDropdownField formik={formik} items={userOptions} name="memberIds" label="Members" multiSelect />
          <InputDropdownField formik={formik} items={statusItems} name="status" label="Status" />
          <InputDropdownField formik={formik} items={billableOptions} name="isBillable" label="Billable" />
          <InputField formik={formik} name="startDate" label="Start Date" type="date" />
          <InputField formik={formik} name="plannedEndDate" label="Planned End Date" type="date" />
          <InputField formik={formik} name="actualEndDate" label="Actual End Date" type="date" />
          <InputField formik={formik} name="awsAccountId" label="AWS Account Id" />
          <Button size="small" type="submit" fullWidth variant="contained" sx={{ my: 1 }} loading={formik.isSubmitting}>
            {projectData ? 'Update Project' : 'Create Project'}
          </Button>
        </form>
      </Box>
    </AppDialog>
  );
};

export default ProjectForm;
