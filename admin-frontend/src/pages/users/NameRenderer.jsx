import { getInitials } from '@/utils/helpers';
import { Avatar, Box, Typography } from '@mui/material';

const NameRenderer = ({ data }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
      <Avatar
        src={data.profileSignedUrl}
        alt={data.fullName}
        sx={{ bgcolor: 'primary.main', color: 'white', width: 32, height: 32, fontSize: 14 }}
      >
        {getInitials(data.fullName)}
      </Avatar>
      <Typography variant="body2" fontWeight={500} noWrap sx={{ lineHeight: 1 }}>
        {data.fullName}
      </Typography>
    </Box>
  );
};

export default NameRenderer;
