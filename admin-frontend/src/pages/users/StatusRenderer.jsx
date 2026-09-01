import { Chip } from '@mui/material';

const StatusRenderer = ({ value }) => {
  const isActive = Boolean(value);
  return (
    <Chip
      size="small"
      label={isActive ? 'Active' : 'Inactive'}
      sx={{ bgcolor: isActive ? 'primary.main' : 'primaryLight.main', color: 'white' }}
    />
  );
};

export default StatusRenderer;
