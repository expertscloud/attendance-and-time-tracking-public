import { Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AppDialog = ({ onClose, maxWidth = 'xs', children }) => {
  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth={maxWidth} slotProps={{ paper: { sx: { padding: 2 } } }}>
      <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
        <CloseIcon />
      </IconButton>
      {children}
    </Dialog>
  );
};

export default AppDialog;
