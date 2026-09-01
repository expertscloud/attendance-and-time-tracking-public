import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

const BackButton = ({ onBack }) => {
  return (
    <>
      <Tooltip title="Back">
        <IconButton
          onClick={onBack}
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.18)',
            color: 'common.white',
            border: '1px solid rgba(255,255,255,0.35)',
            backdropFilter: 'blur(4px)',
            transition: 'background-color 0.2s ease, transform 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.3)',
              transform: 'translateX(-1px)',
            },
          }}
        >
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default BackButton;
