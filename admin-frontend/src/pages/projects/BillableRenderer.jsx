import { Chip } from '@mui/material';

const BillableRenderer = ({ value }) => {
  const isBillable = Boolean(value);
  return (
    <Chip
      size="small"
      label={isBillable ? 'Billable' : 'Non-Billable'}
      sx={{ bgcolor: isBillable ? 'primary.main' : 'primaryLight.main', color: 'white' }}
    />
  );
};

export default BillableRenderer;
