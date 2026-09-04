import { Dialog, DialogContent, DialogTitle, Typography, Button, Box } from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const UpdateAppDialog = () => {
  return (
    <Dialog open={true} maxWidth="xs" fullWidth>
      <DialogTitle component="div" sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
        <WarningAmberRoundedIcon sx={{ fontSize: 60, color: 'warning.main', mb: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          App Update Required
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ textAlign: 'center', pb: 4, px: 4 }}>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          A new version of the application is available. For security and compatibility, please update your app to the latest version to
          continue using it.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          {import.meta.env.VITE_UPDATES_URL ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              href={import.meta.env.VITE_UPDATES_URL}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ px: 4, py: 1.5, fontWeight: 600, textTransform: 'none', width: '100%' }}
            >
              Update Now
            </Button>
          ) : (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Ask your administrator for the latest installer, or build from source:
              <Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.85rem', display: 'block', mt: 1 }}>
                docker build -f Dockerfile.release -t my-release-image .
                <br />
                docker run --env-file .env.release my-release-image
              </Box>
            </Typography>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAppDialog;
