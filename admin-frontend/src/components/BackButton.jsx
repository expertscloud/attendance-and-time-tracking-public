import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

const BackButton = ({ onBack, color = 'primary.main' }) => {
  return (
    <>
      <Tooltip title="Back">
        <IconButton onClick={onBack} size="small" sx={{ color }}>
          <ArrowBackIosNewRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </>
  );
};

export default BackButton;
