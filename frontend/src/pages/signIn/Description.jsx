import { Box, Typography } from '@mui/material';

const Description = () => {
  return (
    <Box sx={{ mt: { xs: 7, lg: 'auto' }, my: 'auto', maxWidth: '800px' }}>
      <Typography sx={{ fontSize: { xs: 25, md: 40 }, fontWeight: '600' }} gutterBottom>
        Effortless Attendance & Time Tracking
      </Typography>
      <Typography sx={{ fontSize: 18, fontWeight: 400, color: 'text.secondary' }}>
        Tickly keeps your work day in focus. Check in with a click, switch between projects without losing context, and stay
        present with built-in idle detection that pauses your timer the moment you step away. Activity history is captured automatically so
        you and your team always know exactly where your hours went, no manual logging required.
      </Typography>
    </Box>
  );
};

export default Description;
