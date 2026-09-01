import Box from '@mui/material/Box';

const PaperBox = ({ children, sx = {} }) => (
  <Box sx={{ bgcolor: 'background.paper', borderRadius: '8px', p: '15px', ...sx }}>{children}</Box>
);

export default PaperBox;
