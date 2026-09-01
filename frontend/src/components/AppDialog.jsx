import { Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AppDialog = ({ onClose, maxWidth = 'xs', children, slotProps, showCloseButton = true, ...rest }) => {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      slotProps={{ paper: { sx: { padding: 2, ...(slotProps?.paper?.sx || {}) } } }}
      {...rest}
    >
      {showCloseButton && (
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            position: 'absolute',
            right: 10,
            top: 10,
            color: 'text.secondary',
            '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
      {children}
    </Dialog>
  );
};

export default AppDialog;
