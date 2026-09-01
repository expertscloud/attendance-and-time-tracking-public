import { useSelector } from 'react-redux';
import { Tooltip, Box } from '@mui/material';

const LeaveCellRenderer = params => {
  const leaveTypeEnum = useSelector(state => state.MasterData.leaveTypeEnum);
  const colId = params.colDef.colId;
  const value = params.data[colId] || 0;
  const metaData = leaveTypeEnum?.[colId];

  const tooltipTitle = metaData.allowance ? `Remaining ${metaData.label}: ${Math.max(0, metaData.allowance - value)}` : '';

  return (
    <Tooltip title={tooltipTitle} arrow placement="top">
      <Box>{value}</Box>
    </Tooltip>
  );
};

export default LeaveCellRenderer;
