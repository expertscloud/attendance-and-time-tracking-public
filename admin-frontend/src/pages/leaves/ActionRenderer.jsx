import { IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';

const ActionRenderer = ({ data }) => {
  const navigate = useNavigate();

  return (
    <Tooltip title="Show Details" placement="left">
      <IconButton color="primary" onClick={() => navigate(`/users/details/${data.id}`)}>
        <OpenInNewIcon />
      </IconButton>
    </Tooltip>
  );
};

export default ActionRenderer;
