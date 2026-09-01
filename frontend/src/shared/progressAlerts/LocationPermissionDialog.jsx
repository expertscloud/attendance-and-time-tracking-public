import { Box, Button, DialogContent, Typography } from '@mui/material';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import AppDialog from '@/components/AppDialog';

const STEPS_BY_PLATFORM = {
  mac: [
    'Click "Open Location Settings" below.',
    'Turn on Location Services at the top, if it is off.',
    'Find Tickly in the app list and switch it on.',
  ],
  windows: ['Click "Open Location Settings" below.', 'Turn on "Location services".', 'Turn on "Let desktop apps access your location".'],
  linux: ['Click "Open Location Settings" below.', 'Turn on Location Services.'],
};

const platform = navigator.userAgent.includes('Mac') ? 'mac' : navigator.userAgent.includes('Windows') ? 'windows' : 'linux';

const LocationPermissionDialog = ({ onClose }) => {
  return (
    <AppDialog onClose={onClose}>
      <DialogContent sx={{ textAlign: 'center' }}>
        <LocationOnRoundedIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Location Permission Required
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
          Tickly needs your exact location for attendance monitoring.
        </Typography>
        <Box component="ol" sx={{ textAlign: 'left', color: 'text.secondary', mb: 1, pl: 3 }}>
          {STEPS_BY_PLATFORM[platform].map(step => (
            <Typography key={step} component="li" variant="body2" sx={{ mb: 0.5 }}>
              {step}
            </Typography>
          ))}
        </Box>
        {platform === 'mac' ? (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
            If Tickly is not in the list yet, quit the app completely and open it again.
          </Typography>
        ) : null}
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Once you have enabled location permission, close this dialog and continue your work.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Button variant="contained" fullWidth size="large" onClick={() => window.ipcRenderer?.invoke?.('open-location-settings')}>
            Open Location Settings
          </Button>
        </Box>
      </DialogContent>
    </AppDialog>
  );
};

export default LocationPermissionDialog;
